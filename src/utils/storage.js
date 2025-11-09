// Repo / branch / auth
const REPO = "kskoulini/pixels";          // <owner>/<repo>
const BRANCH = "main";                // branch that holds your JSON (e.g., "main" or "comments")
const TOKEN = "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";

// Paths (in the repository)
const COMMENTS_PATH = "data/comments";           // legacy (kept for reference)
const COMMENTS_REPO_PATH_NEW = "public/data/comments"; // current location for per-category JSON
const PUBLIC_DATA_BASE = "public/data";          // base for items.json etc.

// GitHub API roots
const API_ROOT = "https://api.github.com/repos"; // used by addComment writer
const GH_API_ROOT = "https://api.github.com/repos"; // reader helper uses this too

// LocalStorage keys
const KEY_PROGRESS = "pixels_progress_v1";
export const KEY_COMMENTS = "pixels_comments_v1";
export const KEY_COMMENTS_BOOTSTRAP = "pixels_comments_bootstrap_v1";
const KEY_ITEMS = "pixels_items_v1";

// -------------------- utils for progress --------------------------------------
function isArr(x) { return Array.isArray(x); }
function ensureArr(p, cat) { if (!isArr(p[cat])) p[cat] = []; return p[cat]; }

export function getSeenIds(p, cat) { return isArr(p?.[cat]) ? p[cat] : []; }
export function getSeenCount(p, cat) { return getSeenIds(p, cat).length; }

export function markSeen(p, cat, id) {
  const arr = ensureArr(p, cat);
  if (!arr.includes(id)) arr.push(id);
  return p;
}

export function getProgress() {
  try { return JSON.parse(localStorage.getItem(KEY_PROGRESS)) || {}; }
  catch { return {}; }
}

export function setProgress(p) {
  localStorage.setItem(KEY_PROGRESS, JSON.stringify(p || {}));
}

export function normalizeProgress(oldP, items) {
  const p = { ...oldP };
  const cats = new Set(["all", ...items.map(i => i.category)]);
  for (const cat of cats) {
    const v = p[cat];
    if (typeof v === "number") {
      const list = cat === "all" ? items : items.filter(i => i.category === cat);
      p[cat] = list.slice(0, v).map(i => i.id);
    } else if (!Array.isArray(v)) {
      p[cat] = [];
    }
  }
  setProgress(p);
  return p;
}

// -------------------- comments (local cache) ----------------------------------
export function getComments() {
  try { return JSON.parse(localStorage.getItem(KEY_COMMENTS)) || {}; }
  catch { return {}; }
}

export function setComments(map) {
  localStorage.setItem(KEY_COMMENTS, JSON.stringify(map || {}));
  // <-- notify this tab that comments changed
  window.dispatchEvent(new Event('pixels:comments-updated'));
}

/** Merge remote comments into local map (dedupe by comment.id) */
function mergeComments(localMap, remoteMap) {
  const out = { ...localMap };
  for (const [itemId, remoteList] of Object.entries(remoteMap || {})) {
    const localList = Array.isArray(out[itemId]) ? out[itemId] : [];
    const seen = new Set(localList.map(c => c.id));
    out[itemId] = localList.concat((remoteList || []).filter(c => c && c.id && !seen.has(c.id)));
  }
  return out;
}

// -------------------- GitHub Contents API reader ------------------------------
// Replace the existing helper with this:
async function fetchGithubJsonAt(repoPath) {
  // add a cache-bust query so browsers/CDNs don't serve stale content
  const url = `${GH_API_ROOT}/${REPO}/contents/${repoPath}?ref=${BRANCH}&cb=${Date.now()}`;

  const res = await fetch(url, {
    // DO NOT send "Cache-Control" request header (it triggers CORS preflight failure)
    headers: {
      Authorization: `token ${TOKEN}`,
      Accept: "application/vnd.github+json"
    },
    cache: "no-store"  // fine to keep this; it's a fetch option, not a header
  });

  if (!res.ok) {
    console.warn("GitHub contents fetch failed", { url, status: res.status });
    return null;
  }

  const meta = await res.json(); // { content (base64), sha, ... }
  const b64 = meta?.content;
  if (!b64) return null;

  try {
    const text = atob(b64.replace(/\n/g, ""));
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to decode/parse JSON at", repoPath, e);
    return null;
  }
}

// -------------------- remote fetchers (use Contents API) ----------------------
async function fetchCategoryComments(category) {
  const path = `${COMMENTS_REPO_PATH_NEW}/${encodeURIComponent(category)}.json`;
  return fetchGithubJsonAt(path); // -> { [itemId]: Comment[] } | null
}

async function fetchJsonSafe(category) {
  const path = `${COMMENTS_REPO_PATH_NEW}/${encodeURIComponent(category)}.json`;
  return fetchGithubJsonAt(path);
}

/** Always-fresh fetch of items.json */
export async function fetchItemsJson() {
  const path = `${PUBLIC_DATA_BASE}/items.json`;
  return fetchGithubJsonAt(path); // -> { categories: [...], items: [...] } | null
}

export async function replaceCommentsFromGithub(categories = []) {
  const ids = categories.filter(Boolean);
  if (!ids.length) {
    setComments({});                                    // clear to empty
    localStorage.setItem(KEY_COMMENTS_BOOTSTRAP, String(Date.now()));
    return {};
  }

  const results = await Promise.allSettled(ids.map(fetchJsonSafe));

  // Build fresh object from scratch
  let fresh = {};
  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    const map = r.value;
    if (map && typeof map === "object" && !Array.isArray(map)) {
      // reuse your mergeComments, but into `fresh` (not existing cache)
      fresh = mergeComments(fresh, map);
    }
  }

  // Write whatever we got (including `{}` if nothing)
  setComments(fresh);
  localStorage.setItem(KEY_COMMENTS_BOOTSTRAP, String(Date.now()));
  return fresh;
}

// -------------------- bootstrap & refresh -------------------------------------
// hard-replaces localStorage when replaceLocal=true
export async function bootstrapCommentsFromStatic(
  categories,
  force = false,
  replaceLocal = false,
  /* allowEmpty unused now (kept for signature compat) */ _allowEmpty = false,
  debugMessage = ''
) {
  // console.log('bootstrapCommentsFromStatic:', debugMessage);

  // If we're doing a hard refresh, nuke local cache up front
  if (replaceLocal) {
    localStorage.removeItem(KEY_COMMENTS);
    localStorage.removeItem(KEY_COMMENTS_BOOTSTRAP);
  }

  try {
    const already = localStorage.getItem(KEY_COMMENTS_BOOTSTRAP);
    if (already && !force) return;

    const idsForFiles = (categories || []).filter(Boolean);
    if (!idsForFiles.length) {
      // if replaceLocal was requested and there are no categories, keep it empty
      if (replaceLocal) setComments({});
      localStorage.setItem(KEY_COMMENTS_BOOTSTRAP, String(Date.now()));
      return;
    }

    const results = await Promise.allSettled(idsForFiles.map(fetchJsonSafe));

    // When replacing, ALWAYS build from scratch.
    // When not replacing, start from current cache.
    let combined = replaceLocal ? {} : getComments();

    for (const r of results) {
      if (r.status !== 'fulfilled') continue;
      const map = r.value;
      if (map && typeof map === 'object' && !Array.isArray(map)) {
        combined = mergeComments(combined, map);
      }
    }

    // Write exactly what we built (even if it's {})
    setComments(combined);
    localStorage.setItem(KEY_COMMENTS_BOOTSTRAP, String(Date.now()));
  } catch (e) {
    console.warn('Comment bootstrap failed:', e);
    // On failure during hard replace, ensure cache remains empty rather than stale
    if (replaceLocal) {
      setComments({});
      localStorage.setItem(KEY_COMMENTS_BOOTSTRAP, String(Date.now()));
    }
  }
}

export function getItemsCache() {
  try { return JSON.parse(localStorage.getItem(KEY_ITEMS)) || { categories: [], items: [] }; }
  catch { return { categories: [], items: [] }; }
}

export function setItemsCache(payload) {
  localStorage.setItem(KEY_ITEMS, JSON.stringify(payload || { categories: [], items: [] }));
}

/** Load latest items into localStorage, return the payload used */
export async function refreshItems(force = true) {
  const data = await fetchItemsJson();
  if (data && Array.isArray(data.items) && Array.isArray(data.categories)) {
    setItemsCache(data);
    return data;
  }
  return getItemsCache();
}

// -------------------- writer: addComment (kept minimal) -----------------------
/**
 * Add a comment locally and push to GitHub per-category JSON file.
 * Writes to: public/data/comments/<category>.json on branch BRANCH.
 */
export async function addComment(itemId, text, alias, category = "misc") {
  // local cache (instant UI)
  const all = getComments();
  const list = all[itemId] || [];
  const newComment = {
    id: String(Date.now()),
    text,
    alias: alias || "anonymous",
    at: new Date().toISOString()
  };
  list.push(newComment);
  all[itemId] = list;
  localStorage.setItem(KEY_COMMENTS, JSON.stringify(all));

  // --- Remote sync (GitHub)
  try {
    const jsonFile = `${COMMENTS_REPO_PATH_NEW}/${category}.json`;

    let pathToUse = jsonFile;
    let sha = null;
    let comments = {};

    const tryLoad = async (path) => {
      const res = await fetch(`${API_ROOT}/${REPO}/contents/${path}?ref=${BRANCH}`, {
        headers: { Authorization: `token ${TOKEN}`, Accept: "application/vnd.github+json" }
      });
      if (!res.ok) return { ok: false };
      const json = await res.json();
      const content = json?.content ? JSON.parse(atob(json.content)) : {};
      return { ok: true, sha: json.sha, data: content };
    };

    // Load current file at the new location
    const r = await tryLoad(pathToUse);
    if (r.ok) {
      sha = r.sha;
      comments = r.data || {};
    } else {
      comments = {};
    }

    // Ensure structure { [itemId]: Comment[] }
    if (typeof comments !== "object" || Array.isArray(comments) || comments === null) {
      comments = {};
    }
    if (!Array.isArray(comments[itemId])) comments[itemId] = [];
    comments[itemId].push(newComment);

    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(comments, null, 2))));

    // Commit to the NEW location under /public
    const putRes = await fetch(`${API_ROOT}/${REPO}/contents/${pathToUse}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json"
      },
      body: JSON.stringify({
        message: `chore(comments): add note for ${category}/${itemId}`,
        content: encoded,
        branch: BRANCH,
        ...(sha ? { sha } : {})
      })
    });

    if (!putRes.ok) {
      const errText = await putRes.text();
      console.error("❌ Failed to push to GitHub:", errText);
    } else {
      console.log(`✅ Comment committed at ${pathToUse}`);
    }
  } catch (err) {
    console.error("Error updating comment JSON:", err);
  }

  return list;
}

// ==============================================================================


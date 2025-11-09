const REPO = "kskoulini/pixels"; // e.g. "koulini/pixelpenpals"
const BRANCH = "comments";                // or whichever branch you host JSON under
const TOKEN = "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";           // fine-grained PAT for this repo only
const COMMENTS_PATH = "data/comments"; // folder path in repo (must exist)

const API_ROOT = "https://api.github.com/repos";
const COMMENTS_REPO_PATH_NEW = "public/data/comments";
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/main/public`;

const KEY_PROGRESS = "pixels_progress_v1";
export const KEY_COMMENTS = "pixels_comments_v1";
const KEY_COMMENTS_BOOTSTRAP = 'pixels_comments_bootstrap_v1'; // bump if structure changes
const KEY_ITEMS = 'pixels_items_v1';

function isArr(x){ return Array.isArray(x); }

function ensureArr(p, cat){ if (!isArr(p[cat])) p[cat] = []; return p[cat]; }

export function getSeenIds(p, cat){ return isArr(p?.[cat]) ? p[cat] : []; }
export function getSeenCount(p, cat){ return getSeenIds(p, cat).length; }

export function markSeen(p, cat, id){
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

export function normalizeProgress(oldP, items){
  const p = { ...oldP };
  const cats = new Set(['all', ...items.map(i => i.category)]);
  for (const cat of cats){
    const v = p[cat];
    if (typeof v === 'number') {
      const list = cat === 'all' ? items : items.filter(i => i.category === cat);
      p[cat] = list.slice(0, v).map(i => i.id);
    } else if (!Array.isArray(v)) {
      p[cat] = [];
    }
  }
  setProgress(p);
  return p;
}

export function getComments() {
  try { return JSON.parse(localStorage.getItem(KEY_COMMENTS)) || {}; }
  catch { return {}; }
}

export function setComments(map) {
  localStorage.setItem(KEY_COMMENTS, JSON.stringify(map || {}));
}

/**
 * Merge remote comments into local map (dedupe by comment.id)
 */
function mergeComments(localMap, remoteMap) {
  const out = { ...localMap };
  for (const [itemId, remoteList] of Object.entries(remoteMap || {})) {
    const localList = Array.isArray(out[itemId]) ? out[itemId] : [];
    const seen = new Set(localList.map(c => c.id));
    out[itemId] = localList.concat((remoteList || []).filter(c => c && c.id && !seen.has(c.id)));
  }
  return out;
}

async function fetchCategoryComments(category) {
  const url = `${RAW_BASE}/data/comments/${encodeURIComponent(category)}.json?cb=${Date.now()}`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    if (!ct.includes('application/json')) return null;
    return await res.json(); // { [itemId]: Comment[] }
  } catch { return null; }
}

/**
 * Fetch JSON helper with graceful 404 handling
 */
// async function fetchJsonSafe(category) {
//   const base = (process.env.PUBLIC_URL || '').replace(/\/+$/, ''); // '' in dev, '/<repo>' on GH Pages
//   const url  = `${base}/data/comments/${encodeURIComponent(category)}.json`;

//   try {
//     const res = await fetch(url, { cache: 'no-store' });

//     if (!res.ok) {
//       console.warn('fetch failed', { url, status: res.status });
//       return null;
//     }

//     const data = await res.json();
//     // console.log('loaded', url, data);
//     return data;
//   } catch (e) {
//     // console.error('for ',url,' |,fetch error:', e);
//     return null;
//   }
// }

async function fetchJsonSafe(category) {
  const url = `${RAW_BASE}/data/comments/${encodeURIComponent(category)}.json?cb=${Date.now()}`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;           // 404 / stale etc.
    return await res.json();            // expected: { [itemId]: Comment[] }
  } catch {
    return null;
  }
}


/**
 * Bootstrap comments from static JSON files into localStorage.
 * - categories: array of category IDs you have files for (e.g. ['reels','music','stories','notes','misc'])
 * - force: set true to re-run even if already bootstrapped
 *
 * Files must live under: public/data/comments/<category>.json
 */
export async function bootstrapCommentsFromStatic(categories, force = false) {
  try {
    const already = localStorage.getItem(KEY_COMMENTS_BOOTSTRAP);
    if (already && !force) return;

    const idsForFiles = (categories || []).filter(Boolean);

    // ← this is the line you asked to include:
    const results = await Promise.all(idsForFiles.map(fetchJsonSafe));
    // console.log(results);

    // Merge all fetched maps into local
    let combined = getComments();
    for (const map of results) {
      if (map && typeof map === 'object' && !Array.isArray(map)) {
        combined = mergeComments(combined, map);
      }
    }

    setComments(combined);
    localStorage.setItem(KEY_COMMENTS_BOOTSTRAP, String(Date.now()));
  } catch (e) {
    console.warn('Comment bootstrap failed:', e);
  }
}

export function getItemsCache() {
  try { return JSON.parse(localStorage.getItem(KEY_ITEMS)) || { categories: [], items: [] }; }
  catch { return { categories: [], items: [] }; }
}

export function setItemsCache(payload) {
  localStorage.setItem(KEY_ITEMS, JSON.stringify(payload || { categories: [], items: [] }));
}


/** Always-fresh fetch of items.json with cache-bust */
export async function fetchItemsJson() {
  const url = `${RAW_BASE}/data/items.json?cb=${Date.now()}`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    if (!ct.includes('application/json')) return null;
    return await res.json(); // { categories: [...], items: [...] }
  } catch { return null; }
}

/** Load latest items into localStorage, return the payload used */
export async function refreshItems(force = true) {
  // force here is just for symmetry; we always fetch fresh
  const data = await fetchItemsJson();
  if (data && Array.isArray(data.items) && Array.isArray(data.categories)) {
    setItemsCache(data);
    return data;
  }
  // if fetch failed, keep existing cache
  return getItemsCache();
}

/**
 * Add a comment locally + push to GitHub JSON file
 */
/**
 * Add a comment locally and push to GitHub per-category JSON file.
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

    // 1) Try NEW path first
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

    // Load from new location
    let r = await tryLoad(pathToUse);
    sha = r.sha;
    comments = r.data || {};

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
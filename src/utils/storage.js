const REPO = "kskoulini/pixels"; // e.g. "koulini/pixelpenpals"
const BRANCH = "comments";                // or whichever branch you host JSON under
const TOKEN = "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";           // fine-grained PAT for this repo only
const COMMENTS_PATH = "data/comments"; // folder path in repo (must exist)
const API_ROOT = "https://api.github.com/repos";

const KEY_PROGRESS = "pixels_progress_v1";
const KEY_COMMENTS = "pixels_comments_v1";

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

/**
 * Add a comment locally + push to GitHub JSON file
 */
/**
 * Add a comment locally and push to GitHub per-category JSON file.
 */
export async function addComment(itemId, text, alias, category = "misc") {
  // local cache for instant UI
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
    const filePath = `${COMMENTS_PATH}/${category}.json`;
    const getUrl = `${API_ROOT}/${REPO}/contents/${filePath}?ref=${BRANCH}`;

    // Fetch existing category file
    const getRes = await fetch(getUrl, {
      headers: {
        Authorization: `token ${TOKEN}`,
        Accept: "application/vnd.github+json"
      }
    });

    let sha = null;
    let comments = [];

    if (getRes.ok) {
      const json = await getRes.json();
      sha = json.sha;
      comments = JSON.parse(atob(json.content));
    }

    // Ensure structure: { [itemId]: [comments] }
    if (!comments || typeof comments !== "object" || Array.isArray(comments)) {
      comments = {};
    }
    if (!comments[itemId]) comments[itemId] = [];
    comments[itemId].push(newComment);

    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(comments, null, 2))));

    // Commit back
    const putRes = await fetch(`${API_ROOT}/${REPO}/contents/${filePath}`, {
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
      console.log(`✅ Comment committed for ${category}/${itemId}`);
    }
  } catch (err) {
    console.error("Error updating comment JSON:", err);
  }

  return list;
}
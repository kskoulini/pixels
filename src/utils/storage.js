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
export function addComment(itemId, text, alias) {
  const all = getComments();
  const list = all[itemId] || [];
  list.push({
    id: String(Date.now()),
    text,
    alias: alias || "anonymous",
    at: new Date().toISOString()
  });
  all[itemId] = list;
  localStorage.setItem(KEY_COMMENTS, JSON.stringify(all));
  return list;
}
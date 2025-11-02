const KEY_PROGRESS = "pixels_progress_v1";
const KEY_COMMENTS = "pixels_comments_v1";

export function getProgress() {
  try { return JSON.parse(localStorage.getItem(KEY_PROGRESS)) || {}; }
  catch { return {}; }
}
export function setProgress(obj) {
  localStorage.setItem(KEY_PROGRESS, JSON.stringify(obj || {}));
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
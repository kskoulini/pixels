import React, { useEffect, useMemo, useState } from 'react';
import RetroWindow from '../components/RetroWindow';
import AppHeader from '../components/AppHeader';
import CategoryPills from '../components/CategoryPills';
import ChatBubble from '../components/ChatBubble';
import CommentModal from '../components/CommentModal';
import {
  getProgress,
  setProgress,
  addComment,
  getComments,
  getSeenIds,
  getSeenCount,
  markSeen,
  normalizeProgress,
  KEY_COMMENTS,
  getItemsCache,       // ← new import
} from '../utils/storage';
import { Link } from 'react-router-dom';
import { useItems } from '../context/ItemsContext';

function Chat() {
  const { data, refreshAll } = useItems(); // refreshAll still available if you want it

  // Raw data from context (GitHub-backed)
  const rawCategories = data?.categories || [];
  const rawItems = data?.items || [];

  // Local fallback copy (localStorage → static JSON)
  const [fallbackData, setFallbackData] = useState({ categories: [], items: [] });

  // Effective data that the rest of the component uses
  const CATEGORIES = rawCategories.length ? rawCategories : fallbackData.categories;
  const ITEMS = rawItems.length ? rawItems : fallbackData.items;

  // If context failed to load items (e.g. GitHub down / PAT issue),
  // fall back to localStorage cache, then to /data/items.json.
  useEffect(() => {
    // If context already has data, no need for fallback
    if (rawItems.length && rawCategories.length) return;

    // 1) Try localStorage cache first
    const cache = getItemsCache();
    if (cache && Array.isArray(cache.items) && cache.items.length) {
      setFallbackData(cache);
      return;
    }

    // 2) Otherwise, fetch static JSON from public/data/items.json
    (async () => {
      try {
        const base = (process.env.PUBLIC_URL || '').replace(/\/+$/, '');
        const res = await fetch(`${base}/data/items.json`, { cache: 'no-store' });
        if (!res.ok) return;
        const payload = await res.json(); // { categories: [...], items: [...] }
        if (Array.isArray(payload.items) && Array.isArray(payload.categories)) {
          setFallbackData(payload);
        }
      } catch (e) {
        console.warn('Fallback items.json load failed:', e);
      }
    })();
  }, [rawItems.length, rawCategories.length]);

  const itemsInCategory = (cat) =>
    cat === 'all' ? ITEMS : ITEMS.filter((i) => i.category === cat);

  const [category, setCategory] = useState('all');

  // bump state when comments are refreshed so render picks up new localStorage
  const [commentsVersion, setCommentsVersion] = useState(0);

  useEffect(() => {
    const bump = () => setCommentsVersion((v) => v + 1);

    const onCustom = () => bump();
    window.addEventListener('pixels:comments-updated', onCustom);

    const onStorage = (e) => {
      if (e.key === KEY_COMMENTS) bump();
    };
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('pixels:comments-updated', onCustom);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // progress normalize after items load
  const [progress, setProgState] = useState(() => getProgress());
  useEffect(() => {
    if (ITEMS.length > 0) {
      setProgState(normalizeProgress(getProgress(), ITEMS));
    }
  }, [ITEMS]);

  const seenCount = useMemo(
    () => getSeenCount(progress, category),
    [progress, category]
  );

  const totalInCat = useMemo(
    () => itemsInCategory(category).length,
    [ITEMS, category]
  );

  const feed = useMemo(() => {
    const seenIds = getSeenIds(progress, category);
    const seen = new Set(seenIds);
    const messages = itemsInCategory(category).filter((i) => seen.has(i.id));
    messages.sort((a, b) => seenIds.indexOf(a.id) - seenIds.indexOf(b.id));
    return messages;
  }, [progress, category, ITEMS]);

  const unreadMap = useMemo(() => {
    const map = {};
    CATEGORIES.forEach(({ id }) => {
      const list = id === 'all' ? ITEMS : ITEMS.filter((i) => i.category === id);
      const seen = new Set(getSeenIds(progress, id));
      map[id] = list.reduce((acc, it) => acc + (seen.has(it.id) ? 0 : 1), 0);
    });
    return map;
  }, [progress, ITEMS, CATEGORIES]);

  function handleNext() {
    const all = itemsInCategory(category);
    const seen = new Set(getSeenIds(progress, category));
    const nextItem = all.find((i) => !seen.has(i.id));
    if (!nextItem) return;

    let updated = { ...progress };
    updated = markSeen(updated, nextItem.category, nextItem.id);
    updated = markSeen(updated, 'all', nextItem.id);

    setProgress(updated);
    setProgState(updated);
  }

  async function handleCommentPost(item, text, alias) {
    await addComment(item.id, text, alias, item.category);
    setShowCommentFor(null);
    // Optional: re-fetch from GitHub then dispatch pixels:comments-updated
    alert('Sent! ✨');
  }

  // Re-read localStorage on each render; commentsVersion forces re-render when updated
  function getItemComments(itemId) {
    const all = getComments();
    return all[itemId] || [];
  }

  const [showCommentFor, setShowCommentFor] = useState(null);
  const isLoading = ITEMS.length === 0 || CATEGORIES.length === 0;

  return (
    <RetroWindow title="chat-page">
      <div className="page-container">
        <AppHeader>
          <Link to="/">Home</Link> / Chat
        </AppHeader>

        {!isLoading && (
          <CategoryPills
            categories={CATEGORIES}
            activeId={category}
            onChange={setCategory}
            unreadMap={unreadMap}
            showCounts={true}
          />
        )}

        <div
          className={['chat-feed', feed.length === 0 ? 'empty' : ''].filter(Boolean).join(' ')}
          data-comments-version={commentsVersion}
        >
          {isLoading ? (
            <div className="loading-hint">Loading…</div>
          ) : (
            feed.map((item) => (
              <div key={item.id} className="chat-bubble-wrapper" data-cv={commentsVersion}>
                <ChatBubble item={item} onComment={setShowCommentFor} />
                {getItemComments(item.id).length > 0 && (
                  <div className="bubble-meta" style={{ marginLeft: 8 }}>
                    {getItemComments(item.id).map((c) => (
                      <div key={c.id} style={{ marginTop: 4 }}>
                        <strong>{c.alias || 'anonymous'}:</strong> {c.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {!isLoading && (
          <div className="bottom-dock">
            <button className="pixel-button" onClick={handleNext}>
              {seenCount < totalInCat ? 'Load Next Message →' : 'All Caught Up ✨'}
            </button>

            <button
              className="pixel-button pixel-button-ghost shuffle-btn"
              onClick={() =>
                setCategory((prev) => {
                  const ids = CATEGORIES.map((c) => c.id);
                  const i = ids.indexOf(prev);
                  return ids[(i + 1) % ids.length];
                })
              }
              aria-label="Shuffle category"
              title="Shuffle category"
            >
              🎲
            </button>
          </div>
        )}
      </div>

      {showCommentFor && (
        <CommentModal
          item={showCommentFor}
          onClose={() => setShowCommentFor(null)}
          onSubmit={handleCommentPost}
        />
      )}
    </RetroWindow>
  );
}

export default Chat;
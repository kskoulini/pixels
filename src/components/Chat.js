import React, { useEffect, useMemo, useState } from 'react';
import RetroWindow from '../components/RetroWindow';
import AppHeader from '../components/AppHeader';
import CategoryPills from '../components/CategoryPills';
import ChatBubble from '../components/ChatBubble';
import CommentModal from '../components/CommentModal';
import { CATEGORIES, ITEMS } from '../data';
import { getProgress, setProgress, addComment, getComments,
         getSeenIds, getSeenCount, markSeen, normalizeProgress } from '../utils/storage';
import { Link } from 'react-router-dom';

const itemsInCategory = (cat) =>
  cat === 'all' ? ITEMS : ITEMS.filter(i => i.category === cat);

function Chat() {
  const [category, setCategory] = useState('all');

  // load & normalize once (migrates old numeric progress → arrays of ids)
  const [progress, setProgState] = useState(() => normalizeProgress(getProgress(), ITEMS));

  const seenCount = useMemo(() => getSeenCount(progress, category), [progress, category]);
  const totalInCat = useMemo(() => itemsInCategory(category).length, [category]);

  // feed = items whose ids are in seenIds (keeps same order as ITEMS)
  const feed = useMemo(() => {
    const seenIds = getSeenIds(progress, category);
    const seen = new Set(seenIds);
    const messages = itemsInCategory(category).filter(i => seen.has(i.id));
    messages.sort((a,b) => seenIds.indexOf(a.id) - seenIds.indexOf(b.id))
    
    return messages;
  }, [progress, category]);

  function handleNext() {
    const all = itemsInCategory(category);
    const seen = new Set(getSeenIds(progress, category));
    const nextItem = all.find(i => !seen.has(i.id));
    if (!nextItem) return; // all caught up in this category

    // mark in current category AND in 'all'
    let updated = { ...progress };

    updated = markSeen(updated, nextItem.category, nextItem.id);
    console.log('updated 1: ', updated);
    
    updated = markSeen(updated, 'all', nextItem.id);
    console.log('updated 2: ', updated);

    setProgress(updated);
    setProgState(updated);
  }

  function handleCommentPost(item, text, alias) {
    addComment(item.id, text, alias);
    setShowCommentFor(null);
    alert('Sent with ✨');
  }

  function getItemComments(itemId) {
    const all = getComments();
    return all[itemId] || [];
  }

  const [showCommentFor, setShowCommentFor] = useState(null);

  return (
    <RetroWindow title="chat-page">
      <div className="page-container">
        <AppHeader>
          <Link to="/">Home</Link> / Chat
        </AppHeader>

        <CategoryPills
          categories={CATEGORIES}
          activeId={category}
          onChange={setCategory}
        />

        <div className={["chat-feed", feed.length === 0 ? 'empty' : ''].filter(Boolean).join(' ')}>
          {feed.map(item => (
            <div key={item.id} className="chat-bubble-wrapper">
              <ChatBubble item={item} onComment={setShowCommentFor} />
              {getItemComments(item.id).length > 0 && (
                <div className="bubble-meta" style={{ marginLeft: 8 }}>
                  {getItemComments(item.id).map(c => (
                    <div key={c.id} style={{ marginTop: 4 }}>
                      <strong>{c.alias || 'anonymous'}:</strong> {c.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bottom-dock">
          <button className="pixel-button" onClick={handleNext}>
            {seenCount < totalInCat ? 'Load Next Message →' : 'All Caught Up ✨'}
          </button>
          <button
            className="pixel-button pixel-button-ghost shuffle-btn"
            onClick={() => setCategory(prev => {
              const ids = CATEGORIES.map(c => c.id);
              const i = ids.indexOf(prev);
              return ids[(i + 1) % ids.length];
            })}
            aria-label="Shuffle category"
            title="Shuffle category"
          >
            🎲
          </button>
        </div>
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

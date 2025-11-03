import React, { useMemo, useState } from 'react';
import RetroWindow from '../components/RetroWindow';
import AppHeader from '../components/AppHeader';
import CategoryPills from '../components/CategoryPills';
import ChatBubble from '../components/ChatBubble';
import CommentModal from '../components/CommentModal';
import { CATEGORIES, ITEMS } from '../data';
import { getProgress, setProgress, addComment, getComments } from '../utils/storage';
import { Link } from 'react-router-dom';

function nextIndexFor(categoryId, progress) {
  const list = categoryId === 'all' ? ITEMS : ITEMS.filter(i => i.category === categoryId);
  const current = progress[categoryId] || 0;
  if (current >= list.length) return list.length; // clamp
  return current + 1;
}

function itemsFor(categoryId, count) {
  const list = categoryId === 'all' ? ITEMS : ITEMS.filter(i => i.category === categoryId);
  return list.slice(0, count);
}

function Chat() {
  const [category, setCategory] = useState('all');
  const [progress, setProgState] = useState(getProgress());
  const [showCommentFor, setShowCommentFor] = useState(null);

  // compute current feed
  const seenCount = progress[category] || 0;
  const feed = useMemo(() => itemsFor(category, seenCount), [category, seenCount]);
  const totalInCat = useMemo(
    () => (category === 'all' ? ITEMS.length : ITEMS.filter(i => i.category === category).length),
    [category]
  );

  function handleNext() {
    const next = nextIndexFor(category, progress);
    const updated = { ...progress, [category]: Math.min(next, totalInCat) };
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

        <div className="chat-feed">
          {feed.map(item => (
            <div key={item.id} className='chat-bubble-wrapper'>
              <ChatBubble item={item} onComment={setShowCommentFor} />
              {/* render comments if any */}
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
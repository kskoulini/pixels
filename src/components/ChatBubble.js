import React from 'react';

function LinkPreview({ url }) {
  try {
    const u = new URL(url);
    return <div style={{ fontSize: 12, color: '#6e5f53' }}>{u.hostname}</div>;
  } catch {
    return null;
  }
}

function ChatBubble({ item, onComment }) {
  return (
    <div className="chat-bubble">
      {item.title && <div className="bubble-title">{item.title}</div>}

      {item.type === 'text' && (
        <div>{item.text}</div>
      )}

      {item.type === 'link' && (
        <div>
          <LinkPreview url={item.url} />
          <a href={item.url} target="_blank" rel="noreferrer">{item.url}</a>
          {item.caption && <div style={{ marginTop: 6 }}>{item.caption}</div>}
        </div>
      )}

      {/* You can add 'image', 'audio', 'video' renderers later */}

      <div className="bubble-meta">
        {item.category} · {new Date(item.createdAt).toLocaleDateString()}
      </div>

      <div className="bubble-actions">
        <button className="pixel-button pixel-button-ghost chat-btn" onClick={() => onComment(item)}>
          💬 Comment
        </button>
      </div>
    </div>
  );
}

export default ChatBubble;
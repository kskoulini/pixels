import React, { useState } from 'react';

function CommentModal({ item, onClose, onSubmit }) {
  const [text, setText] = useState("");
  const [alias, setAlias] = useState("");

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-title">Leave a tiny note?</div>
        <textarea
          className="textarea"
          placeholder="140 chars max (no pressure)"
          maxLength={140}
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <input
          className="input"
          placeholder="Nickname (optional, defaults to anonymous)"
          value={alias}
          onChange={e => setAlias(e.target.value)}
        />
        <div className="modal-actions">
          <button className="pixel-button pixel-button-ghost" onClick={onClose}>Cancel</button>
          <button
            className="pixel-button"
            onClick={() => {
              if (!text.trim()) return;
              onSubmit(item, text.trim(), alias.trim());
            }}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommentModal;
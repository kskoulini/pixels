import React from "react";

const EditMessageItem = ({
    updateItem,
    moveItem,
    deleteItem,
    categories,
    it
}) => {
    return(
        <div
            key={it.id}
            className="edit-msg-item"
        >
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <div className="btn-wrapper">
                    <div>
                        <button className="pixel-button pixel-button-ghost edit-pos" onClick={() => moveItem(it.id, -1)} type="button">
                            ↑
                        </button>
                        <button className="pixel-button pixel-button-ghost edit-pos" onClick={() => moveItem(it.id, +1)} type="button">
                            ↓
                        </button>
                    </div>
                    <code style={{ fontSize: 12 }}>{it.id}</code>
                    <button 
                        className="pixel-button pixel-button-ghost" 
                        onClick={() => deleteItem(it.id)} type="button"
                        style={{'padding': '2px 8px'}}
                    >
                        Delete
                    </button>
                </div>

                <select
                    value={it.category}
                    onChange={(e) => updateItem(it.id, { category: e.target.value })}
                    className="input-elm"
                    placeholder="category"
                >
                    {categories
                    .filter((c) => c.id !== "all")
                    .map((c) => (
                        <option key={c.id} value={c.id}>
                        {c.id}
                        </option>
                    ))}
                </select>
            
                <input
                    value={it.title || ""}
                    onChange={(e) => updateItem(it.id, { title: e.target.value })}
                    className="input-elm"
                    placeholder="title"
                />

                <input
                    value={it.url || ""}
                    onChange={(e) => updateItem(it.id, { title: e.target.value })}
                    className="input-elm"
                    placeholder="title"
                />

                <textarea
                    value={it.text || ""}
                    onChange={(e) => updateItem(it.id, { text: e.target.value })}
                    style={{
                        width: "100%",
                        padding: 8,
                        borderRadius: 8,
                        border: "1px solid #333",
                        background: "transparent",
                        minHeight: 70
                    }}
                />
            </div>
        </div>)
}

export default EditMessageItem;
import React from "react";

const EditCategories = ({
    categories,
    updateCategory,
    deleteCategory,
    addCategory
}) => {
    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {categories.map((c) => (
                    <div
                        key={c.id}
                        style={{
                            // border: "1px solid #3a2f26",
                            borderRadius: 10,
                            padding: 10,
                            display: "flex",
                            flexDirection: 'row',
                            gap: 8,
                            alignItems: "center",
                            width: '100%'
                            // flexWrap: "wrap"
                        }}
                    >
                        <code style={{ fontSize: 12 }}>{c.id}</code>

                        <input
                            value={c.label || ""}
                            onChange={(e) => updateCategory(c.id, { label: e.target.value })}
                            placeholder="Label"
                            className="category-input-elm"
                        />

                        {c.id !== "all" && (
                            <button className="ctrl-btn danger" onClick={() => deleteCategory(c.id)} type="button">
                                ✕
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button className="pixel-button" onClick={addCategory} type="button">
                + Add category
            </button>
        </>
    )
}

export default EditCategories;
import React from "react";
import EditMessageItem from "./EditMessageItem";

const EditItems = ({
    filterCat,
    setFilterCat,
    categories,
    search,
    setSearch,
    visibleItems,
    updateItem,
    moveItem,
    deleteItem,
    addItem,
}) => {
    return (
          <>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #333", background: "transparent" }}
              >
                <option value="all">All</option>
                {categories
                  .filter((c) => c.id !== "all")
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label || c.id}
                    </option>
                  ))}
              </select>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search messages…"
                style={{
                  padding: "6px 8px",
                  borderRadius: 6,
                  border: "1px solid #333",
                  background: "transparent",
                  flex: 1,
                  minWidth: 160
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {visibleItems.map((it) => (
                <EditMessageItem
                  updateItem={updateItem}
                  moveItem={moveItem}
                  deleteItem={deleteItem}
                  categories={categories}
                  it={it}
                />
              ))}

              {!visibleItems.length ? <div style={{ opacity: 0.8 }}>No messages match your filter.</div> : null}
            </div>

            <button className="pixel-button" onClick={addItem} type="button">
              + Add message
            </button>
          </>
        )
}

export default EditItems;
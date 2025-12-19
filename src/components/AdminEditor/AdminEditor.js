import React, { useEffect, useMemo, useState } from "react";
import RetroWindow from "../RetroWindow";
import AppHeader from "../AppHeader";
import { Link, useNavigate } from "react-router-dom";

import EditMessageItem from './EditMessageItem';

import "./AdminEditor.css";

// ✅ Pull config from your existing storage.js
import {
  REPO,
  BRANCH,
  TOKEN,
  API_ROOT,
  PUBLIC_DATA_BASE
} from "../../utils/storage";

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function ghHeaders() {
  return {
    Accept: "application/vnd.github+json",
    ...(TOKEN ? { Authorization: `token ${TOKEN}` } : {})
  };
}

function base64EncodeUnicode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function sanitizeCategories(categories) {
  const filtered = (categories || [])
    .filter(Boolean)
    .map((c) => ({ id: String(c.id || "").trim(), label: String(c.label || "").trim() }))
    .filter((c) => c.id);

  const hasAll = filtered.some((c) => c.id === "all");
  const withoutAll = filtered.filter((c) => c.id !== "all");

  // Always keep "all" first
  return [{ id: "all", label: hasAll ? (filtered.find(c => c.id === "all")?.label || "All") : "All" }, ...withoutAll];
}

function sanitizeItems(items, categories) {
  const allowed = new Set(categories.map((c) => c.id));
  return (items || [])
    .filter(Boolean)
    .map((it) => ({
      id: String(it.id || "").trim(),
      category: String(it.category || "").trim(),
      title: String(it.title || ""),
      url:String(it.url || ""),
      text: String(it.text || ""),
      createdAt: String(it.createdAt || ""),
    }))
    .filter((it) => it.id && it.category && it.text != null)
    .map((it) => ({
      ...it,
      category: allowed.has(it.category) ? it.category : "misc"
    }));
}

export default function AdminEditor() {
  const navigate = useNavigate();

  // Items JSON file path (repo path)
  // ✅ Uses PUBLIC_DATA_BASE from storage.js => "public/data"
  const ITEMS_REPO_PATH = `${PUBLIC_DATA_BASE}/items.json`;

  // Data loaded ONLY from public/data/items.json
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");

  // Editable state
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);

  // Save feedback
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState("");
  const [saveOk, setSaveOk] = useState("");

  // UI state
  const [tab, setTab] = useState("items"); // items | categories
  const [filterCat, setFilterCat] = useState("all");
  const [search, setSearch] = useState("");

  const publicBase = (process.env.PUBLIC_URL || "").replace(/\/+$/, "");
  const itemsJsonUrl = `${publicBase}/data/items.json?cb=${Date.now()}`;

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setLoadErr("");

      try {
        const res = await fetch(itemsJsonUrl, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load items.json (${res.status})`);

        const data = await res.json();
        const cats = sanitizeCategories(Array.isArray(data?.categories) ? data.categories : []);
        const its = sanitizeItems(Array.isArray(data?.items) ? data.items : [], cats);

        if (!alive) return;
        setCategories(cats);
        setItems(its);
        setFilterCat("all");
      } catch (e) {
        if (!alive) return;
        setLoadErr(e?.message || "Failed to load items.json");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleItems = useMemo(() => {
    let list = items;
    if (filterCat !== "all") list = list.filter((i) => i.category === filterCat);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (i) =>
          (i.id || "").toLowerCase().includes(q) ||
          (i.text || "").toLowerCase().includes(q) ||
          (i.category || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, filterCat, search]);

  function addCategory() {
    const id = prompt("New category id (e.g. reels, notes):", "");
    if (!id) return;
    const clean = id.trim();
    if (!clean) return;

    if (categories.some((c) => c.id === clean)) {
      alert("Category id already exists.");
      return;
    }

    const label = prompt("Category label:", clean) || clean;
    setCategories((prev) => sanitizeCategories([...prev, { id: clean, label }]));
    setFilterCat(clean);
  }

  function updateCategory(catId, patch) {
    if (catId === "all") {
      setCategories((prev) => prev.map((c) => (c.id === "all" ? { ...c, label: patch.label ?? c.label } : c)));
      return;
    }

    setCategories((prev) => sanitizeCategories(prev.map((c) => (c.id === catId ? { ...c, ...patch } : c))));
  }

  function deleteCategory(catId) {
    if (catId === "all") return;
    if (!window.confirm(`Delete category "${catId}"? Items will be moved to "misc".`)) return;

    setCategories((prev) => {
      const filtered = prev.filter((c) => c.id !== catId);
      const hasMisc = filtered.some((c) => c.id === "misc");
      return sanitizeCategories(hasMisc ? filtered : [...filtered, { id: "misc", label: "Misc" }]);
    });

    setItems((prev) => prev.map((it) => (it.category === catId ? { ...it, category: "misc" } : it)));
    if (filterCat === catId) setFilterCat("all");
  }

  function addItem() {
    const defaultCat =
      filterCat !== "all"
        ? filterCat
        : categories.find((c) => c.id !== "all")?.id || "misc";

    const text = prompt("Message text:", "");
    if (!text) return;

    const id = prompt("Message id (unique):", `${defaultCat}-${uid()}`) || `${defaultCat}-${uid()}`;

    setItems((prev) => [...prev, { id: id.trim(), category: defaultCat, text }]);
  }

  function updateItem(itemId, patch) {
    setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, ...patch } : it)));
  }

  function deleteItem(itemId) {
    if (!window.confirm(`Delete message "${itemId}"?`)) return;
    setItems((prev) => prev.filter((it) => it.id !== itemId));
  }

  function moveItem(itemId, dir) {
    setItems((prev) => {
      const idx = prev.findIndex((it) => it.id === itemId);
      if (idx < 0) return prev;
      const j = idx + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  }

  async function saveItemsJsonToGitHub() {
    setSaveErr("");
    setSaveOk("");

    if (!REPO || !TOKEN) {
      setSaveErr("Missing GitHub config (REPO/TOKEN). Check src/utils/storage.js.");
      return;
    }

    setSaving(true);
    try {
      // 1) Read current file from repo to get SHA
      const getUrl = `${API_ROOT}/${REPO}/contents/${ITEMS_REPO_PATH}?ref=${encodeURIComponent(BRANCH)}`;
      const getRes = await fetch(getUrl, { headers: ghHeaders() });

      if (!getRes.ok) {
        const t = await getRes.text();
        throw new Error(`Failed to read items.json from GitHub (${getRes.status}): ${t}`);
      }

      const getJson = await getRes.json();
      const sha = getJson?.sha;

      // 2) Prepare payload
      const cleanCats = sanitizeCategories(categories);
      const cleanItems = sanitizeItems(items, cleanCats);
      const payload = { categories: cleanCats, items: cleanItems };

      const content = base64EncodeUnicode(JSON.stringify(payload, null, 2));

      // 3) Commit back
      const putUrl = `${API_ROOT}/${REPO}/contents/${ITEMS_REPO_PATH}`;
      const putRes = await fetch(putUrl, {
        method: "PUT",
        headers: { ...ghHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "chore(items): update items.json from admin editor",
          content,
          branch: BRANCH,
          sha
        })
      });

      if (!putRes.ok) {
        const t = await putRes.text();
        throw new Error(`Failed to save items.json (${putRes.status}): ${t}`);
      }

      setSaveOk("Saved to GitHub ✅");
      setCategories(cleanCats);
      setItems(cleanItems);
    } catch (e) {
      setSaveErr(e?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  function cancelExit() {
    navigate(-1);
  }

  return (
    <RetroWindow title="admin">
      <div className="page-container admin-wrap">
        <AppHeader>
          <Link to="/">Home</Link> / Admin
        </AppHeader>

        <div className='admin-btn-ctrls'>
          <button
            className={`pixel-button ${tab === "items" ? "" : "pixel-button-ghost"}`}
            onClick={() => setTab("items")}
            type="button"
          >
            Messages
          </button>

          <button
            className={`pixel-button ${tab === "categories" ? "" : "pixel-button-ghost"}`}
            onClick={() => setTab("categories")}
            type="button"
          >
            Categories
          </button>
        </div>

        {saveErr ? (
          <div style={{ marginBottom: 10, padding: 10, border: "1px solid #b33", borderRadius: 8 }}>
            <strong>Save failed:</strong> <div style={{ whiteSpace: "pre-wrap" }}>{saveErr}</div>
          </div>
        ) : null}

        {saveOk ? (
          <div style={{ marginBottom: 10, padding: 10, border: "1px solid #3a8", borderRadius: 8 }}>
            {saveOk}
          </div>
        ) : null}

        {loading ? (
          <div className="loading-hint">Loading items.json…</div>
        ) : loadErr ? (
          <div style={{ padding: 10, border: "1px solid #b33", borderRadius: 8 }}>
            <strong>Could not load items.json:</strong>
            <div style={{ marginTop: 6 }}>{loadErr}</div>
            <div style={{ marginTop: 6, fontSize: 12, opacity: 0.85 }}>
              Expected at: <code>{`${publicBase}/data/items.json`}</code>
            </div>
          </div>
        ) : tab === "items" ? (
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
        ) : (
          <>
            {/*  */}

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
        )}

        <div className='admin-btn-ctrls' style={{'justifyContent':'flex-end'}}>
          <button className="pixel-button pixel-button-ghost" onClick={cancelExit} type="button">
            Cancel
          </button>

          <button className="pixel-button" onClick={saveItemsJsonToGitHub} disabled={saving} type="button">
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

    </RetroWindow>
  );
}

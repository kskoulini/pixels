import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RetroWindow from "../RetroWindow";
import AppHeader from "../AppHeader";
import EditItems from "./EditItems";
import EditCategories from "./EditCategories";
import AdminPopupForm from "./AdminPopupForm";

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
      url: String(it.url || ""),
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

  // popup state
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupSubtitle, setPopupSubtitle] = useState("");
  const [popupFields, setPopupFields] = useState([]);
  const [popupOnSubmit, setPopupOnSubmit] = useState(null);

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
          (i.title || "").toLowerCase().includes(q) ||
          (i.text || "").toLowerCase().includes(q) ||
          (i.url || "").toLowerCase().includes(q) ||
          (i.category || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, filterCat, search]);

  function openPopup({ title, subtitle, fields, onSubmit }) {
    setPopupTitle(title || "Add");
    setPopupSubtitle(subtitle || "");
    setPopupFields(fields || []);
    setPopupOnSubmit(() => onSubmit);
    setPopupOpen(true);
  }

  function closePopup() {
    setPopupOpen(false);
    setPopupOnSubmit(null);
  }

  function addCategory() {
    openPopup({
      title: "Add category",
      subtitle: "Create a new category pill",
      fields: [
        {
          name: "id",
          label: "Category id",
          placeholder: "e.g. reels, notes, music",
          required: true
        },
        {
          name: "label",
          label: "Label",
          placeholder: "What the user sees (e.g. Reels)",
          required: true
        }
      ],
      onSubmit: (vals) => {
        const clean = (vals.id || "").trim();
        if (!clean) return;

        if (categories.some((c) => c.id === clean)) {
          alert("Category id already exists.");
          return;
        }

        const label = (vals.label || "").trim() || clean;
        setCategories((prev) => sanitizeCategories([...prev, { id: clean, label }]));
        setFilterCat(clean);
        closePopup();
      }
    });
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

    const categoryOptions = categories
      .filter((c) => c.id !== "all")
      .map((c) => ({ value: c.id, label: c.label ? `${c.label} (${c.id})` : c.id }));

    // helper to compute next id for a category
    const nextIdForCategory = (cat) => {
      const count = items.filter((it) => it.category === cat).length;
      return `${cat}-${count + 1}`;
    };

    openPopup({
      title: "Add message",
      subtitle: "Create a new message",
      fields: [
        {
          name: "category",
          label: "Category",
          type: "select",
          required: true,
          options: categoryOptions.length
            ? categoryOptions
            : [{ value: "misc", label: "Misc (misc)" }],
          defaultValue: defaultCat
        },
        {
          name: "id",
          label: "Message ID",
          required: true,
          defaultValue: nextIdForCategory(defaultCat),
          hint: "Auto-generated based on category",
          disabled: true        // 👈 new
        },
        {
          name: "title",
          label: "Title",
          placeholder: "Short heading",
          required: true        // 👈 now required
        },
        {
          name: "url",
          label: "URL (optional)",
          type: "url",
          placeholder: "https://…"
        },
        {
          name: "text",
          label: "Text",
          type: "textarea",
          placeholder: "Write the message…",
          required: true
        }
      ],
      onSubmit: (vals) => {
        const cat = vals.category;
        const id = nextIdForCategory(cat); // 👈 recompute safely
        const title = (vals.title || "").trim();
        const text = vals.text || "";

        if (!title || !text.trim()) return;

        const newItem = {
          id,
          category: cat,
          title,
          url: (vals.url || "").trim(),
          text,
          createdAt: new Date().toISOString()
        };

        setItems((prev) => [...prev, newItem]);
        closePopup();
      }
    });
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
        ) : tab === "items" ?
          <EditItems
            filterCat={filterCat}
            setFilterCat={setFilterCat}
            categories={categories}
            search={search}
            setSearch={setSearch}
            visibleItems={visibleItems}
            updateItem={updateItem}
            moveItem={moveItem}
            deleteItem={deleteItem}
            addItem={addItem}
          />
          :
          <EditCategories
            categories={categories}
            updateCategory={updateCategory}
            deleteCategory={deleteCategory}
            addCategory={addCategory}
          />
        }

        <div className='admin-btn-ctrls' style={{ 'justifyContent': 'flex-end' }}>
          <button className="pixel-button pixel-button-ghost" onClick={cancelExit} type="button">
            Cancel
          </button>

          <button className="pixel-button" onClick={saveItemsJsonToGitHub} disabled={saving} type="button">
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <AdminPopupForm
        open={popupOpen}
        title={popupTitle}
        subtitle={popupSubtitle}
        fields={popupFields}
        onCancel={closePopup}
        onSubmit={(vals) => popupOnSubmit && popupOnSubmit(vals)}
      />
    </RetroWindow>
  );
}

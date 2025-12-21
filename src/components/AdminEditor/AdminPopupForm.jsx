import React, { useEffect, useMemo, useState } from "react";
import "./AdminEditor.css";

/**
 * Reusable popup for Admin flows.
 *
 * props:
 * - open: boolean
 * - title: string
 * - subtitle?: string
 * - fields: Array<{
 *    name: string,
 *    label: string,
 *    type?: "text"|"textarea"|"select"|"url"|"datetime-local",
 *    placeholder?: string,
 *    required?: boolean,
 *    options?: Array<{ value: string, label: string }>, // for select
 *    defaultValue?: string,
 *    hint?: string
 * }>
 * - onCancel: () => void
 * - onSubmit: (values) => void
 */
export default function AdminPopupForm({
  open,
  title,
  subtitle,
  fields = [],
  onCancel,
  onSubmit
}) {
  const initial = useMemo(() => {
    const obj = {};
    fields.forEach((f) => {
      obj[f.name] = f.defaultValue != null ? String(f.defaultValue) : "";
    });
    return obj;
  }, [fields]);

  const [values, setValues] = useState(initial);
  const [touched, setTouched] = useState({});

  // auto-update dependent fields (category → id)
  useEffect(() => {
    const catField = fields.find(f => f.name === "category");
    const idField = fields.find(f => f.name === "id");

    if (!catField || !idField || !idField.disabled) return;

    const cat = values.category;
    if (!cat) return;

    // Let parent decide exact value; parent recomputes again on submit anyway
    if (typeof idField.defaultValue === "string") {
      setValues(v => ({
        ...v,
        id: idField.defaultValue.startsWith(cat)
          ? v.id
          : `${cat}-${v.id?.split("-")[1] || 1}`
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.category]);

  useEffect(() => {
    if (open) {
      setValues(initial);
      setTouched({});
    }
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  function setField(name, v) {
    setValues((prev) => ({ ...prev, [name]: v }));
  }

  function hasError(field) {
    if (!field.required) return false;
    const v = (values[field.name] || "").trim();
    return v.length === 0;
  }

  function submit() {
    // mark all as touched
    const nextTouched = {};
    fields.forEach((f) => (nextTouched[f.name] = true));
    setTouched(nextTouched);

    // validate required
    const anyErr = fields.some((f) => hasError(f));
    if (anyErr) return;

    onSubmit?.(values);
  }

  return (
    <div className="admin-modal-overlay" onMouseDown={onCancel}>
      <div
        className="admin-modal"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="admin-modal-header">
          <div>
            <div className="admin-modal-title">{title}</div>
            {subtitle ? <div className="admin-modal-subtitle">{subtitle}</div> : null}
          </div>

          <button
            type="button"
            className="pixel-button pixel-button-ghost"
            onClick={onCancel}
            aria-label="Close"
            title="Close"
          >
            ✕
          </button>
        </div>

        <div className="admin-modal-body">
          {fields.map((f) => {
            const showErr = touched[f.name] && hasError(f);

            return (
              <label key={f.name} className="admin-form-row">
                <div className="admin-form-label">
                  {f.label}
                  {f.required ? <span className="admin-form-required">*</span> : null}
                </div>

                {f.type === "textarea" ? (
                  <textarea
                    className={`admin-textarea ${showErr ? "admin-input-error" : ""}`}
                    value={values[f.name] || ""}
                    placeholder={f.placeholder || ""}
                    onChange={(e) => setField(f.name, e.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, [f.name]: true }))}
                  />
                ) : f.type === "select" ? (
                  <select
                    className={`admin-select ${showErr ? "admin-input-error" : ""}`}
                    value={values[f.name] || ""}
                    disabled={f.disabled}
                    onChange={(e) => setField(f.name, e.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, [f.name]: true }))}
                  >
                    {(f.options || []).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className={`admin-input ${showErr ? "admin-input-error" : ""}`}
                    type={f.type || "text"}
                    value={values[f.name] || ""}
                    placeholder={f.placeholder || ""}
                    onChange={(e) => setField(f.name, e.target.value)}
                    disabled={f.disabled}
                    onBlur={() => setTouched((p) => ({ ...p, [f.name]: true }))}
                  />
                )}

                {f.hint ? <div className="admin-form-hint">{f.hint}</div> : null}
                {showErr ? <div className="admin-form-error">This field is required.</div> : null}
              </label>
            );
          })}
        </div>

        <div className="admin-modal-footer">
          <button type="button" className="pixel-button pixel-button-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="pixel-button" onClick={submit}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
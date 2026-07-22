"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/products";
import { CATEGORIES, formatBDT, normalizeImageUrl } from "@/lib/utils";

const EMPTY_FORM = {
  name_en: "",
  name_bn: "",
  slug: "",
  description_en: "",
  description_bn: "",
  category: CATEGORIES[0].id,
  price: "",
  discountPrice: "",
  unit: "",
  imageUrl: "",
  stock: "",
  isActive: true,
  isFeatured: false,
  isRnD: false,
};

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imagePreviewError, setImagePreviewError] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      setProducts(await getAllProductsAdmin());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
    setImagePreviewError(false);
    setShowForm(true);
  }

  function openEdit(product) {
    setForm({
      ...EMPTY_FORM,
      ...product,
      price: String(product.price ?? ""),
      discountPrice: product.discountPrice != null ? String(product.discountPrice) : "",
      stock: String(product.stock ?? ""),
    });
    setEditingId(product.id);
    setError("");
    setImagePreviewError(false);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name_en.trim() || !form.price) {
      setError("Product name and price are required.");
      return;
    }

    const payload = {
      name_en: form.name_en.trim(),
      name_bn: form.name_bn.trim(),
      slug: form.slug.trim() || slugify(form.name_en),
      description_en: form.description_en.trim(),
      description_bn: form.description_bn.trim(),
      category: form.category,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
      unit: form.unit.trim(),
      imageUrl: form.imageUrl.trim(),
      stock: Number(form.stock) || 0,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      isRnD: form.isRnD,
    };

    setSaving(true);
    try {
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }
      setShowForm(false);
      await refresh();
    } catch (err) {
      setError("Could not save product. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name_en}"? This cannot be undone.`)) return;
    await deleteProduct(product.id);
    await refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Products</h1>
          <p className="text-sm text-ink/50">Create, edit, price and publish inventory.</p>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary !py-2 text-sm">
          + Add product
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mt-6 space-y-4 p-5">
          <h2 className="font-semibold">{editingId ? "Edit product" : "New product"}</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink/70">Name (English) *</label>
              <input
                className="input-field"
                value={form.name_en}
                onChange={(e) => setForm((f) => ({ ...f, name_en: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink/70">Name (Bangla)</label>
              <input
                className="input-field font-bangla"
                value={form.name_bn}
                onChange={(e) => setForm((f) => ({ ...f, name_bn: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink/70">Slug (URL)</label>
              <input
                className="input-field"
                placeholder="auto-generated if left blank"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink/70">Category</label>
              <select
                className="input-field"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label_en}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink/70">Price (BDT) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="input-field"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink/70">Discount price (BDT)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="input-field"
                placeholder="leave blank if none"
                value={form.discountPrice}
                onChange={(e) => setForm((f) => ({ ...f, discountPrice: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink/70">Unit</label>
              <input
                className="input-field"
                placeholder="e.g. 500g, 1L"
                value={form.unit}
                onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink/70">Stock quantity</label>
              <input
                type="number"
                min="0"
                className="input-field"
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-ink/70">Image URL</label>
              <input
                className="input-field"
                placeholder="Paste any public image link (Google Drive share links are auto-fixed)"
                value={form.imageUrl}
                onChange={(e) => {
                  setForm((f) => ({ ...f, imageUrl: normalizeImageUrl(e.target.value) }));
                  setImagePreviewError(false);
                }}
              />
              <p className="mt-1 text-xs text-ink/40">
                Tip: a Google Drive "share" link gets auto-converted to a direct-image link.
                Make sure the file is shared as <strong>&quot;Anyone with the link&quot;</strong>.
              </p>
              {form.imageUrl && (
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-forest/15 bg-sage-100">
                    {imagePreviewError ? (
                      <span className="text-lg" title="Couldn't load this image">
                        ⚠️
                      </span>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={form.imageUrl}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onError={() => setImagePreviewError(true)}
                        onLoad={() => setImagePreviewError(false)}
                      />
                    )}
                  </div>
                  <p className={`text-xs ${imagePreviewError ? "font-semibold text-red-600" : "text-ink/50"}`}>
                    {imagePreviewError
                      ? "Couldn't load this image — check the link is public and points directly at an image file."
                      : "Live preview — this is what customers will see."}
                  </p>
                </div>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-ink/70">Description (Bangla)</label>
              <textarea
                className="input-field font-bangla"
                rows={2}
                value={form.description_bn}
                onChange={(e) => setForm((f) => ({ ...f, description_bn: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-ink/70">Description (English)</label>
              <textarea
                className="input-field"
                rows={2}
                value={form.description_en}
                onChange={(e) => setForm((f) => ({ ...f, description_en: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-leaf"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              />
              Active (visible to customers)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-leaf"
                checked={form.isFeatured}
                onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-leaf"
                checked={form.isRnD}
                onChange={(e) => setForm((f) => ({ ...f, isRnD: e.target.checked }))}
              />
              R&amp;D product (sellable in the R&amp;D collection)
            </label>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary !py-2 text-sm">
              {saving ? "Saving…" : editingId ? "Save changes" : "Create product"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary !py-2 text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-forest/10 text-xs uppercase text-ink/40">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-forest/10">
            {loading ? (
              <tr><td className="p-4 text-ink/50" colSpan={6}>Loading…</td></tr>
            ) : products.length === 0 ? (
              <tr><td className="p-4 text-ink/50" colSpan={6}>No products yet — add your first one.</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id}>
                  <td className="flex items-center gap-3 p-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-sage-100">
                      {p.imageUrl && <Image src={p.imageUrl} alt={p.name_en} fill className="object-cover" />}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{p.name_en}</p>
                      <p className="font-bangla truncate text-xs text-ink/50">{p.name_bn}</p>
                    </div>
                  </td>
                  <td className="p-3 capitalize">{p.category}</td>
                  <td className="p-3">
                    {p.discountPrice ? (
                      <>
                        <span className="font-semibold text-leaf">{formatBDT(p.discountPrice)}</span>{" "}
                        <span className="text-ink/40 line-through">{formatBDT(p.price)}</span>
                      </>
                    ) : (
                      formatBDT(p.price)
                    )}
                  </td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${p.isActive ? "bg-mint-soft text-forest-400" : "bg-sage-100 text-ink/50"}`}>
                      {p.isActive ? "Active" : "Hidden"}
                    </span>
                    {p.isRnD && (
                      <span className="ml-1 rounded-full bg-turmeric-soft px-2 py-1 text-xs font-semibold text-turmeric">
                        R&amp;D
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap p-3 text-right">
                    <button onClick={() => openEdit(p)} className="mr-3 text-xs font-semibold text-leaf hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p)} className="text-xs font-semibold text-red-500 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

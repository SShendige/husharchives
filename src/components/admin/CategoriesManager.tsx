"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/actions/categoryActions";
import { slugify } from "@/lib/validations";
import {
  FolderGit2,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  _count: {
    discoveries: number;
  };
}

interface CategoriesManagerProps {
  initialCategories: CategoryWithCount[];
}

export function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setImageUrl("");
    setAutoSlug(true);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryWithCount) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setImageUrl(cat.imageUrl || "");
    setAutoSlug(false);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (autoSlug) {
      setSlug(slugify(val));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("imageUrl", imageUrl);

    startTransition(async () => {
      if (editingCategory) {
        const res = await updateCategoryAction(editingCategory.id, formData);
        if (res.success && res.category) {
          setCategories((prev) =>
            prev.map((c) =>
              c.id === editingCategory.id
                ? { ...c, ...res.category!, _count: c._count }
                : c
            )
          );
          setIsModalOpen(false);
        } else {
          setErrorMessage(res.error || "Failed to update category.");
        }
      } else {
        const res = await createCategoryAction(formData);
        if (res.success && res.category) {
          setCategories((prev) => [
            ...prev,
            { ...res.category!, _count: { discoveries: 0 } },
          ]);
          setIsModalOpen(false);
        } else {
          setErrorMessage(res.error || "Failed to create category.");
        }
      }
    });
  };

  const handleDelete = (id: string, name: string, count: number) => {
    if (count > 0) {
      alert(
        `Safe delete protection: Cannot delete "${name}" because ${count} discovery(s) are assigned to it. Reassign or delete those discoveries first.`
      );
      return;
    }

    if (!window.confirm(`Are you certain you want to delete category "${name}"?`)) {
      return;
    }

    startTransition(async () => {
      const res = await deleteCategoryAction(id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert(res.error || "Failed to delete category.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dusty-violet/20 pb-5">
        <div>
          <span className="text-xs font-mono text-discovery-orange uppercase tracking-wider font-semibold">
            TAXONOMY CONTROL
          </span>
          <h1
            className="text-2xl sm:text-3xl font-bold text-deep-archive font-display"
            style={{
              fontFamily:
                "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
            }}
          >
            Subject Cabinets
          </h1>
          <p className="text-xs sm:text-sm text-deep-archive/70 font-sans mt-0.5">
            Organize curiosities into curated themes and control archival taxonomy.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded bg-deep-archive hover:bg-archive-indigo text-cold-paper font-mono text-xs font-semibold tracking-wider transition flex items-center gap-1.5 shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-discovery-orange" />
          <span>NEW CABINET</span>
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-lg border border-dusty-violet/25 p-5 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded bg-deep-archive text-cold-paper">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-archive-paper/50 text-deep-archive font-semibold">
                  {cat._count.discoveries} FILES
                </span>
              </div>

              <div>
                <h3 className="font-display font-semibold text-lg text-deep-archive">
                  {cat.name}
                </h3>
                <span className="text-xs font-mono text-dusty-violet block">
                  /{cat.slug}
                </span>
                <p className="text-xs text-deep-archive/80 font-sans mt-2 line-clamp-3 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </div>

            {/* Actions Bottom Bar */}
            <div className="pt-3 border-t border-dusty-violet/15 flex items-center justify-between text-xs font-mono">
              <Link
                href={`/explore?category=${cat.slug}`}
                target="_blank"
                className="text-archive-indigo hover:text-discovery-orange transition flex items-center gap-1"
              >
                <span>View Public</span>
                <ExternalLink className="w-3 h-3" />
              </Link>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openEditModal(cat)}
                  className="px-2.5 py-1 rounded bg-archive-paper/40 hover:bg-archive-paper text-deep-archive transition flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(cat.id, cat.name, cat._count.discoveries)
                  }
                  className={`p-1.5 rounded transition cursor-pointer ${
                    cat._count.discoveries > 0
                      ? "text-dusty-violet/40 hover:text-dusty-violet cursor-not-allowed"
                      : "text-rose-600 hover:bg-rose-50"
                  }`}
                  title={
                    cat._count.discoveries > 0
                      ? "Safe delete: category has assigned discoveries"
                      : "Delete category"
                  }
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-dusty-violet/30 max-w-lg w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-dusty-violet/20 pb-3">
              <h3 className="font-display font-semibold text-lg text-deep-archive">
                {editingCategory ? "Edit Subject Cabinet" : "Create New Subject Cabinet"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-dusty-violet hover:text-deep-archive"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-deep-archive uppercase tracking-wider mb-1">
                  Cabinet Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={handleNameChange}
                  placeholder="e.g. Ambient Spaces"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded bg-cold-paper border border-dusty-violet/30 text-deep-archive focus:outline-none focus:border-deep-archive font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-deep-archive uppercase tracking-wider mb-1">
                  Slug (unique URL path) *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => {
                    setAutoSlug(false);
                    setSlug(e.target.value.toLowerCase().trim());
                  }}
                  placeholder="e.g. ambient-spaces"
                  className="w-full px-3 py-2 text-xs font-mono rounded bg-cold-paper border border-dusty-violet/30 text-deep-archive focus:outline-none focus:border-deep-archive"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-deep-archive uppercase tracking-wider mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the nature of creations stored in this cabinet..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded bg-cold-paper border border-dusty-violet/30 text-deep-archive focus:outline-none focus:border-deep-archive font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-deep-archive uppercase tracking-wider mb-1">
                  Cover Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs font-mono rounded bg-cold-paper border border-dusty-violet/30 text-deep-archive focus:outline-none focus:border-deep-archive"
                />
              </div>

              <div className="pt-3 border-t border-dusty-violet/20 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded border border-dusty-violet/30 text-xs font-mono hover:bg-archive-paper/30 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded bg-deep-archive hover:bg-archive-indigo text-cold-paper font-mono text-xs font-semibold tracking-wider transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>SAVING...</span>
                    </>
                  ) : (
                    <span>{editingCategory ? "UPDATE CABINET" : "CREATE CABINET"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriesManager;

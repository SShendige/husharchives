"use server";

import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { categorySchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: "Unauthorized. Admin session required." };
  }

  const rawData = {
    name: (formData.get("name") as string)?.trim(),
    slug: (formData.get("slug") as string)?.trim(),
    description: (formData.get("description") as string)?.trim(),
    imageUrl: (formData.get("imageUrl") as string)?.trim() || undefined,
  };

  const validation = categorySchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Validation failed",
    };
  }

  const existingSlug = await prisma.category.findUnique({
    where: { slug: validation.data.slug },
  });
  if (existingSlug) {
    return { success: false, error: "A category with this slug already exists." };
  }

  const existingName = await prisma.category.findUnique({
    where: { name: validation.data.name },
  });
  if (existingName) {
    return { success: false, error: "A category with this name already exists." };
  }

  try {
    const category = await prisma.category.create({
      data: {
        name: validation.data.name,
        slug: validation.data.slug,
        description: validation.data.description,
        imageUrl: validation.data.imageUrl || null,
      },
    });

    revalidatePath("/categories");
    revalidatePath("/explore");
    revalidatePath("/admin/categories");
    revalidatePath("/admin");

    return { success: true, category };
  } catch (error) {
    console.error("Failed to create category:", error);
    return { success: false, error: "Database error while creating category." };
  }
}

export async function updateCategoryAction(id: string, formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: "Unauthorized. Admin session required." };
  }

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, error: "Category not found." };
  }

  const rawData = {
    name: (formData.get("name") as string)?.trim(),
    slug: (formData.get("slug") as string)?.trim(),
    description: (formData.get("description") as string)?.trim(),
    imageUrl: (formData.get("imageUrl") as string)?.trim() || undefined,
  };

  const validation = categorySchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Validation failed",
    };
  }

  // Check slug uniqueness if changed
  if (validation.data.slug !== existing.slug) {
    const conflict = await prisma.category.findUnique({
      where: { slug: validation.data.slug },
    });
    if (conflict) {
      return { success: false, error: "Another category with this slug exists." };
    }
  }

  // Check name uniqueness if changed
  if (validation.data.name !== existing.name) {
    const conflict = await prisma.category.findUnique({
      where: { name: validation.data.name },
    });
    if (conflict) {
      return { success: false, error: "Another category with this name exists." };
    }
  }

  try {
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: validation.data.name,
        slug: validation.data.slug,
        description: validation.data.description,
        imageUrl: validation.data.imageUrl || null,
      },
    });

    revalidatePath("/categories");
    revalidatePath("/explore");
    revalidatePath("/admin/categories");
    revalidatePath("/admin");

    return { success: true, category };
  } catch (error) {
    console.error("Failed to update category:", error);
    return { success: false, error: "Database error while updating category." };
  }
}

export async function deleteCategoryAction(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: "Unauthorized. Admin session required." };
  }

  // Safe delete check: verify whether any discoveries belong to this category
  const discoveryCount = await prisma.discovery.count({
    where: { categoryId: id },
  });

  if (discoveryCount > 0) {
    return {
      success: false,
      error: `Cannot delete category: ${discoveryCount} discovery(s) are currently assigned to it. Please reassign or delete them first.`,
    };
  }

  try {
    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/categories");
    revalidatePath("/explore");
    revalidatePath("/admin/categories");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete category:", error);
    return { success: false, error: "Database error while deleting category." };
  }
}

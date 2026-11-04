"use server";

import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { discoverySchema, formatArchiveNumber } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getNextArchiveNumber(): Promise<string> {
  const latestDiscoveries = await prisma.discovery.findMany({
    select: { archiveNumber: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  let maxNum = 0;
  for (const item of latestDiscoveries) {
    const match = item.archiveNumber.match(/\d+/);
    if (match) {
      const val = parseInt(match[0], 10);
      if (val > maxNum) maxNum = val;
    }
  }

  // Double check with total count
  const count = await prisma.discovery.count();
  const nextNum = Math.max(maxNum + 1, count + 1);
  return formatArchiveNumber(nextNum);
}

export async function createDiscoveryAction(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: "Unauthorized. Admin session required." };
  }

  const rawTags = formData.get("tags") as string;
  const tags = rawTags
    ? rawTags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const rawStatus = (formData.get("status") as string) || "DRAFT";
  const isFeatured = formData.get("isFeatured") === "true" || formData.get("isFeatured") === "on";

  const rawData = {
    title: (formData.get("title") as string)?.trim(),
    slug: (formData.get("slug") as string)?.trim(),
    shortDescription: (formData.get("shortDescription") as string)?.trim(),
    fullDescription: (formData.get("fullDescription") as string)?.trim(),
    whyInteresting: (formData.get("whyInteresting") as string)?.trim(),
    whatToExplore: (formData.get("whatToExplore") as string)?.trim(),
    websiteUrl: (formData.get("websiteUrl") as string)?.trim(),
    imageUrl: (formData.get("imageUrl") as string)?.trim(),
    categoryId: (formData.get("categoryId") as string)?.trim(),
    tags,
    isFeatured,
    status: rawStatus as "DRAFT" | "PUBLISHED",
  };

  const validation = discoverySchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Validation failed",
    };
  }

  // Check slug uniqueness
  const existingSlug = await prisma.discovery.findUnique({
    where: { slug: validation.data.slug },
  });
  if (existingSlug) {
    return { success: false, error: "A discovery with this slug already exists." };
  }

  const archiveNumber = await getNextArchiveNumber();
  const publishedAt = validation.data.status === "PUBLISHED" ? new Date() : null;

  try {
    const discovery = await prisma.discovery.create({
      data: {
        archiveNumber,
        title: validation.data.title,
        slug: validation.data.slug,
        shortDescription: validation.data.shortDescription,
        fullDescription: validation.data.fullDescription,
        whyInteresting: validation.data.whyInteresting,
        whatToExplore: validation.data.whatToExplore,
        websiteUrl: validation.data.websiteUrl,
        imageUrl: validation.data.imageUrl,
        categoryId: validation.data.categoryId,
        tags: validation.data.tags,
        isFeatured: validation.data.isFeatured,
        status: validation.data.status,
        publishedAt,
      },
    });

    revalidatePath("/");
    revalidatePath("/explore");
    revalidatePath("/categories");
    revalidatePath("/admin");
    revalidatePath("/admin/discoveries");

    return { success: true, discovery };
  } catch (error) {
    console.error("Failed to create discovery:", error);
    return { success: false, error: "Database error while saving discovery." };
  }
}

export async function updateDiscoveryAction(id: string, formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: "Unauthorized. Admin session required." };
  }

  const existing = await prisma.discovery.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, error: "Discovery not found." };
  }

  const rawTags = formData.get("tags") as string;
  const tags = rawTags
    ? rawTags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const rawStatus = (formData.get("status") as string) || "DRAFT";
  const isFeatured = formData.get("isFeatured") === "true" || formData.get("isFeatured") === "on";

  const rawData = {
    title: (formData.get("title") as string)?.trim(),
    slug: (formData.get("slug") as string)?.trim(),
    shortDescription: (formData.get("shortDescription") as string)?.trim(),
    fullDescription: (formData.get("fullDescription") as string)?.trim(),
    whyInteresting: (formData.get("whyInteresting") as string)?.trim(),
    whatToExplore: (formData.get("whatToExplore") as string)?.trim(),
    websiteUrl: (formData.get("websiteUrl") as string)?.trim(),
    imageUrl: (formData.get("imageUrl") as string)?.trim(),
    categoryId: (formData.get("categoryId") as string)?.trim(),
    tags,
    isFeatured,
    status: rawStatus as "DRAFT" | "PUBLISHED",
  };

  const validation = discoverySchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Validation failed",
    };
  }

  // Check slug uniqueness if changed
  if (validation.data.slug !== existing.slug) {
    const slugConflict = await prisma.discovery.findUnique({
      where: { slug: validation.data.slug },
    });
    if (slugConflict) {
      return { success: false, error: "Another discovery with this slug already exists." };
    }
  }

  // Determine publishedAt timestamp
  let publishedAt = existing.publishedAt;
  if (validation.data.status === "PUBLISHED" && !publishedAt) {
    publishedAt = new Date();
  }

  try {
    const updated = await prisma.discovery.update({
      where: { id },
      data: {
        title: validation.data.title,
        slug: validation.data.slug,
        shortDescription: validation.data.shortDescription,
        fullDescription: validation.data.fullDescription,
        whyInteresting: validation.data.whyInteresting,
        whatToExplore: validation.data.whatToExplore,
        websiteUrl: validation.data.websiteUrl,
        imageUrl: validation.data.imageUrl,
        categoryId: validation.data.categoryId,
        tags: validation.data.tags,
        isFeatured: validation.data.isFeatured,
        status: validation.data.status,
        publishedAt,
      },
    });

    revalidatePath("/");
    revalidatePath("/explore");
    revalidatePath(`/explore/${existing.slug}`);
    revalidatePath(`/explore/${updated.slug}`);
    revalidatePath("/categories");
    revalidatePath("/admin");
    revalidatePath("/admin/discoveries");

    return { success: true, discovery: updated };
  } catch (error) {
    console.error("Failed to update discovery:", error);
    return { success: false, error: "Database error while updating discovery." };
  }
}

export async function deleteDiscoveryAction(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: "Unauthorized. Admin session required." };
  }

  try {
    const deleted = await prisma.discovery.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/explore");
    revalidatePath(`/explore/${deleted.slug}`);
    revalidatePath("/categories");
    revalidatePath("/admin");
    revalidatePath("/admin/discoveries");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete discovery:", error);
    return { success: false, error: "Database error while deleting discovery." };
  }
}

export async function toggleStatusAction(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: "Unauthorized." };
  }

  const item = await prisma.discovery.findUnique({ where: { id } });
  if (!item) return { success: false, error: "Discovery not found." };

  const newStatus = item.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
  const publishedAt =
    newStatus === "PUBLISHED" ? item.publishedAt || new Date() : item.publishedAt;

  await prisma.discovery.update({
    where: { id },
    data: { status: newStatus, publishedAt },
  });

  revalidatePath("/");
  revalidatePath("/explore");
  revalidatePath(`/explore/${item.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/discoveries");

  return { success: true, status: newStatus };
}

export async function toggleFeaturedAction(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: "Unauthorized." };
  }

  const item = await prisma.discovery.findUnique({ where: { id } });
  if (!item) return { success: false, error: "Discovery not found." };

  const updated = await prisma.discovery.update({
    where: { id },
    data: { isFeatured: !item.isFeatured },
  });

  revalidatePath("/");
  revalidatePath("/explore");
  revalidatePath("/admin");
  revalidatePath("/admin/discoveries");

  return { success: true, isFeatured: updated.isFeatured };
}

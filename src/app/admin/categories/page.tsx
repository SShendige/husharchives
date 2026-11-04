import React from "react";
import prisma from "@/lib/prisma";
import CategoriesManager from "@/components/admin/CategoriesManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { discoveries: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return <CategoriesManager initialCategories={categories} />;
}

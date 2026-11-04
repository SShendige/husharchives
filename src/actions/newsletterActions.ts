"use server";

import prisma from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validations";

export async function subscribeNewsletterAction(email: string) {
  const validation = newsletterSchema.safeParse({ email: email.trim() });
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Invalid email address",
    };
  }

  const cleanEmail = validation.data.email.toLowerCase().trim();

  try {
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      if (existing.status !== "ACTIVE") {
        await prisma.newsletterSubscriber.update({
          where: { id: existing.id },
          data: { status: "ACTIVE" },
        });
      }
      return {
        success: true,
        message: "You are already subscribed to the HUSH ARCHIVE dispatch.",
      };
    }

    await prisma.newsletterSubscriber.create({
      data: {
        email: cleanEmail,
        status: "ACTIVE",
      },
    });

    return {
      success: true,
      message: "Welcome to the archive. You are now subscribed to curations.",
    };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      success: false,
      error: "Unable to process subscription right now. Please try again.",
    };
  }
}

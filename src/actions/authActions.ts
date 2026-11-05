"use server";

import {
  authenticateAdmin,
  setAdminSession,
  clearAdminSession,
  getCurrentAdmin,
  changeAdminPassword,
} from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { redirect } from "next/navigation";
import { z } from "zod";

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function loginAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/admin";

  const parseResult = loginSchema.safeParse({ email, password });
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message || "Invalid input",
    };
  }

  const user = await authenticateAdmin(email, password);
  if (!user) {
    return {
      success: false,
      error: "Invalid email or password. Please verify credentials.",
    };
  }

  await setAdminSession(user);
  redirect(redirectTo);
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Password change — requires an active admin session.
// ---------------------------------------------------------------------------

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(10, "New password must be at least 10 characters long."),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"],
  });

export async function changeAdminPasswordAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getCurrentAdmin();
  if (!session) {
    return { success: false, error: "Not authenticated." };
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const parseResult = changePasswordSchema.safeParse({
    currentPassword,
    newPassword,
    confirmPassword,
  });

  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message || "Invalid input.",
    };
  }

  const result = await changeAdminPassword(
    session.id,
    parseResult.data.currentPassword,
    parseResult.data.newPassword
  );

  return result;
}

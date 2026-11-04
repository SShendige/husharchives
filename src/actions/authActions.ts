"use server";

import { authenticateAdmin, setAdminSession, clearAdminSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { redirect } from "next/navigation";

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

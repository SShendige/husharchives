import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

const COOKIE_NAME = "hush_admin_session";

// JWT_SECRET is required. Fail loudly at module load time if it is missing
// so misconfigured deployments are caught immediately rather than silently
// using a guessable fallback.
const _jwtSecret = process.env.JWT_SECRET;
if (!_jwtSecret) {
  throw new Error(
    "JWT_SECRET environment variable is required but has not been configured. " +
      "Set it to a long random string in your .env file before starting the server."
  );
}
const secretKey = new TextEncoder().encode(_jwtSecret);

export interface SessionPayload {
  id: string;
  email: string;
  role: "admin";
}

/**
 * Sign a new JWT session token
 */
export async function signToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

/**
 * Verify a JWT session token
 */
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Sets session cookie after successful login
 */
export async function setAdminSession(user: { id: string; email: string }) {
  const token = await signToken({
    id: user.id,
    email: user.email,
    role: "admin",
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return token;
}

/**
 * Clears the session cookie
 */
export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Gets current admin session from request cookies
 */
export async function getCurrentAdmin(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

/**
 * Verifies email and password against AdminUser in the database
 */
export async function authenticateAdmin(email: string, passwordPlain: string) {
  const user = await prisma.adminUser.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(passwordPlain, user.passwordHash);
  if (!isValid) {
    return null;
  }

  return { id: user.id, email: user.email };
}

/**
 * Changes the password for an authenticated admin user.
 * Verifies the current password before applying the change.
 * Never logs passwords.
 */
export async function changeAdminPassword(
  adminId: string,
  currentPasswordPlain: string,
  newPasswordPlain: string
): Promise<{ success: boolean; error?: string }> {
  if (newPasswordPlain.length < 10) {
    return { success: false, error: "New password must be at least 10 characters long." };
  }

  const user = await prisma.adminUser.findUnique({ where: { id: adminId } });
  if (!user) {
    return { success: false, error: "Admin account not found." };
  }

  const isCurrentValid = await bcrypt.compare(currentPasswordPlain, user.passwordHash);
  if (!isCurrentValid) {
    return { success: false, error: "Current password is incorrect." };
  }

  const newHash = await bcrypt.hash(newPasswordPlain, 12);
  await prisma.adminUser.update({
    where: { id: adminId },
    data: { passwordHash: newHash },
  });

  return { success: true };
}

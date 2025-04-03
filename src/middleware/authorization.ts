import { getServerSession } from "next-auth/next";
import { canAccess } from "../lib/rbac";

export async function authorize(
  request: Request,
  resource: string,
  action: string
) {
  const session = await getServerSession();
  if (
    !session ||
    !session.user.permissions ||
    !canAccess(session.user as any, resource, action)
  ) {
    throw new Error("Unauthorized");
  }
  // Authorized; continue request processing
}
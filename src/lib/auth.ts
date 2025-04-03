import type { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "@/db"

type Permission = { resource: string; action: string }
type RolePermissions = Record<string, Permission[]>

const DEFAULT_PERMISSIONS: RolePermissions = {
  admin: [
    { resource: "admin", action: "access_admin_panel" },
    { resource: "locations", action: "view" },
    { resource: "locations", action: "edit" }
  ],
  user: [],
  editor: [{ resource: "content", action: "edit" }]
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt", // Changed from "database" to "jwt"
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          const user = await db.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
              role: true,
              userPermissions: true
            }
          });

          if (!user?.password) return null;

          const passwordMatches = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordMatches) return null;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            permissions: user.userPermissions
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          permissions: token.permissions
        }
      };
    },
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          permissions: user.permissions
        };
      }
      return token;
    }
  },
  events: {
    async signIn({ user }) {
      // Ensure user has default permissions
      if (user.role === 'admin') {
        await db.userPermission.upsert({
          where: {
            userId_resource_action: {
              userId: user.id,
              resource: 'admin',
              action: 'access_admin_panel'
            }
          },
          create: {
            userId: user.id,
            resource: 'admin',
            action: 'access_admin_panel'
          },
          update: {}
        })
      }
    }
  }
}

// Extend next-auth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      permissions: Array<{
        resource: string
        action: string
      }>
    }
  }
}

export default authOptions
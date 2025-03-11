import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma"; // ✅ Ensure prisma instance is properly imported
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  debug: true,
  adapter: PrismaAdapter(prisma), // ✅ Store sessions in DB
  session: {
    strategy: "database", // ✅ Database-based sessions
  },
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) {
            throw new Error("No user found with this email");
          }

          const passwordMatch = await bcrypt.compare(credentials.password, user.password);
          if (!passwordMatch) {
            throw new Error("Incorrect password");
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          throw new Error("Authorization failed");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // ✅ Store user ID in JWT
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        if (session.user) {
          session.user.id = token.id; // ✅ Ensure user ID is in session
        }
      }
      return session;
    },
  },

  events: {
    async createSession({ session }) {
      try {
        await prisma.session.create({
          data: {
            sessionToken: session.id,
            userId: session.user.id,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        });
      } catch (error) {
        console.error("Session creation error:", error);
      }
    },
  },

  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

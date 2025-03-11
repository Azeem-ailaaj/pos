import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma), // ✅ Use PrismaAdapter to store sessions in DB
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and Password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!passwordMatch) {
          throw new Error("Incorrect password");
        }

        return user;
      }
    })
  ],
  session: {
    strategy: "database", // ✅ This will store sessions in your "Session" table
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin",
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

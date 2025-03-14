// /app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/utils"; // Assuming your Prisma client is in lib/utils

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
    };
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // You can add more providers here
  ],
  adapter: PrismaAdapter(prisma), // Using Prisma Adapter to handle user and session persistence
  secret: process.env.NEXTAUTH_SECRET, // Secret for JWT
  session: {
    strategy: "jwt", // Using JWT as the session strategy
  },
  callbacks: {
    // Called when the JWT is created (sign-in or sign-up)
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name ?? ""; // Default to an empty string if name is null/undefined
        token.image = user.image ?? ""; // Default to an empty string if image is null/undefined
      }
      return token;
    },

    // Called whenever the session is fetched
    async session({ session, token }) {
      if (session.user) {
        // Ensure id and email are always available as strings
        session.user.id = token.id as string ?? ''; // Default to empty string if undefined
        session.user.email = token.email as string ?? ''; // Default to empty string if undefined
        session.user.name = token.name ?? ""; // Default to an empty string if name is null/undefined
        session.user.image = token.image as string ?? ""; // Default to an empty string if image is null/undefined
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

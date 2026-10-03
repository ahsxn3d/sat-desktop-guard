import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  // Use Prisma Adapter to sync users, accounts, and sessions to PostgreSQL
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    // Google Cloud OAuth Provider
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),

    // Quick Sign-In / Demo Credentials Provider
    CredentialsProvider({
      id: 'credentials',
      name: 'Quick Access',
      credentials: {
        email: { label: 'Email Address', type: 'email', placeholder: 'student@example.com' },
        name: { label: 'Full Name', type: 'text', placeholder: 'Student Name' },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        const email = credentials.email.trim().toLowerCase();
        const adminEmail = (process.env.ADMIN_EMAIL || 'muhammadahsanjaved09@gmail.com').trim().toLowerCase();
        const isAdmin = email === adminEmail;

        // Upsert user in PostgreSQL so they have a persistent DB record
        const user = await prisma.user.upsert({
          where: { email },
          update: {
            name: credentials.name?.trim() || undefined,
            role: isAdmin ? 'ADMIN' : undefined
          },
          create: {
            email,
            name: credentials.name?.trim() || (isAdmin ? 'Admin Organizer' : 'SAT Scholar'),
            role: isAdmin ? 'ADMIN' : 'USER',
            streakCount: 1,
            lastActiveDate: new Date(),
            image: isAdmin
              ? 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminBoss'
              : `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(email)}`
          }
        });

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }

      const adminEmail = (process.env.ADMIN_EMAIL || 'muhammadahsanjaved09@gmail.com').trim().toLowerCase();
      const currentEmail = (token.email || '').trim().toLowerCase();

      token.role = currentEmail && currentEmail === adminEmail ? 'ADMIN' : 'USER';

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id || token.sub;
        (session.user as any).role = token.role || 'USER';
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-anti-burnout-rulebook-secret-key-32',
};

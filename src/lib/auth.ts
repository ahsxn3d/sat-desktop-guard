import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';

const useSecureCookies = process.env.NODE_ENV === 'production';
const cookiePrefix = useSecureCookies ? '__Secure-' : '';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
      },
    },
    csrfToken: {
      name: `${cookiePrefix}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
      },
    },
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),

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

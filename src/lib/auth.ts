import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
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
          }),
        ]
      : []),

    // Quick Sign-In / Demo Provider for instant testing and local development
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
        const adminEmail = (process.env.ADMIN_EMAIL || 'admin@gmail.com').trim().toLowerCase();
        const isAdmin = email === adminEmail;

        return {
          id: `usr-${Buffer.from(email).toString('hex').substring(0, 16)}`,
          name: credentials.name?.trim() || (isAdmin ? 'Admin Organizer' : 'SAT Scholar'),
          email: email,
          image: isAdmin
            ? 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminBoss'
            : `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(email)}`,
        };
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

      const adminEmail = (process.env.ADMIN_EMAIL || 'admin@gmail.com').trim().toLowerCase();
      const currentEmail = (token.email || '').trim().toLowerCase();

      // Check if current user is the configured Admin Gmail
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

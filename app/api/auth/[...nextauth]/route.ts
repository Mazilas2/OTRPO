import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const db = await open({
          filename: 'pokemons.db',
          driver: sqlite3.Database
        });
        // Get user with same email or same user_name
        const user = await db.get('SELECT * FROM users WHERE email = ? OR user_name = ?', credentials?.email);
        if (!user) {
          throw new Error('No user found');
        }
        // Compare password
        const isValid = await compare(credentials?.password, user.password);
        if (!isValid) {
          throw new Error('Incorrect password');
        }
        return { id: user.id, name: user.user_name, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: 'User/login'
  },
  callbacks: {
    async signIn({ account, email }) {
      console.log(account);
      if (account.provider === 'github') {
        // Check if email in database
        const db = await open({
          filename: 'pokemons.db',
          driver: sqlite3.Database
        });
        const user = await db.get('SELECT * FROM users WHERE email = ?', email);
        if (!user) {
          return false;
        }
        return true;
      }
      return true;
    },
  },
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST};
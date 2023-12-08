import NextAuth, {getServerSession} from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from 'next-auth/providers/credentials';
import {compare} from 'bcrypt';
import sqlite3 from 'sqlite3'
import {open} from 'sqlite'
import {authenticator} from "otplib";

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
                tfaToken: {},
            },
            async authorize(credentials, req) {
                const db = await open({
                    filename: 'pokemons.db',
                    driver: sqlite3.Database
                });
                console.log("AUTHORIZE")
                // Get user with same email or same user_name
                const user = await db.get('SELECT * FROM users WHERE email = ?', credentials?.email.toLowerCase());
                if (!user) {
                    throw new Error('No user found');
                }
                console.log(user.tfa_secret, "SECRET")
                if (user.tfa_secret) {
                    console.log("START CHECK")
                    authenticator.options = {
                        window: 1,
                    };
                    const token = authenticator.generate(user.tfa_secret);
                    console.log(token);
                    console.log(credentials?.tfaToken, token);
                    console.log(credentials?.tfaToken.length)
                    console.log(token.length)
                    const isValid = credentials?.tfaToken == token
                    console.log(isValid);
                    if (!isValid) {
                        throw new Error('Invalid 2FA code')
                    }

                }
                // Compare password
                const isValid = compare(credentials?.password, user.password);
                console.log(isValid);
                if (!isValid) {
                    throw new Error('Incorrect password');
                }
                console.log("COMPLETE")
                return {id: user.id, name: user.user_name, email: user.email};
            },
        }),
    ],
    pages: {
        signIn: 'User/login'
    },
    callbacks: {
        async signIn({account, profile}) {
            const session = await getServerSession()
            //console.log(account);
            console.log(session, "123123132");

            if (account.provider === 'github') {
                const githubEmail = profile.email.toLowerCase()
                console.log("GITHUB")
                const db = await open({
                    filename: 'pokemons.db',
                    driver: sqlite3.Database
                });
                if (session) {
                    // Обновить пользователя если входит в гитхаб имея аккаунт
                    const user = await db.get('SELECT * FROM users WHERE github_email = ?', githubEmail);
                    if (user) {
                        await db.run('UPDATE users SET github_email = NULL WHERE email = ?', session.user?.email);
                        console.log(`УДАЛЕНО ЗНАЧЕНИЕ GITHUB_EMAIL ИЗ ${session.user?.email}`)
                    } else {
                        try {
                            await db.run('UPDATE users SET github_email = ? WHERE email = ?', githubEmail, session.user?.email)
                            console.log(`ДОБАВЛЕНО ЗНАЧЕНИЕ GITHUB_EMAIL ИЗ ${session.user?.email}`)
                        } catch {
                            throw new Error('User with same oauth already exists')
                        }
                    }
                } else {
                    const user = await db.get('SELECT * FROM users WHERE github_email = ?', githubEmail);
                    console.log("RESULT - ", user)
                    if (!user) {
                        return false;
                    }
                    return true;
                }
            }
            console.log("RETURN TRUE")
            return true;
        },
    },
};

export const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
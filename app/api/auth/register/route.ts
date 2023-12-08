import { NextResponse } from "next/server";
import {hash} from "bcrypt";
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export async function POST(request: Request) {
    try {
        const {username, email, password} = await request.json();
        const hashedPassword = await hash(password, 10);
        console.log(username, email, password);
        const db = await open({
            filename: './pokemons.db',
            driver: sqlite3.Database
        });
        await db.run('INSERT INTO users (user_name, email, password) VALUES (?, ?, ?)', username, email, hashedPassword);
        await db.close();
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: false}, {status: 500});
    }

    return NextResponse.json({message: true});
}
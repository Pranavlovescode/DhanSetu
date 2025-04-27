import * as schema from '@/db/schema'
import {drizzle} from 'drizzle-orm/postgres-js'
import { NextResponse } from 'next/server';


const db = drizzle(process.env.DATABASE_URL)

export async function POST(request){
    try {
        const {fullName, email} = await request.json();
        
        // Validate inputs
        if (!fullName || !email) {
            return NextResponse.json(
                { error: "Full name and email are required" },
                { status: 400 }
            );
        }
        
        const newUser = await db.insert(schema.users)
            .values({full_name: fullName, email: email})
            .returning();

        return NextResponse.json({ user: newUser }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: "Failed to register user" },
            { status: 500 }
        );
    }
}


export async function GET() {
    return Response.json({ status: "ok" });
}
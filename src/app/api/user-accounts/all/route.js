import * as schema from "@/db/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, or, sql } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

export async function GET(req) {
  try {
    const current_user = await currentUser();
    if (!current_user) {
      console.log("not authorized");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    } else 
    {
      // console.log("user", user);
      const users = await db
        .select()
        .from(schema.users)
        .leftJoin(schema.userBankAccounts,eq(schema.users.id, schema.userBankAccounts.account_holder))
      if (!users) {
        return NextResponse.json(
          { message: "No users found" },
          { status: 404 }
        );
      } else {
        return NextResponse.json(
          { message: "Found users", users },
          { status: 200 }
        );
      }
    }
  } catch (error) {
    console.log("some error occured while creating acc", error);
    return NextResponse.json(
      { message: "Some error occured while creating account" },
      { status: 500 }
    );
  }
}

import * as schema from "@/db/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, or, sql } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

export async function POST(request) {
  try {
    const current_user = await currentUser();
    if (!current_user) {
      console.log("not authorized");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    } else {
      const existing_account = await db
        .select()
        .from(schema.userBankAccounts)
        .where(eq(schema.userBankAccounts.account_holder, current_user.id));
      if (existing_account) {
        return NextResponse.json(
          { message: "Account already exists for current user" },
          { status: 400 }
        );
      }
      const { balance, pan_number } = await request.json();
      const account = await db.insert(schema.userBankAccounts).values({
        balance: balance,
        account_holder: current_user.id,
        pan_number: pan_number,
      });
      console.log("account created", account);
      return NextResponse.json(
        { message: "Account created successfully", account },
        { status: 201 }
      );
    }
  } catch (error) {
    console.log("some error occured while creating acc", error);
    return NextResponse.json(
      { message: "Some error occured while creating account" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const current_user = await currentUser();
    if (!current_user) {
      console.log("not authorized");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    } else {
      const user = req.nextUrl.searchParams.get("user");
      console.log("user", user);
      const user_account = await db
        .select()
        .from(schema.userBankAccounts)
        .where(eq(schema.userBankAccounts.account_holder, user));
      if (!user_account) {
        return NextResponse.json(
          { message: "No account found" },
          { status: 404 }
        );
      } else {
        return NextResponse.json(
          { message: "Found bank account", user_account },
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

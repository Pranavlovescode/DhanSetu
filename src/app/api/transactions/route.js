import * as schema from "@/db/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, or, sql } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

export async function GET(request) {
  try {
    const senderId = request.nextUrl.searchParams.get("senderId");
    console.log("sender id", senderId);
    const current_user = await currentUser();
    if (!current_user) {
      console.log("not authorized");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    } else {
      const userTransactions = await db
        .select()
        .from(schema.userTransactions)
        .where(
          or(
            eq(schema.userTransactions.sender, senderId),
            eq(schema.userTransactions.receiver, senderId)
          )
        );
      if (userTransactions) {
        console.log("user transactions are ", userTransactions);
        return NextResponse.json(userTransactions, { status: 200 });
      } else {
        return NextResponse.json(
          { message: "No transactions found" },
          { status: 404 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Some error occured while fetching transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { amount,desc } = await request.json();
    const senderId = request.nextUrl.searchParams.get("senderId");
    const receiverId = request.nextUrl.searchParams.get("receiverId");
    console.log("senderId", senderId, "receiverId", receiverId);

    const current_user = await currentUser();
    if (!current_user) {
      console.log("not authorized");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Store the result of the transaction
    let result;

    try {
      await db.transaction(async (tx) => {
        const balance = await tx
          .select({ balance: schema.userBankAccounts.balance })
          .from(schema.userBankAccounts)
          .where(eq(schema.userBankAccounts.account_holder, senderId));
        
        if (balance[0].balance < amount) {
          // Set result and exit transaction with rollback
          result = { message: "Transaction aborted due to low balance", status: 401 };
          tx.rollback();
          return;
        }

        // deducting the amount from sender's account
        await tx
          .update(schema.userBankAccounts)
          .set({ balance: sql`${schema.userBankAccounts.balance}-${amount}` })
          .where(eq(schema.userBankAccounts.account_holder, senderId));
        
        // crediting the amount to receiver's account
        await tx
          .update(schema.userBankAccounts)
          .set({ balance: sql`${schema.userBankAccounts.balance}+${amount}` })
          .where(eq(schema.userBankAccounts.account_holder, receiverId));
        
        // adding the transaction in transaction table
        await tx
          .insert(schema.userTransactions)
          .values({ sender: senderId, receiver: receiverId, amount: amount,description:desc });
        
        // Set success result
        result = { message: "Transaction successful", status: 201 };
      });

      // Return response based on transaction result
      return NextResponse.json(
        { message: result.message },
        { status: result.status }
      );
    } catch (txError) {
      console.error("Transaction error:", txError);
      return NextResponse.json(
        { message: "Error during transaction processing" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Route handler error:", error);
    return NextResponse.json(
      { message: "Some error occurred while making transactions" },
      { status: 500 }
    );
  }
}
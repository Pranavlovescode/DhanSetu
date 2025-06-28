import * as schema from "@/db/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, or, sql } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

export async function POST(req) {
  try {
    const user = await currentUser();
    if (!user) {
      console.log("not authorized");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }else{
      const body = await req.json();
      const userRiskProfile = db.insert(schema.investmentProfile).values({
        tolerance_level:body.tolerance_level,
        experience:body.experience,
        goal:body.goal,
        monthlyInvestmentAmount:body.amount,
        sector:body.investSector,
        timeHorizon:body.timeHorizon,
        user_id:user.id
      }).returning();
      console.log("risk profile",userRiskProfile);
      return NextResponse.json(
        { message: "Risk Profile created successfully", userRiskProfile },
        { status: 201 }
      );
    }
  } catch (error) {
    console.log("error creating risk profile",error)
     return NextResponse.json(
      { message: error },
      { status: 500 }
    );
  }
}

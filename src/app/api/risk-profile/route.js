import * as schema from "@/db/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, or, sql } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

export async function GET(req) {
  try {
    const user = await currentUser();
    if (!user) {
      console.log("not authorized");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    } else {
      const id = req.nextUrl.searchParams.get("userId");
      const userRiskProfile = await db
        .select()
        .from(schema.investmentProfile)
        .where(eq(schema.investmentProfile.user_id, id));
      console.log("user risk profile", userRiskProfile);
      return NextResponse.json(
        {
          message: `risk profile of ${id} found`,
          riskProfile: userRiskProfile,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("some error occured while getting risk profile", error);
    return NextResponse.json(
      { message: "Some error occured while getting risk profile" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const user = await currentUser();
    if (!user) {
      console.log("not authorized");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    } else {
      const body = await req.json();
      const userRiskProfile = await db
        .insert(schema.investmentProfile)
        .values({
          tolerance_level: body.riskTolerance,
          experience: body.experience,
          goal: body.investmentGoals,
          monthlyInvestmentAmount: body.monthlyInvestment,
          sector: body.preferredSectors,
          timeHorizon: body.timeHorizon,
          user_id: user.id,
        })
        .returning();
      console.log("risk profile", userRiskProfile);
      return NextResponse.json(
        { message: "Risk Profile created successfully", userRiskProfile },
        { status: 201 }
      );
    }
  } catch (error) {
    console.log("error creating risk profile", error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const profile_id = req.nextUrl.searchParams.get("profile_id");
    const user = await currentUser();
    if (!user) {
      console.log("not authorized");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    } else {
      const body = await req.json();
      const existingRiskProfile = await db
        .select()
        .from(schema.investmentProfile)
        .where(eq(schema.investmentProfile.profile_id, profile_id));
      if (existingRiskProfile.length == 0) {
        return NextResponse.json(
          { message: `There is no existing risk profile with ${profile_id}` },
          { status: 404 }
        );
      } else {
        const updateData = {};
        if (body.riskTolerance !== undefined) updateData.tolerance_level = body.riskTolerance;
        if (body.experience !== undefined) updateData.experience = body.experience;
        if (body.investmentGoals !== undefined) updateData.goal = body.investmentGoals;
        if (body.monthlyInvestment !== undefined) updateData.monthlyInvestmentAmount = body.monthlyInvestment;
        if (body.preferredSectors !== undefined) updateData.sector = body.preferredSectors;
        if (body.timeHorizon !== undefined) updateData.timeHorizon = body.timeHorizon;

        const userRiskProfile = await db
          .update(schema.investmentProfile)
          .set(updateData)
          .where(eq(schema.investmentProfile.profile_id, profile_id))
          .returning();
        console.log("risk profile", userRiskProfile);
        return NextResponse.json(
          { message: "Risk Profile created successfully", userRiskProfile },
          { status: 200 }
        );
      }
    }
  } catch (error) {
    console.log("error creating risk profile", error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

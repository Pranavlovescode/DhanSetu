import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
  const {
    riskTolerance,
    experience,
    investmentGoals,
    timeHorizon,
    monthlyInvestment,
    preferredSectors,
  } = await req.json();

  try {
    const sectors = Array.isArray(preferredSectors) ? preferredSectors.join(", ") : "None specified";
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
                    You are a financial advisor AI. Given this investment profile:
                    - Risk Tolerance: ${riskTolerance}
                    - Experience: ${experience}
                    - Investment Goals: ${investmentGoals}
                    - Time Horizon: ${timeHorizon} years
                    - Monthly Investment: ₹${monthlyInvestment}
                    - Preferred Sectors: ${sectors}

                    Suggest:
                    1. Ideal asset allocation (Equity/Debt/Gold)
                    2. Monthly SIP advice
                    3. Rebalancing tips
                    4. Tax-saving opportunities
                    5. 2 sector-based suggestions
                    Keep it under 100 words.`,
            },
          ],
        },
      ],
    });

    const text = await response.text;
    return NextResponse.json({ message: text }, { status: 200 });
  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

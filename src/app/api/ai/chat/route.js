import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
  const { prompt } = await req.json();

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `You are a financial advisor, be consize, give the answer in layman language, do consider all financial terms, see to it that your response is short not more the 50-100 words, what ever amount is provided in prompt will be in indian rupees, consider yourself that you are and indian financial advisor. ${prompt}` }],
        },
      ],
    });

    const text = await response.text; 
    return NextResponse.json({ message: text }, { status: 200 });
  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

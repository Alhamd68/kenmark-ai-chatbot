import { NextResponse } from "next/server";
import websiteKB from "@/app/data/knowledge.json";
import fs from "fs";
import path from "path";

type KBItem = {
  question: string;
  answer: string;
};

/* ---------- Helpers ---------- */
function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
}

/* ---------- Load Knowledge ---------- */
function loadKnowledge(): KBItem[] {
  const excelPath = path.join(process.cwd(), "app/data/excelKnowledge.json");

  if (fs.existsSync(excelPath)) {
    const excelKB = JSON.parse(fs.readFileSync(excelPath, "utf-8"));
    return [...websiteKB, ...excelKB];
  }

  return websiteKB;
}

/* ---------- Chat API ---------- */
export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json({
        reply: "Please ask a valid question.",
      });
    }

    const userQuery = normalize(message);
    const knowledge = loadKnowledge();

    /* ---------- HARD BLOCK ---------- */
    const blocked = [
      "revenue",
      "profit",
      "financial",
      "ceo",
      "puzzle",
      "logic",
      "calculate",
      "infer",
    ];

    if (blocked.some(b => userQuery.includes(b))) {
      return NextResponse.json({
        reply: "I do not have that information available.",
      });
    }

    /* ---------- BEST MATCH SCORING ---------- */
    let bestMatch: KBItem | null = null;
    let bestScore = 0;

    for (const item of knowledge) {
      const q = normalize(item.question);
      const qWords = q.split(" ");
      const score = qWords.filter(w => userQuery.includes(w)).length;

      if (score > bestScore) {
        bestScore = score;
        bestMatch = item;
      }
    }

    /* ---------- CONFIDENCE CHECK ---------- */
    if (!bestMatch || bestScore < 2) {
      return NextResponse.json({
        reply: "I do not have that information available.",
      });
    }

    return NextResponse.json({
      reply: bestMatch.answer,
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      reply: "Something went wrong. Please try again later.",
    });
  }
}

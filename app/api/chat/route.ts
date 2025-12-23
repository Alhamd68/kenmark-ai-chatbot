import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import path from "path";

/* ---------------- Load Knowledge ---------------- */
async function loadKnowledgeBase() {
  const workbook = new ExcelJS.Workbook();
  const filePath = path.join(process.cwd(), "knowledge.xlsx");

  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.worksheets[0];

  const knowledge: { question: string; answer: string }[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const question = row.getCell(2).value?.toString() || "";
    const answer = row.getCell(3).value?.toString() || "";

    if (question && answer) {
      knowledge.push({ question, answer });
    }
  });

  return knowledge;
}

/* ---------------- Ollama Call ---------------- */
async function callLLM(prompt: string) {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "phi",
      prompt,
      stream: false,
    }),
  });

  const data = await response.json();
  return data.response;
}

/* ---------------- Chat API ---------------- */
export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ reply: "Please ask a valid question." });
    }

    const knowledgeBase = await loadKnowledgeBase();

    const context = knowledgeBase
      .map(
        (item) => `Q: ${item.question}\nA: ${item.answer}`
      )
      .join("\n\n");

    const systemPrompt = `
You are an AI assistant for Kenmark ITan Solutions.
Answer ONLY using the information below.
If the answer is not present, politely say you do not know.

Knowledge Base:
${context}

User Question:
${message}

Answer:
`;

    const aiResponse = await callLLM(systemPrompt);

    return NextResponse.json({ reply: aiResponse.trim() });
  } catch (error) {
    return NextResponse.json({
      reply: "Something went wrong while generating the response.",
    });
  }
}

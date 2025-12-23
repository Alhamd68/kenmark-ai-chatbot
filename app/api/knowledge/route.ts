import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "knowledge.xlsx");

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.worksheets[0];

    const knowledgeBase: {
      category: string;
      question: string;
      answer: string;
    }[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      const category = row.getCell(1).value?.toString() || "";
      const question = row.getCell(2).value?.toString() || "";
      const answer = row.getCell(3).value?.toString() || "";

      if (question && answer) {
        knowledgeBase.push({
          category,
          question,
          answer,
        });
      }
    });

    return NextResponse.json({ knowledgeBase });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load knowledge base" },
      { status: 500 }
    );
  }
}

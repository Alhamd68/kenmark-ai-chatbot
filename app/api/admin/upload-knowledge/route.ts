export const runtime = "nodejs";

import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || !file.name.endsWith(".xlsx")) {
      return NextResponse.json(
        { message: "Please upload a valid .xlsx file" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    const worksheet = workbook.worksheets[0];
    const parsed: { question: string; answer: string }[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const question = row.getCell(2).value?.toString().trim();
      const answer = row.getCell(3).value?.toString().trim();
      if (question && answer) parsed.push({ question, answer });
    });

    const outputPath = path.join(
      process.cwd(),
      "app/data/excelKnowledge.json"
    );

    fs.writeFileSync(outputPath, JSON.stringify(parsed, null, 2));

    return NextResponse.json({
      message: "Knowledge base updated successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to upload knowledge file" },
      { status: 500 }
    );
  }
}

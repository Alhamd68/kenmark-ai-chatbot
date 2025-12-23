import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    if (!file.name.endsWith(".xlsx")) {
      return NextResponse.json(
        { message: "Only .xlsx files are allowed" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(process.cwd(), "knowledge.xlsx");

    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      message: "Knowledge base updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to upload knowledge file" },
      { status: 500 }
    );
  }
}

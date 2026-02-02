import { NextResponse } from "next/server";
import { bots } from "@/lib/data";

export async function GET() {
  return NextResponse.json(bots);
}

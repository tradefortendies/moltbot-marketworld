import { NextResponse } from "next/server";
import { getAllDebates } from "@/lib/store";

export async function GET() {
  const debates = getAllDebates().filter((d) => d.status === "active");
  return NextResponse.json({ debates });
}

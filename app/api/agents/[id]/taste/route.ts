import { NextRequest, NextResponse } from "next/server";
import { getTasteProfile } from "@/lib/taste";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const taste = getTasteProfile(params.id);
  if (!taste) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }
  return NextResponse.json({ taste });
}

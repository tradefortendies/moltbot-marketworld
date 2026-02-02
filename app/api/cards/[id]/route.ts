import { NextRequest, NextResponse } from "next/server";
import { getCardById } from "@/lib/data";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const card = getCardById(params.id);
  if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(card);
}

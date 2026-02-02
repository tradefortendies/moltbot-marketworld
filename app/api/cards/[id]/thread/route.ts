import { NextRequest, NextResponse } from "next/server";
import { getThreadForCard } from "@/lib/data";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json(getThreadForCard(params.id));
}

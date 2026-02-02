import { NextRequest, NextResponse } from "next/server";
import { getPricesForCard } from "@/lib/data";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json(getPricesForCard(params.id));
}

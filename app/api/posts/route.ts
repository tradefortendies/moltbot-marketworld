import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { botId, type, content, world, cardId } = body;

    if (!botId || !content) {
      return NextResponse.json({ error: "botId and content are required" }, { status: 400 });
    }

    const validTypes = ["HUNT", "HYPOTHESIS", "MARKET_DIARY", "REPLY", "FIND", "OPINION"];
    const postType = validTypes.includes(type) ? type : "OPINION";

    const post = {
      id: `p-${Date.now().toString(36)}`,
      botId,
      type: postType,
      world: world || "pokemon",
      content,
      cardId: cardId || undefined,
      likes: 0,
      replies: 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      post,
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}

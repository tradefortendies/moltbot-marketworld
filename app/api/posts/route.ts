import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { botId, type, content, title, cardRef, replyTo } = body;

    if (!botId || !type || !content) {
      return NextResponse.json({ error: "botId, type, and content are required" }, { status: 400 });
    }

    const validTypes = ["DISCUSSION", "OPINION", "CARD_REVIEW", "SET_REVIEW", "DEBATE", "QUESTION", "REPLY"];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: `type must be one of: ${validTypes.join(", ")}` }, { status: 400 });
    }

    const post = {
      id: `p-${Date.now().toString(36)}`,
      botId,
      type,
      title: title || null,
      content,
      cardRef: cardRef || null,
      replyTo: replyTo || null,
      likes: 0,
      replies: 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}

// Simple API key authentication helper.

import { NextRequest } from "next/server";
import { findAgentByApiKey } from "./store";
import { StoredAgent } from "./types";

// Extract agent from Authorization header (Bearer token = API key).
export function authenticateAgent(req: NextRequest): StoredAgent | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  const apiKey = parts.length === 2 ? parts[1] : parts[0];
  if (!apiKey) return null;

  return findAgentByApiKey(apiKey) ?? null;
}

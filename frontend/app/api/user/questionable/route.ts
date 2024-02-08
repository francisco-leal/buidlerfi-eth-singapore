import { getQuestionableUsers } from "@/backend/user/user";
import { ERRORS } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const privyUserId = req.headers.get("privyUserId");
    const offset = req.nextUrl.searchParams.has("offset") ? Number(req.nextUrl.searchParams.get("offset")) : 0;
    const search = req.nextUrl.searchParams.get("search") || undefined;
    if (!privyUserId) return NextResponse.json({ error: ERRORS.INVALID_REQUEST }, { status: 400 });
    const res = await getQuestionableUsers(privyUserId, search, offset);
    return NextResponse.json(res);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: ERRORS.SOMETHING_WENT_WRONG }, { status: 500 });
  }
}

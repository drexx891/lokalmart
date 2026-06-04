import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    cookieStore.delete(sessionOptions.cookieName);

    // Redirect to login
    return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
}

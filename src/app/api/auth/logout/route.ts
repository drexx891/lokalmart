import { cookies } from "next/headers";
import { getSession, sessionOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabase";

export async function GET() {
    // 1. Destroy local iron-session
    const session = await getSession();
    session.destroy();

    // 2. Also delete the cookie directly just to be safe
    const cookieStore = await cookies();
    cookieStore.delete(sessionOptions.cookieName);

    // 3. Sign out from Supabase if we have a supabase session
    try {
        await supabasePublic.auth.signOut();
    } catch (e) {
        // Ignore supabase signout errors
    }

    // Redirect to login
    return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
}

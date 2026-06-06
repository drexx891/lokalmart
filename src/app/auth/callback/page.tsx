"use client";

import { useEffect } from "react";
import { supabasePublic } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        const { data: { subscription } } = supabasePublic.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                // Sync with our backend to set iron-session cookie
                fetch('/api/auth/sync-oauth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: session.user.email,
                        name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0],
                        avatarUrl: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null
                    })
                }).then(res => res.json()).then(data => {
                    if (data.success) {
                        window.location.href = '/'; // Hard reload so Navbar picks up cookie
                    } else {
                        router.push('/login?error=sync_failed');
                    }
                }).catch(err => {
                    console.error("Sync error:", err);
                    router.push('/login?error=sync_failed');
                });
            }
        });

        // Fallback timeout in case hash parsing fails or there is no hash
        const timeout = setTimeout(() => {
            supabasePublic.auth.getSession().then(({ data: { session } }) => {
                if (!session) {
                    router.push('/login?error=oauth_failed');
                }
            });
        }, 3000);

        return () => {
            subscription.unsubscribe();
            clearTimeout(timeout);
        };
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
            <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-[#1A3C6E] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-[#4B5563] font-medium">Menyelesaikan proses masuk...</p>
            </div>
        </div>
    );
}

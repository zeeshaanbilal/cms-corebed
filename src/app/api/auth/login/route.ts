import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;

    if (!wpUrl) {
      return NextResponse.json({ error: "WordPress URL missing" }, { status: 500 });
    }

    // Call WordPress JWT Auth endpoint
    const res = await fetch(`${wpUrl}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.message || "Invalid credentials" }, { status: res.status });
    }

    // Success - we have a token! 
    // Store it securely in an HTTP-only cookie so the frontend is authenticated.
    const cookieStore = await cookies();
    cookieStore.set({
      name: "wp_jwt",
      value: data.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return NextResponse.json({ 
      success: true, 
      user: {
        email: data.user_email,
        displayName: data.user_display_name,
      } 
    }, { status: 200 });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

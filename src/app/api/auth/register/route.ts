import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json();
    
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
    const consumerKey = process.env.WC_CONSUMER_KEY;
    const consumerSecret = process.env.WC_CONSUMER_SECRET;

    if (!wpUrl || !consumerKey || !consumerSecret) {
      return NextResponse.json({ error: "WooCommerce credentials missing" }, { status: 500 });
    }

    const authHeader = `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64")}`;

    // Call WooCommerce API to create a customer
    const res = await fetch(`${wpUrl}/wp-json/wc/v3/customers`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        first_name: firstName || "",
        last_name: lastName || "",
        username: email.split("@")[0], // generate a username from email
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.message || "Failed to register" }, { status: res.status });
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: data.id,
        email: data.email,
      } 
    }, { status: 201 });

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

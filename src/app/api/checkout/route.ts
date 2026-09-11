import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { contactInfo, shippingInfo, cartItems } = body;

    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
    const consumerKey = process.env.WC_CONSUMER_KEY;
    const consumerSecret = process.env.WC_CONSUMER_SECRET;

    if (!wpUrl || !consumerKey || !consumerSecret) {
      return NextResponse.json({ error: "WooCommerce credentials missing" }, { status: 500 });
    }

    // Map the Next.js cart items to WooCommerce line_items format
    // WooCommerce requires product_id and quantity
    const line_items = cartItems.map((item: any) => ({
      // We assume item.productId is a string, WooCommerce expects integer ID
      product_id: parseInt(item.productId.replace(/\D/g,'')) || 0, // Fallback if ID is "p1" etc, though real products will have real numeric IDs
      quantity: item.quantity,
    }));

    // In a real environment, if your mocked products have IDs like 'p1', 
    // WooCommerce will reject them because it expects real integer IDs. 
    // However, since we recently connected real WooCommerce products, 
    // their IDs should be integers passed as strings.

    const orderData = {
      payment_method: "bacs", // Fake method for now or whatever you configure in WC
      payment_method_title: "Direct Bank Transfer",
      set_paid: true,
      created_via: "Headless Next.js Checkout", // This fixes the 'Unknown' origin
      billing: {
        first_name: shippingInfo.firstName,
        last_name: shippingInfo.lastName,
        address_1: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        postcode: shippingInfo.zipCode,
        country: "US", // Default or extract from form
        email: contactInfo.email,
        phone: "0000000000",
      },
      shipping: {
        first_name: shippingInfo.firstName,
        last_name: shippingInfo.lastName,
        address_1: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        postcode: shippingInfo.zipCode,
        country: "US",
      },
      line_items,
    };

    const authHeader = `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64")}`;

    const res = await fetch(`${wpUrl}/wp-json/wc/v3/orders`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error("WooCommerce Order Error:", errData);
      return NextResponse.json({ error: "Failed to create order in WooCommerce", details: errData }, { status: res.status });
    }

    const order = await res.json();

    return NextResponse.json({ success: true, orderId: order.id }, { status: 201 });

  } catch (error) {
    console.error("Checkout API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { getProducts } from "@/lib/wordpress";
import { ShopClient } from "../ShopClient";

// Opt into Next.js 15+ async params correctly
export default async function ShopPage({ params }: { params: Promise<{ category?: string[] }> }) {
  const unwrappedParams = await params;
  const categoryParam = unwrappedParams.category?.[0];
  
  // Fetch real products from WooCommerce!
  const products = await getProducts();

  return (
    <ShopClient products={products} categoryParam={categoryParam} />
  );
}

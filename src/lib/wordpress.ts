export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
}

export async function fetchLatestPosts(count: number = 3): Promise<Post[]> {
  const query = `
    query GetLatestPosts($first: Int!) {
      posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          title
          slug
          excerpt
          date
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  `;

  // We are wrapping this in a try-catch because if the URL is dummy or fails,
  // we don't want the build/page to crash completely.
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT || "https://cms.corebed.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { first: count },
      }),
      // Revalidate every hour (3600 seconds) - adjust as needed
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error("Failed to fetch posts from WordPress:", res.statusText);
      return [];
    }

    const { data } = await res.json();
    return data?.posts?.nodes || [];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// WooCommerce Integration
import { Product, Category } from "./data";

export async function getProducts(): Promise<Product[]> {
  const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const consumerKey = process.env.WC_CONSUMER_KEY;
  const consumerSecret = process.env.WC_CONSUMER_SECRET;

  if (!wpUrl || !consumerKey || !consumerSecret) {
    console.warn("WooCommerce credentials are missing. Returning empty products array.");
    return [];
  }

  try {
    const authHeader = `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64")}`;
    
    const res = await fetch(`${wpUrl}/wp-json/wc/v3/products?per_page=20`, {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      cache: "no-store", // Completely disable caching so new products appear instantly
    });

    if (!res.ok) {
      console.error("Failed to fetch from WooCommerce API:", res.status, res.statusText);
      return [];
    }

    const wcProducts = await res.json();

    // Map WooCommerce response to our internal Product interface
    return wcProducts.map((wc: any): Product => {
      // Extract main category or fallback
      let catName = wc.categories && wc.categories.length > 0 
        ? wc.categories[0].name 
        : "Mattresses";
        
      // If category is "Uncategorized", try to guess from the name
      if (catName === "Uncategorized") {
        const lowerName = wc.name.toLowerCase();
        if (lowerName.includes("pillow")) {
          catName = "Pillows";
        } else if (lowerName.includes("bed") || lowerName.includes("sheet")) {
          catName = "Bedding";
        } else {
          catName = "Mattresses"; // Default fallback for their store
        }
      }
        
      // Extract images
      let images: string[] = [];
      
      // 1. Get Hostinger image if it exists
      if (wc.meta_data) {
        const hostingerImage = wc.meta_data.find((m: any) => m.key === 'hostinger_preview_image_url');
        if (hostingerImage && hostingerImage.value) {
          images.push(hostingerImage.value);
        }
      }
      
      // 2. Add WooCommerce standard/gallery images, ignoring the default placeholder
      if (wc.images && wc.images.length > 0) {
        const wcImgs = wc.images
          .map((img: any) => img.src)
          .filter((src: string) => !src.includes("woocommerce-placeholder"));
          
        // Add them to the array if they aren't already there (to avoid duplicates)
        wcImgs.forEach((src: string) => {
          if (!images.includes(src)) {
            images.push(src);
          }
        });
      }
      
      // Fallback image if still empty
      if (images.length === 0) {
        images = ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800"];
      }

      // Extract raw description or use short description
      const desc = wc.short_description 
        ? wc.short_description.replace(/(<([^>]+)>)/gi, "") // strip HTML tags
        : (wc.description ? wc.description.replace(/(<([^>]+)>)/gi, "") : "Premium quality product from Corebed.");

      // Extract attributes dynamically from WooCommerce
      let sizes = ["Standard"];
      let firmness: string[] = [];
      let materials = ["Premium Materials"];
      let features = ["High Quality", "Durable"];

      if (wc.attributes && wc.attributes.length > 0) {
        // Extract Size
        const sizeAttr = wc.attributes.find((a: any) => a.name.toLowerCase() === 'size');
        if (sizeAttr && sizeAttr.options && sizeAttr.options.length > 0) {
          sizes = sizeAttr.options;
        }

        // Extract Firmness
        const firmAttr = wc.attributes.find((a: any) => a.name.toLowerCase() === 'firmness');
        if (firmAttr && firmAttr.options && firmAttr.options.length > 0) {
          firmness = firmAttr.options;
        }

        // Extract Materials
        const matAttr = wc.attributes.find((a: any) => a.name.toLowerCase() === 'materials' || a.name.toLowerCase() === 'material');
        if (matAttr && matAttr.options && matAttr.options.length > 0) {
          materials = matAttr.options;
        }

        // Extract Features
        const featAttr = wc.attributes.find((a: any) => a.name.toLowerCase() === 'features' || a.name.toLowerCase() === 'feature' || a.name.toLowerCase() === 'key features');
        if (featAttr && featAttr.options && featAttr.options.length > 0) {
          features = featAttr.options;
        }
      }

      return {
        id: wc.id.toString(),
        slug: wc.slug,
        name: wc.name,
        description: desc,
        htmlDescription: wc.description || "", // Keep the raw HTML so images show up
        category: catName as Category,
        price: parseFloat(wc.price || "0"),
        compareAtPrice: wc.regular_price && wc.sale_price ? parseFloat(wc.regular_price) : undefined,
        rating: parseFloat(wc.average_rating || "5.0"),
        reviewCount: wc.rating_count || 0,
        images,
        materials,
        sizes: sizes as any, // Cast as any because Size type might be too restrictive in data.ts
        firmness: firmness.length > 0 ? (firmness as any) : undefined,
        features,
      };
    });

  } catch (error) {
    console.error("Error fetching WooCommerce products:", error);
    return [];
  }
}


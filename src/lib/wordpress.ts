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
      next: { revalidate: 60 }, // ISR Revalidation set to 60 seconds
    });

    if (!res.ok) {
      console.error("Failed to fetch from WooCommerce API:", res.status, res.statusText);
      return [];
    }

    const wcProducts = await res.json();

    // Map WooCommerce response to our internal Product interface
    return wcProducts.map((wc: any): Product => {
      // Extract main category or fallback
      const catName = wc.categories && wc.categories.length > 0 
        ? wc.categories[0].name 
        : "Bedding";
        
      // Extract images
      let images: string[] = [];
      if (wc.images && wc.images.length > 0) {
        images = wc.images.map((img: any) => img.src);
      } else if (wc.meta_data) {
        // Check for dropshipping/Hostinger custom image meta
        const hostingerImage = wc.meta_data.find((m: any) => m.key === 'hostinger_preview_image_url');
        if (hostingerImage && hostingerImage.value) {
          images = [hostingerImage.value];
        }
      }
      
      // Fallback image if still empty
      if (images.length === 0) {
        images = ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800"];
      }

      // Extract raw description or use short description
      const desc = wc.short_description 
        ? wc.short_description.replace(/(<([^>]+)>)/gi, "") // strip HTML tags
        : (wc.description ? wc.description.replace(/(<([^>]+)>)/gi, "") : "Premium quality product from Corebed.");

      return {
        id: wc.id.toString(),
        slug: wc.slug,
        name: wc.name,
        description: desc,
        category: catName as Category,
        price: parseFloat(wc.price || "0"),
        compareAtPrice: wc.regular_price && wc.sale_price ? parseFloat(wc.regular_price) : undefined,
        rating: parseFloat(wc.average_rating || "5.0"),
        reviewCount: wc.rating_count || 0,
        images,
        materials: ["Premium Materials"], // Default/fallback for UI
        sizes: ["Standard"], // Default/fallback for UI
        features: ["High Quality", "Durable"], // Default/fallback for UI
      };
    });

  } catch (error) {
    console.error("Error fetching WooCommerce products:", error);
    return [];
  }
}


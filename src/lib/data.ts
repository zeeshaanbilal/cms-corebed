export type Category = "Mattresses" | "Pillows" | "Bedding" | "Bundles";
export type Firmness = "Plush" | "Medium" | "Firm";
export type Size = "Twin" | "Full" | "Queen" | "King" | "Cal King" | "Standard";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: Category;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  materials: string[];
  sizes: Size[];
  firmness?: Firmness[];
  features: string[];
}

export const products: Product[] = [
  {
    id: "p1",
    slug: "core-hybrid-mattress",
    name: "The Core Hybrid Mattress",
    description: "Our signature hybrid mattress combining adaptive foam with responsive pocketed coils for the perfect balance of comfort and support.",
    category: "Mattresses",
    price: 1295,
    compareAtPrice: 1495,
    rating: 4.9,
    reviewCount: 2450,
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=800",
    ],
    materials: ["Organic Cotton Cover", "Cooling Gel Memory Foam", "Responsive Pocketed Coils", "High-Density Base Foam"],
    sizes: ["Twin", "Full", "Queen", "King", "Cal King"],
    firmness: ["Plush", "Medium", "Firm"],
    features: ["120-Night Trial", "10-Year Warranty", "Free Shipping & Returns"],
  },
  {
    id: "p2",
    slug: "organic-cotton-sheets",
    name: "Organic Cotton Percale Sheets",
    description: "Crisp, cool, and breathable. Woven from 100% organic cotton for a luxurious hotel feel.",
    category: "Bedding",
    price: 185,
    rating: 4.8,
    reviewCount: 1205,
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1582582621959-48d27397dc69?auto=format&fit=crop&q=80&w=800",
    ],
    materials: ["100% Long-Staple Organic Cotton"],
    sizes: ["Twin", "Full", "Queen", "King", "Cal King"],
    features: ["OEKO-TEX® Certified", "Gets softer with every wash", "Deep pockets fit mattresses up to 16\""],
  },
  {
    id: "p3",
    slug: "down-alternative-pillow",
    name: "Cloud Memory Foam Pillow",
    description: "Adaptive support that cradles your neck. Engineered for back and side sleepers.",
    category: "Pillows",
    price: 85,
    rating: 4.7,
    reviewCount: 890,
    images: [
      "https://images.unsplash.com/photo-1582582621959-48d27397dc69?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800",
    ],
    materials: ["Shredded Memory Foam", "Bamboo Rayon Cover"],
    sizes: ["Standard", "King"],
    features: ["Adjustable Fill", "Cooling Cover", "Hypoallergenic"],
  },
  {
    id: "p4",
    slug: "weighted-blanket",
    name: "Calm Weighted Blanket",
    description: "Deep touch pressure therapy to reduce anxiety and promote deeper sleep.",
    category: "Bedding",
    price: 145,
    compareAtPrice: 175,
    rating: 4.9,
    reviewCount: 420,
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800",
    ],
    materials: ["Glass Microbeads", "Organic Cotton Shell"],
    sizes: ["Standard"],
    features: ["15 lbs Weight", "Even Weight Distribution", "Machine Washable Cover"],
  },
  {
    id: "p5",
    slug: "luxe-sleep-bundle",
    name: "The Luxe Sleep Bundle",
    description: "Everything you need for the perfect bed. Includes the Core Hybrid, two Cloud Pillows, and a set of Organic Sheets.",
    category: "Bundles",
    price: 1495,
    compareAtPrice: 1750,
    rating: 5.0,
    reviewCount: 156,
    images: [
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800",
    ],
    materials: ["See individual items"],
    sizes: ["Queen", "King", "Cal King"],
    firmness: ["Plush", "Medium", "Firm"],
    features: ["Save 15% when bundled", "All 120-Night Trial items", "Free Shipping"],
  },
  {
    id: "p6",
    slug: "essential-platform-bed",
    name: "Essential Platform Bed",
    description: "A minimalist, tool-free assembly bed frame built from sustainably sourced wood.",
    category: "Mattresses", /* Technically Furniture, but grouping under Mattresses for simplicity */
    price: 695,
    rating: 4.6,
    reviewCount: 312,
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800",
    ],
    materials: ["Sustainably Sourced Pine", "Steel Hardware"],
    sizes: ["Twin", "Full", "Queen", "King", "Cal King"],
    features: ["Tool-Free Assembly", "Life-Time Warranty", "Squeak-Free Design"],
  }
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};

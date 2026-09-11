"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/data";
import { useCartStore, useShopStore } from "@/lib/store";
import { Heart, Star } from "lucide-react";
import gsap from "gsap";
import { useRef } from "react";

export function ProductCard({ product, className = "" }: { product: Product; className?: string }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const addItem = useCartStore(state => state.addItem);
  const { wishlist, toggleWishlist } = useShopStore();
  
  const isWishlisted = wishlist.includes(product.id);

  const handleHover = (isEnter: boolean) => {
    if (!imageRef.current) return;
    gsap.to(imageRef.current, {
      scale: isEnter ? 1.05 : 1,
      duration: 0.8,
      ease: "power2.out"
    });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      product,
      quantity: 1,
      size: product.sizes[0],
      firmness: product.firmness?.[0],
    });
  };

  // Determine badges
  const isSale = product.compareAtPrice && product.price < product.compareAtPrice;
  const isBestseller = product.rating >= 4.8;

  return (
    <div 
      className={`group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#F3F4F6] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 ${className}`}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-[#F8FAFC]">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {isSale && (
            <span className="bg-[#EF4444] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-sm">
              Sale
            </span>
          )}
          {isBestseller && !isSale && (
            <span className="bg-[#D4AF37] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-sm">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button 
          onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm z-20 hover:bg-white transition-all duration-200"
        >
          <Heart strokeWidth={1.5} className={`w-4 h-4 ${isWishlisted ? "fill-[#EF4444] text-[#EF4444]" : "text-core-muted-foreground hover:text-core-ink"}`} />
        </button>

        <Image
          ref={imageRef}
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>

      <div className="flex flex-col flex-grow p-5">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-[#D4AF37]">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={`w-3.5 h-3.5 ${star <= Math.round(product.rating) ? "fill-current" : "fill-transparent text-[#E2E8F0]"}`} />
            ))}
          </div>
          <span className="text-[11px] text-core-muted-foreground font-medium ml-1">({product.reviewCount})</span>
        </div>

        <Link href={`/product/${product.slug}`} className="font-heading text-lg text-core-ink hover:text-[#D4AF37] transition-colors mb-1 line-clamp-1">
          {product.name}
        </Link>
        <p className="text-core-muted-foreground text-sm font-light mb-4 line-clamp-2 min-h-[40px]">
          {product.description}
        </p>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            {product.compareAtPrice && (
              <span className="text-core-muted-foreground line-through text-xs mb-0.5">
                ${product.compareAtPrice.toLocaleString()}
              </span>
            )}
            <span className="text-core-ink font-bold text-lg leading-none">${product.price.toLocaleString()}</span>
          </div>
          
          <button 
            onClick={(e) => { e.preventDefault(); handleQuickAdd(e); }}
            className="bg-core-ink text-white px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide hover:bg-[#D4AF37] shadow-sm hover:shadow-md transition-all duration-300 active:scale-95"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

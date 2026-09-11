"use client";

import { useState } from "react";
import { Product, Size, Firmness } from "@/lib/data";
import { useCartStore } from "@/lib/store";

export function ProductForm({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<Size | undefined>(product.sizes[0]);
  const [selectedFirmness, setSelectedFirmness] = useState<Firmness | undefined>(product.firmness?.[0]);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(state => state.addItem);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      product,
      quantity,
      size: selectedSize,
      firmness: selectedFirmness,
    });
  };

  return (
    <div className="space-y-10">
      {/* Size Selector */}
      {product.sizes.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-heading text-lg tracking-wide text-core-ink uppercase text-sm">Select Size</span>
            <button className="text-xs font-semibold uppercase tracking-widest text-core-muted-foreground hover:text-core-ink transition-colors border-b border-core-line pb-[2px]">Size Guide</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`relative py-4 px-4 border rounded-sm text-sm font-medium transition-all duration-300 overflow-hidden ${
                  selectedSize === size 
                    ? "border-core-ink text-white shadow-md bg-core-ink" 
                    : "border-core-line text-core-ink hover:border-core-ink bg-transparent"
                }`}
              >
                <span className="relative z-10">{size}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Firmness Selector */}
      {product.firmness && product.firmness.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-heading text-lg tracking-wide text-core-ink uppercase text-sm">Select Firmness</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {product.firmness.map((firm) => (
              <button
                key={firm}
                onClick={() => setSelectedFirmness(firm)}
                className={`py-4 px-4 border rounded-sm text-sm font-medium transition-all duration-300 ${
                  selectedFirmness === firm 
                    ? "border-core-ink text-white shadow-md bg-core-ink" 
                    : "border-core-line text-core-ink hover:border-core-ink bg-transparent"
                }`}
              >
                {firm}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Add to Cart */}
      <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-core-line">
        <div className="flex items-center border border-core-line rounded-sm sm:w-32 justify-between bg-white shadow-sm">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-14 flex items-center justify-center text-core-ink hover:bg-core-muted transition-colors text-lg"
          >
            -
          </button>
          <span className="font-medium text-core-ink">{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="w-12 h-14 flex items-center justify-center text-core-ink hover:bg-core-muted transition-colors text-lg"
          >
            +
          </button>
        </div>
        
        <button 
          onClick={handleAddToCart}
          className="flex-1 bg-core-ink text-white hover:bg-core-accent hover:scale-[1.02] transition-all duration-300 shadow-lg h-14 rounded-sm text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2"
        >
          Add to Cart <span className="opacity-50">|</span> ${(product.price * quantity).toLocaleString()}
        </button>
      </div>
      
      <div className="flex items-center justify-center sm:justify-start gap-2 text-xs uppercase tracking-widest text-core-muted-foreground pt-4 font-semibold">
        <svg className="w-4 h-4 text-core-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        Ships free in 2-4 business days.
      </div>

    </div>
  );
}

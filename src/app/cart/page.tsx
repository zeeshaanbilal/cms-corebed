"use client";

import { useCartStore } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { X, Minus, Plus, ShieldCheck, Truck } from "lucide-react";

export default function CartPage() {
  const { items, cartTotal, updateQuantity, removeItem } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-core-bg pt-32 pb-24 px-6 flex flex-col items-center justify-center text-center">
        <h1 className="font-heading text-4xl text-core-ink mb-6">Your Cart is Empty</h1>
        <p className="text-core-muted-foreground mb-10 max-w-md">
          Looks like you haven't added anything to your cart yet. Discover our premium sleep collection.
        </p>
        <Link href="/shop" className={buttonVariants({ className: "bg-core-ink text-white hover:bg-core-ink/90 rounded-sm h-12 px-10 uppercase tracking-widest text-xs font-semibold" })}>Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-core-bg pt-32 pb-24">
      <div className="max-w-[1440px] mx-auto px-6">
        <h1 className="font-heading text-4xl md:text-5xl text-core-ink mb-12">Your Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="border-t border-core-line">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-6 py-8 border-b border-core-line">
                  <div className="relative w-32 h-40 bg-core-muted rounded-sm overflow-hidden flex-shrink-0">
                    <Image 
                      src={item.product.images[0]} 
                      alt={item.product.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link href={`/product/${item.product.slug}`} className="font-heading text-xl text-core-ink hover:opacity-70 transition-opacity">
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-core-muted-foreground mt-2 uppercase tracking-wider">
                          {item.size && `${item.size} `}
                          {item.firmness && `• ${item.firmness}`}
                        </p>
                      </div>
                      <span className="font-medium text-core-ink">${item.product.price.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-end mt-6">
                      <div className="flex items-center border border-core-line rounded-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center text-core-ink hover:bg-core-muted transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center text-core-ink hover:bg-core-muted transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-core-muted-foreground hover:text-core-ink underline underline-offset-4 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-[#EBE7DF] p-8 rounded-sm sticky top-32">
              <h2 className="font-heading text-2xl text-core-ink mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm text-core-ink mb-6 pb-6 border-b border-core-line">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-core-accent font-medium">Free</span>
                </div>
                <div className="flex justify-between text-core-muted-foreground">
                  <span>Estimated Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="font-heading text-xl">Total</span>
                <span className="font-heading text-2xl">${cartTotal.toLocaleString()}</span>
              </div>

              <Link href="/checkout" className={buttonVariants({ className: "w-full bg-core-ink text-white hover:bg-core-ink/90 rounded-sm h-14 uppercase tracking-widest text-xs font-semibold mb-6 flex items-center justify-center" })}>Proceed to Checkout</Link>

              {/* Trust Badges */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-core-muted-foreground">
                  <ShieldCheck className="w-5 h-5 text-core-ink" />
                  <span>120-Night Risk-Free Trial</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-core-muted-foreground">
                  <Truck className="w-5 h-5 text-core-ink" />
                  <span>Free Shipping & Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

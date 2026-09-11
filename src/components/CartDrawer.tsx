"use client";

import { useCartStore } from "@/lib/store";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { ShoppingCart, X, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export function CartDrawer() {
  const { items, cartDrawerOpen, setCartDrawerOpen, cartTotal, updateQuantity, removeItem } = useCartStore();

  return (
    <Sheet open={cartDrawerOpen} onOpenChange={setCartDrawerOpen}>
      <SheetTrigger className="relative p-2 hover:opacity-70 transition-opacity">
        <ShoppingCart strokeWidth={1.5} className="w-5 h-5" />
        {items.length > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-core-accent text-[10px] text-white">
            {items.length}
          </span>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md bg-core-bg border-l border-core-line flex flex-col p-0 h-full">
        <SheetHeader className="p-6 border-b border-core-line">
          <SheetTitle className="font-heading font-normal text-2xl tracking-tight text-core-ink">Your Cart</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <p className="text-core-muted-foreground">Your cart is currently empty.</p>
              <Button 
                variant="outline" 
                onClick={() => setCartDrawerOpen(false)}
                className="border-core-ink text-core-ink hover:bg-core-ink hover:text-core-bg transition-colors rounded-sm"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b border-core-line pb-6">
                <div className="relative w-24 h-24 bg-core-muted rounded-sm overflow-hidden flex-shrink-0">
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
                      <h4 className="font-medium text-sm text-core-ink">{item.product.name}</h4>
                      <p className="text-xs text-core-muted-foreground mt-1 uppercase tracking-wider">
                        {item.size && `${item.size} `}
                        {item.firmness && `• ${item.firmness}`}
                      </p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-core-muted-foreground hover:text-core-ink transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center border border-core-line rounded-sm">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-core-muted text-core-ink transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-sm text-core-ink">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-core-muted text-core-ink transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="font-medium text-sm text-core-ink">${(item.product.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-core-line bg-core-bg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium uppercase tracking-wider text-core-ink">Subtotal</span>
              <span className="font-heading text-xl text-core-ink">${cartTotal.toLocaleString()}</span>
            </div>
            <p className="text-xs text-core-muted-foreground mb-6">Shipping & taxes calculated at checkout.</p>
            <Link href="/checkout" onClick={() => setCartDrawerOpen(false)} className={buttonVariants({ className: "w-full bg-core-ink text-white hover:bg-core-ink/90 rounded-sm h-12 uppercase tracking-widest text-xs font-semibold flex items-center justify-center" })}>
              Checkout
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

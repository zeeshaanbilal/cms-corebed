"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";

const checkoutSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "ZIP Code is required"),
  cardNumber: z.string().min(16, "Invalid card number"),
  expDate: z.string().min(5, "Invalid expiration date"),
  cvv: z.string().min(3, "Invalid CVV"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutForm() {
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    
    // Get cart items from local store (assuming useCartStore exposes items)
    const cartItems = useCartStore.getState().items;
    
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contactInfo: { email: data.email },
          shippingInfo: {
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
          },
          cartItems, // Passes the full cart array to the API
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        console.error("Checkout Failed:", err);
        alert("Failed to process order. Check console for details.");
        setIsSubmitting(false);
        return;
      }

      // Success!
      clearCart();
      router.push("/order-confirmation");
      
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      
      {/* Contact Info */}
      <section>
        <h2 className="font-heading text-2xl text-core-ink mb-6 pb-2 border-b border-core-line">1. Contact Information</h2>
        <div>
          <label className="block text-sm font-medium text-core-ink mb-2">Email Address</label>
          <input 
            {...register("email")}
            type="email" 
            className="w-full bg-transparent border border-core-line p-3 rounded-sm focus:outline-none focus:border-core-gold" 
          />
          {errors.email && <p className="text-core-destructive text-xs mt-1">{errors.email.message}</p>}
        </div>
      </section>

      {/* Shipping Info */}
      <section>
        <h2 className="font-heading text-2xl text-core-ink mb-6 pb-2 border-b border-core-line">2. Shipping Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-core-ink mb-2">First Name</label>
            <input {...register("firstName")} type="text" className="w-full bg-transparent border border-core-line p-3 rounded-sm focus:outline-none focus:border-core-gold" />
            {errors.firstName && <p className="text-core-destructive text-xs mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-core-ink mb-2">Last Name</label>
            <input {...register("lastName")} type="text" className="w-full bg-transparent border border-core-line p-3 rounded-sm focus:outline-none focus:border-core-gold" />
            {errors.lastName && <p className="text-core-destructive text-xs mt-1">{errors.lastName.message}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-core-ink mb-2">Address</label>
            <input {...register("address")} type="text" className="w-full bg-transparent border border-core-line p-3 rounded-sm focus:outline-none focus:border-core-gold" />
            {errors.address && <p className="text-core-destructive text-xs mt-1">{errors.address.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-core-ink mb-2">City</label>
            <input {...register("city")} type="text" className="w-full bg-transparent border border-core-line p-3 rounded-sm focus:outline-none focus:border-core-gold" />
            {errors.city && <p className="text-core-destructive text-xs mt-1">{errors.city.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-core-ink mb-2">State</label>
            <input {...register("state")} type="text" className="w-full bg-transparent border border-core-line p-3 rounded-sm focus:outline-none focus:border-core-gold" />
            {errors.state && <p className="text-core-destructive text-xs mt-1">{errors.state.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-core-ink mb-2">ZIP Code</label>
            <input {...register("zipCode")} type="text" className="w-full bg-transparent border border-core-line p-3 rounded-sm focus:outline-none focus:border-core-gold" />
            {errors.zipCode && <p className="text-core-destructive text-xs mt-1">{errors.zipCode.message}</p>}
          </div>
        </div>
      </section>

      {/* Payment Info */}
      <section>
        <h2 className="font-heading text-2xl text-core-ink mb-6 pb-2 border-b border-core-line">3. Payment</h2>
        <div className="bg-[#EBE7DF]/50 p-6 rounded-sm border border-core-line">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-core-ink mb-2">Card Number</label>
              <input {...register("cardNumber")} type="text" placeholder="0000 0000 0000 0000" className="w-full bg-white border border-core-line p-3 rounded-sm focus:outline-none focus:border-core-gold" />
              {errors.cardNumber && <p className="text-core-destructive text-xs mt-1">{errors.cardNumber.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-core-ink mb-2">Expiration Date</label>
              <input {...register("expDate")} type="text" placeholder="MM/YY" className="w-full bg-white border border-core-line p-3 rounded-sm focus:outline-none focus:border-core-gold" />
              {errors.expDate && <p className="text-core-destructive text-xs mt-1">{errors.expDate.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-core-ink mb-2">CVV</label>
              <input {...register("cvv")} type="text" placeholder="123" className="w-full bg-white border border-core-line p-3 rounded-sm focus:outline-none focus:border-core-gold" />
              {errors.cvv && <p className="text-core-destructive text-xs mt-1">{errors.cvv.message}</p>}
            </div>
          </div>
        </div>
      </section>

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-core-ink text-white hover:bg-core-ink/90 rounded-sm h-14 uppercase tracking-widest text-xs font-semibold disabled:opacity-50"
      >
        {isSubmitting ? "Processing..." : "Place Order"}
      </Button>
    </form>
  );
}

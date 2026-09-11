"use client";

import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { Shield, Truck, Moon, ArrowRight } from "lucide-react";
import { NewsletterBand } from "@/components/NewsletterBand";

export default function Home() {
  return (
    <div className="bg-[#F8FAFC]">
      {/* 1. PREMIUM HERO (Standard E-commerce Style) */}
      <section className="relative h-[85vh] min-h-[600px] w-full flex items-center justify-center pt-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=2000"
            alt="Luxury Bedroom"
            fill
            className="object-cover"
            priority
          />
          {/* Dark Overlay to make text readable always */}
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 px-6 max-w-5xl mx-auto w-full text-center flex flex-col items-center">
          <h1 className="font-heading text-5xl md:text-7xl text-white mb-6 drop-shadow-md">
            Experience the Ultimate Comfort
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mb-10 drop-shadow">
            Upgrade your sleep with our premium quality mattresses, designed for perfect spinal alignment and deep rest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/shop" 
              className="bg-core-gold text-white hover:bg-yellow-600 transition-colors px-10 py-4 uppercase tracking-widest text-sm font-bold rounded shadow-lg"
            >
              Shop All Products
            </Link>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION BANNER */}
      <section className="bg-white border-b border-core-line py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-core-line">
          <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
            <Moon className="w-10 h-10 text-core-gold mb-4 stroke-[1.5]" />
            <h3 className="font-heading text-xl text-core-ink mb-2">120-Night Sleep Trial</h3>
            <p className="text-sm text-core-muted-foreground">Try it at home. Don't love it? Return it for free.</p>
          </div>
          <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
            <Truck className="w-10 h-10 text-core-gold mb-4 stroke-[1.5]" />
            <h3 className="font-heading text-xl text-core-ink mb-2">Fast & Free Shipping</h3>
            <p className="text-sm text-core-muted-foreground">Delivered straight to your door at no extra cost.</p>
          </div>
          <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
            <Shield className="w-10 h-10 text-core-gold mb-4 stroke-[1.5]" />
            <h3 className="font-heading text-xl text-core-ink mb-2">10-Year Warranty</h3>
            <p className="text-sm text-core-muted-foreground">Built with premium materials to last a decade.</p>
          </div>
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY (Standard Grid) */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl text-core-ink mb-4">Shop By Category</h2>
          <p className="text-core-muted-foreground text-lg">Find exactly what you need for a better night's sleep.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/shop/mattresses" className="group relative h-[450px] overflow-hidden rounded shadow-md">
            <Image 
              src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800" 
              alt="Mattresses" 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-0 w-full text-center">
              <h3 className="font-heading text-3xl text-white mb-2">Mattresses</h3>
              <span className="text-core-gold text-xs font-bold uppercase tracking-widest group-hover:text-white transition-colors">View Collection &rarr;</span>
            </div>
          </Link>
          
          <Link href="/shop/pillows" className="group relative h-[450px] overflow-hidden rounded shadow-md">
            <Image 
              src="https://images.unsplash.com/photo-1582582621959-48d27397dc69?auto=format&fit=crop&q=80&w=800" 
              alt="Pillows" 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-0 w-full text-center">
              <h3 className="font-heading text-3xl text-white mb-2">Pillows</h3>
              <span className="text-core-gold text-xs font-bold uppercase tracking-widest group-hover:text-white transition-colors">View Collection &rarr;</span>
            </div>
          </Link>
          
          <Link href="/shop/bedding" className="group relative h-[450px] overflow-hidden rounded shadow-md">
            <Image 
              src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800" 
              alt="Bedding" 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-0 w-full text-center">
              <h3 className="font-heading text-3xl text-white mb-2">Bedding</h3>
              <span className="text-core-gold text-xs font-bold uppercase tracking-widest group-hover:text-white transition-colors">View Collection &rarr;</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. BESTSELLERS (Standard 4-Column Grid) */}
      <section className="bg-white py-24 px-6 border-t border-core-line">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h2 className="font-heading text-4xl text-core-ink mb-2">Our Bestsellers</h2>
              <p className="text-core-muted-foreground">Customer favorites that guarantee a perfect sleep.</p>
            </div>
            <Link 
              href="/shop" 
              className="flex items-center gap-2 text-core-ink font-semibold hover:text-core-gold transition-colors"
            >
              View All Products <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          {/* Simple Standard Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. NEWSLETTER */}
      <NewsletterBand />
    </div>
  );
}

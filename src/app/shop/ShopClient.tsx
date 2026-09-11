"use client";

import { useEffect, useState, useMemo } from "react";
import { Product, Category, Size, Firmness } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import gsap from "gsap";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, Filter } from "lucide-react";
import { useShopStore } from "@/lib/store";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface ShopClientProps {
  products: Product[];
  categoryParam?: string;
}

export function ShopClient({ products, categoryParam }: ShopClientProps) {
  const { activeFilters, setFilter, clearFilters } = useShopStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  // Sync route category with store if present on mount
  useEffect(() => {
    if (categoryParam) {
      const formatted = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
      setFilter("categories", [formatted]);
    }
  }, [categoryParam, setFilter]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    // Categories
    if (activeFilters.categories.length > 0) {
      result = result.filter(p => activeFilters.categories.includes(p.category));
    }

    // Sizes
    if (activeFilters.sizes.length > 0) {
      result = result.filter(p => p.sizes.some(s => activeFilters.sizes.includes(s)));
    }

    // Firmness
    if (activeFilters.firmness.length > 0) {
      result = result.filter(p => p.firmness?.some(f => activeFilters.firmness.includes(f)));
    }

    // Price
    result = result.filter(p => p.price >= activeFilters.priceRange[0] && p.price <= activeFilters.priceRange[1]);

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // featured (keep as-is or default order)
        break;
    }

    return result;
  }, [searchQuery, activeFilters, sortBy, products]);

  // Animate grid items on filter change
  useEffect(() => {
    const cards = document.querySelectorAll('.product-grid-item');
    if (cards.length > 0) {
      gsap.fromTo(cards, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [filteredProducts]);

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Category */}
      <div>
        <h4 className="font-heading text-lg mb-4 text-core-ink">Category</h4>
        <div className="space-y-3">
          {["Mattresses", "Pillows", "Bedding", "Bundles"].map(cat => (
            <div key={cat} className="flex items-center space-x-3">
              <Checkbox 
                id={`cat-${cat}`}
                className="w-5 h-5 rounded border-[#E2E8F0] data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
                checked={activeFilters.categories.includes(cat as any)}
                onCheckedChange={(checked) => {
                  const newCats = checked 
                    ? [...activeFilters.categories, cat] 
                    : activeFilters.categories.filter(c => c !== cat);
                  setFilter("categories", newCats);
                }}
              />
              <label htmlFor={`cat-${cat}`} className="text-sm font-medium leading-none text-core-ink cursor-pointer">{cat}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-[#F3F4F6] w-full" />

      {/* Price */}
      <div>
        <h4 className="font-heading text-lg mb-6 text-core-ink">Price Range</h4>
        <Slider 
          defaultValue={[0, 3000]}
          value={activeFilters.priceRange}
          max={3000}
          step={50}
          onValueChange={(val) => setFilter("priceRange", val as [number, number])}
          className="mb-6 [&_.relative]:bg-[#D4AF37]"
        />
        <div className="flex justify-between text-sm font-bold text-core-ink">
          <span>${activeFilters.priceRange[0]}</span>
          <span>${activeFilters.priceRange[1]}</span>
        </div>
      </div>

      <div className="h-px bg-[#F3F4F6] w-full" />

      {/* Size */}
      <div>
        <h4 className="font-heading text-lg mb-4 text-core-ink">Size</h4>
        <div className="space-y-3">
          {["Twin", "Full", "Queen", "King", "Cal King", "Standard"].map(size => (
            <div key={size} className="flex items-center space-x-3">
              <Checkbox 
                id={`size-${size}`}
                className="w-5 h-5 rounded border-[#E2E8F0] data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
                checked={activeFilters.sizes.includes(size as any)}
                onCheckedChange={(checked) => {
                  const newSizes = checked 
                    ? [...activeFilters.sizes, size] 
                    : activeFilters.sizes.filter(s => s !== size);
                  setFilter("sizes", newSizes);
                }}
              />
              <label htmlFor={`size-${size}`} className="text-sm font-medium leading-none text-core-ink cursor-pointer">{size}</label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="h-px bg-[#F3F4F6] w-full" />

      {/* Firmness */}
      <div>
        <h4 className="font-heading text-lg mb-4 text-core-ink">Firmness</h4>
        <div className="space-y-3">
          {["Plush", "Medium", "Firm"].map(firmness => (
            <div key={firmness} className="flex items-center space-x-3">
              <Checkbox 
                id={`firmness-${firmness}`}
                className="w-5 h-5 rounded border-[#E2E8F0] data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
                checked={activeFilters.firmness.includes(firmness as any)}
                onCheckedChange={(checked) => {
                  const newFirms = checked 
                    ? [...activeFilters.firmness, firmness] 
                    : activeFilters.firmness.filter(f => f !== firmness);
                  setFilter("firmness", newFirms);
                }}
              />
              <label htmlFor={`firmness-${firmness}`} className="text-sm font-medium leading-none text-core-ink cursor-pointer">{firmness}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const pageTitle = categoryParam ? `${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)}` : "All Collections";

  return (
    <div className="bg-white min-h-screen pb-40">
      
      {/* Minimalist Typography Header */}
      <div className="pt-40 pb-20 px-6 text-center max-w-4xl mx-auto">
        <h1 className="font-heading text-6xl md:text-8xl text-core-ink mb-6 tracking-tight">
          {pageTitle}
        </h1>
        <div className="w-12 h-[1px] bg-core-ink mx-auto mb-8"></div>
        <p className="text-core-muted-foreground text-lg md:text-xl font-light tracking-wide">
          Thoughtfully designed for a better night's rest.
        </p>
      </div>

      <div className="max-w-[1440px] mx-auto px-6">
        
        {/* Sleek Horizontal Filter Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 border-y border-[#F3F4F6] py-4 mb-16">
          
          <div className="flex items-center gap-8 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            <Sheet>
              <SheetTrigger className="flex items-center gap-2 text-core-ink text-xs uppercase tracking-widest font-semibold hover:opacity-70 transition-opacity whitespace-nowrap">
                <Filter className="w-3.5 h-3.5" /> Filter Collection
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-md bg-white border-r border-[#F3F4F6] p-10 overflow-y-auto">
                <SheetHeader className="mb-12 text-left">
                  <SheetTitle className="font-heading text-4xl text-core-ink">Filters</SheetTitle>
                </SheetHeader>
                <FilterContent />
                
                <div className="mt-16 pt-8 border-t border-[#F3F4F6]">
                  <button 
                    onClick={clearFilters}
                    className="w-full border border-core-ink py-4 text-xs uppercase tracking-widest font-semibold hover:bg-core-ink hover:text-white transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Active filter chips */}
            {(activeFilters.categories.length > 0 || activeFilters.sizes.length > 0 || activeFilters.firmness.length > 0) && (
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-[10px] uppercase tracking-widest text-core-muted-foreground mr-2">Active:</span>
                {[...activeFilters.categories, ...activeFilters.sizes, ...activeFilters.firmness].map(chip => (
                  <span key={chip} className="inline-flex items-center gap-1.5 bg-[#F9F9F9] px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-core-ink">
                    {chip}
                    <button onClick={() => {
                      if (activeFilters.categories.includes(chip as any)) setFilter("categories", activeFilters.categories.filter(c => c !== chip));
                      if (activeFilters.sizes.includes(chip as any)) setFilter("sizes", activeFilters.sizes.filter(c => c !== chip));
                      if (activeFilters.firmness.includes(chip as any)) setFilter("firmness", activeFilters.firmness.filter(c => c !== chip));
                    }}>
                      <X className="w-3 h-3 text-core-muted-foreground hover:text-core-ink transition-colors" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end">
            <span className="text-[10px] uppercase tracking-widest text-core-muted-foreground">{filteredProducts.length} Items</span>
            
            <Select value={sortBy} onValueChange={(val) => val && setSortBy(val)}>
              <SelectTrigger className="w-[180px] bg-transparent border-none text-xs uppercase tracking-widest font-medium focus:ring-0 shadow-none justify-end gap-2">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="border-[#F3F4F6] bg-white rounded-none shadow-xl">
                <SelectItem value="featured" className="text-xs uppercase tracking-widest py-3 cursor-pointer">Featured</SelectItem>
                <SelectItem value="price-asc" className="text-xs uppercase tracking-widest py-3 cursor-pointer">Price: Low to High</SelectItem>
                <SelectItem value="price-desc" className="text-xs uppercase tracking-widest py-3 cursor-pointer">Price: High to Low</SelectItem>
                <SelectItem value="rating" className="text-xs uppercase tracking-widest py-3 cursor-pointer">Top Rated</SelectItem>
                <SelectItem value="newest" className="text-xs uppercase tracking-widest py-3 cursor-pointer">Newest Arrivals</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Product Grid (Full Width) */}
        <div>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-40">
              <h3 className="font-heading text-4xl text-core-ink mb-6">Nothing found.</h3>
              <p className="text-core-muted-foreground mb-10 text-lg font-light">We couldn't find any items matching your exact criteria.</p>
              <button onClick={clearFilters} className="text-core-ink border-b border-core-ink pb-1 text-xs uppercase tracking-widest font-semibold hover:text-core-muted-foreground hover:border-core-muted-foreground transition-all">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-grid-item opacity-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

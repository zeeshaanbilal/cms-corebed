import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Size, Firmness } from './data';

export interface CartItem {
  id: string; // unique ID for cart item (product.id + size + firmness)
  productId: string;
  product: Product;
  quantity: number;
  size?: Size;
  firmness?: Firmness;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  get cartTotal(): number;
  get cartCount(): number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      cartDrawerOpen: false,
      setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),
      addItem: (item) => {
        const id = `${item.productId}-${item.size || 'default'}-${item.firmness || 'default'}`;
        const existingItem = get().items.find((i) => i.id === id);
        
        if (existingItem) {
          get().updateQuantity(id, existingItem.quantity + item.quantity);
        } else {
          set({ items: [...get().items, { ...item, id }] });
        }
        set({ cartDrawerOpen: true });
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },
      clearCart: () => set({ items: [] }),
      get cartTotal() {
        return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },
      get cartCount() {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'corebed-cart',
      partialize: (state) => ({ items: state.items }), // Only persist items
    }
  )
);

interface ShopState {
  wishlist: string[]; // array of product IDs
  toggleWishlist: (productId: string) => void;
  activeFilters: {
    categories: string[];
    sizes: string[];
    firmness: string[];
    priceRange: [number, number];
  };
  setFilter: (type: keyof ShopState['activeFilters'], value: any) => void;
  clearFilters: () => void;
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      toggleWishlist: (productId) => {
        const wishlist = get().wishlist;
        if (wishlist.includes(productId)) {
          set({ wishlist: wishlist.filter(id => id !== productId) });
        } else {
          set({ wishlist: [...wishlist, productId] });
        }
      },
      activeFilters: {
        categories: [],
        sizes: [],
        firmness: [],
        priceRange: [0, 10000],
      },
      setFilter: (type, value) => {
        set({
          activeFilters: {
            ...get().activeFilters,
            [type]: value,
          },
        });
      },
      clearFilters: () => set({
        activeFilters: {
          categories: [],
          sizes: [],
          firmness: [],
          priceRange: [0, 10000],
        }
      })
    }),
    {
      name: 'corebed-shop',
    }
  )
);

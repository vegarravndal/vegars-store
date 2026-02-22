import { create } from "zustand";
import { Product, CartItem, Store } from "../types/types";

// Load cart data from localStorage on initial load with error handling
const loadCartFromLocalStorage = (): CartItem[] => {
  const storedCart = localStorage.getItem("cart");
  try {
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Error loading cart from localStorage", error);
    return [];
  }
};

// Save cart data to localStorage whenever it changes
const saveCartToLocalStorage = (cart: CartItem[]) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const useStore = create<Store>((set) => ({
  cart: loadCartFromLocalStorage(), // Initialize cart with data from localStorage
  selectedCategory: null,
  originalProducts: [
    {
      id: "1", // id as string
      name: "Laptop",
      category: "electronics",
      price: 999,
      imageUrl: "/images/1.jpg", // Image URL for the product
      description:
        "A high-performance laptop with a powerful processor, perfect for gaming and productivity.",
    },
    {
      id: "2", // id as string
      name: "High heels",
      category: "clothing",
      price: 79,
      imageUrl: "/images/2.jpg", // Image URL for the product
      description:
        "Elegant and stylish, these high heels add the perfect touch of sophistication to any outfit—designed for both comfort and confidence, from day to night.",
    },
    {
      id: "3", // id as string
      name: "Organic cleaner",
      category: "home",
      price: 14,
      imageUrl: "/images/3.jpg", // Image URL for the product
      description:
        "Our Eco-friendly Organic Cleaner effectively tackles dirt and stains without harmful chemicals. Safe for your home and the planet, it cleans all surfaces while leaving a fresh, natural scent. Clean smarter with a healthier, sustainable solution!",
    },
    // More products can be added here
  ],
  products: [], // Initially empty, will be set to originalProducts

  addToCart: (product: Product, quantity: number) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id);
      let newCart;
      if (existingItem) {
        // If item already in cart, update quantity
        newCart = state.cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // If item not in cart, add it
        newCart = [...state.cart, { ...product, quantity }];
      }
      // Save updated cart to localStorage
      saveCartToLocalStorage(newCart);
      return { cart: newCart };
    }),

  removeFromCart: (id: string) =>
    set((state) => {
      const newCart = state.cart.filter((item) => item.id !== id);
      // Save updated cart to localStorage
      saveCartToLocalStorage(newCart);
      return { cart: newCart };
    }),

  setCart: (cart: CartItem[]) => {
    // Save updated cart to localStorage
    saveCartToLocalStorage(cart);
    set({ cart });
  },

  setSelectedCategory: (category: string | null) =>
    set((state) => {
      const filteredProducts = category
        ? state.originalProducts.filter(
            (product) => product.category === category
          )
        : state.originalProducts;
      return { selectedCategory: category, products: filteredProducts };
    }),

  setProducts: (products: Product[]) => set({ products }),

  resetFilters: () =>
    set((state) => ({
      selectedCategory: null,
      products: state.originalProducts,
    })),
}));

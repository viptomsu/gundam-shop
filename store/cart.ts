import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
	variantId: string;
	productId: string;
	name: string; // Product Name + Variant Name (e.g., "Gundam Exia - MG")
	slug: string;
	image: string;
	price: number; // Price at time of adding (handles sale price)
	quantity: number;
	maxStock: number;
}

interface CartState {
	items: CartItem[];
	isOpen: boolean;
}

interface CartActions {
	addItem: (item: CartItem) => void;
	removeItem: (variantId: string) => void;
	updateQuantity: (variantId: string, delta: number) => void;
	clearCart: () => void;
	setOpen: (isOpen: boolean) => void;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
	persist(
		(set, get) => ({
			items: [],
			isOpen: false,

			addItem: (item) => {
				set((state) => {
					const existingIndex = state.items.findIndex(
						(i) => i.variantId === item.variantId
					);

					if (existingIndex !== -1) {
						// Item exists - increment quantity (respecting maxStock)
						const updatedItems = [...state.items];
						const existing = updatedItems[existingIndex];
						const newQuantity = Math.min(
							existing.quantity + item.quantity,
							existing.maxStock
						);
						updatedItems[existingIndex] = {
							...existing,
							quantity: newQuantity,
						};
						return { items: updatedItems, isOpen: true };
					}

					// New item - add to cart
					return {
						items: [...state.items, item],
						isOpen: true,
					};
				});
			},

			removeItem: (variantId) => {
				set((state) => ({
					items: state.items.filter((i) => i.variantId !== variantId),
				}));
			},

			updateQuantity: (variantId, delta) => {
				set((state) => {
					const itemIndex = state.items.findIndex(
						(i) => i.variantId === variantId
					);
					if (itemIndex === -1) return state;

					const item = state.items[itemIndex];
					const newQuantity = item.quantity + delta;

					// Remove if quantity reaches 0
					if (newQuantity <= 0) {
						return {
							items: state.items.filter((i) => i.variantId !== variantId),
						};
					}

					// Cap at maxStock
					const clampedQuantity = Math.min(newQuantity, item.maxStock);

					const updatedItems = [...state.items];
					updatedItems[itemIndex] = { ...item, quantity: clampedQuantity };

					return { items: updatedItems };
				});
			},

			clearCart: () => {
				set({ items: [] });
			},

			setOpen: (isOpen) => {
				set({ isOpen });
			},
		}),
		{
			name: "cart-storage",
			partialize: (state) => ({ items: state.items }), // Only persist items, not isOpen
		}
	)
);

// Selectors for computed values
export const selectTotalItems = (state: CartStore) =>
	state.items.reduce((acc, item) => acc + item.quantity, 0);

export const selectSubtotal = (state: CartStore) =>
	state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

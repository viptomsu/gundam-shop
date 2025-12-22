import api from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cancelMyOrder } from "@/app/actions/order";
import type {
	Order,
	OrderItem,
	ProductVariant,
	Product,
	OrderStatus,
	PaymentMethod,
	PaymentStatus,
} from "@prisma/client";

// Type for order item with variant and product details
export type OrderItemWithDetails = OrderItem & {
	variant: Pick<ProductVariant, "id" | "name" | "image"> & {
		product: Pick<Product, "name" | "slug" | "images">;
	};
};

// Type for order with items
export type OrderWithItems = Order & {
	orderItems: OrderItemWithDetails[];
};

export function useOrders() {
	return useQuery<OrderWithItems[]>({
		queryKey: ["my-orders"],
		queryFn: async () => {
			const res = await api.get("/me/orders");
			return res.data.orders;
		},
	});
}

export function useCancelOrder() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (orderId: string) => {
			const result = await cancelMyOrder(orderId);
			if (!result.success) {
				throw new Error(result.message || "Failed to cancel order");
			}
			return result;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["my-orders"] });
			toast.success("Order cancelled successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to cancel order");
		},
	});
}

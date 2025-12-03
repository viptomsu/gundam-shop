"use client";

import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useModal } from "@/hooks/use-modal-store";
import { ModalIds } from "@/types/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	strategy: z.enum(["fixed", "percentage"]),
	value: z.coerce.number().min(0),
	startDate: z.date().optional(),
	endDate: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BulkSaleModalProps {
	onConfirm: (values: FormValues) => void;
}

export const BulkSaleModal = () => {
	const { isOpen, hide, args } = useModal(ModalIds.BULK_SALE_MODAL);
	const modalArgs = args as BulkSaleModalProps;

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema) as any,
		defaultValues: {
			strategy: "percentage",
			value: 0,
		},
	});

	const onSubmit = (values: FormValues) => {
		if (modalArgs?.onConfirm) {
			modalArgs.onConfirm(values);
		}
		hide();
		form.reset();
	};

	const handleClose = () => {
		hide();
		form.reset();
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Bulk Apply Sale</DialogTitle>
					<DialogDescription>
						Apply a sale configuration to all variants.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="strategy"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Strategy</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a strategy" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="percentage">
												Percentage Discount (%)
											</SelectItem>
											<SelectItem value="fixed">Fixed Amount</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="value"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{form.watch("strategy") === "percentage"
											? "Discount Percentage (%)"
											: "Sale Price (Fixed)"}
									</FormLabel>
									<FormControl>
										<Input type="number" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="startDate"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Start Date</FormLabel>
										<DateTimePicker
											date={field.value}
											setDate={field.onChange}
											defaultTime={{ hours: 0, minutes: 0, seconds: 0 }}
										/>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="endDate"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>End Date</FormLabel>
										<DateTimePicker
											date={field.value}
											setDate={field.onChange}
											defaultTime={{ hours: 23, minutes: 59, seconds: 59 }}
										/>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<Button type="button" variant="outline" onClick={handleClose}>
								Cancel
							</Button>
							<Button type="submit">Apply</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

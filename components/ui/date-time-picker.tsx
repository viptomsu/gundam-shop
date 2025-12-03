"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateTimePickerProps {
	date?: Date;
	setDate: (date?: Date) => void;
	defaultTime?: {
		hours: number;
		minutes: number;
		seconds: number;
	};
}

export function DateTimePicker({
	date,
	setDate,
	defaultTime = { hours: 0, minutes: 0, seconds: 0 },
}: DateTimePickerProps) {
	const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
		date
	);
	const [time, setTime] = React.useState<{
		hours: string;
		minutes: string;
		seconds: string;
	}>({
		hours: date ? date.getHours().toString().padStart(2, "0") : "",
		minutes: date ? date.getMinutes().toString().padStart(2, "0") : "",
		seconds: date ? date.getSeconds().toString().padStart(2, "0") : "",
	});

	// Sync internal state with prop
	React.useEffect(() => {
		setSelectedDate(date);
		if (date) {
			setTime({
				hours: date.getHours().toString().padStart(2, "0"),
				minutes: date.getMinutes().toString().padStart(2, "0"),
				seconds: date.getSeconds().toString().padStart(2, "0"),
			});
		}
	}, [date]);

	const handleDateSelect = (newDate: Date | undefined) => {
		if (!newDate) {
			setSelectedDate(undefined);
			setDate(undefined);
			return;
		}

		// Apply default time if no time is currently set, otherwise keep current time
		const newDateTime = new Date(newDate);
		if (!selectedDate) {
			newDateTime.setHours(defaultTime.hours);
			newDateTime.setMinutes(defaultTime.minutes);
			newDateTime.setSeconds(defaultTime.seconds);
			setTime({
				hours: defaultTime.hours.toString().padStart(2, "0"),
				minutes: defaultTime.minutes.toString().padStart(2, "0"),
				seconds: defaultTime.seconds.toString().padStart(2, "0"),
			});
		} else {
			newDateTime.setHours(parseInt(time.hours) || 0);
			newDateTime.setMinutes(parseInt(time.minutes) || 0);
			newDateTime.setSeconds(parseInt(time.seconds) || 0);
		}

		setSelectedDate(newDateTime);
		setDate(newDateTime);
	};

	const handleTimeChange = (
		field: "hours" | "minutes" | "seconds",
		value: string
	) => {
		if (value.length > 2) return; // Prevent more than 2 digits
		const intVal = parseInt(value);
		if (value !== "" && isNaN(intVal)) return; // Prevent non-numeric

		// Validate limits
		if (field === "hours" && intVal > 23) return;
		if (field === "minutes" && intVal > 59) return;
		if (field === "seconds" && intVal > 59) return;

		const newTime = { ...time, [field]: value };
		setTime(newTime);

		if (selectedDate && value !== "") {
			const newDateTime = new Date(selectedDate);
			const hours = parseInt(newTime.hours) || 0;
			const minutes = parseInt(newTime.minutes) || 0;
			const seconds = parseInt(newTime.seconds) || 0;

			if (
				hours >= 0 &&
				hours <= 23 &&
				minutes >= 0 &&
				minutes <= 59 &&
				seconds >= 0 &&
				seconds <= 59
			) {
				newDateTime.setHours(hours);
				newDateTime.setMinutes(minutes);
				newDateTime.setSeconds(seconds);
				setDate(newDateTime);
			}
		}
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-full justify-start text-left font-normal",
						!date && "text-muted-foreground"
					)}>
					<CalendarIcon className="h-4 w-4" />
					{date ? (
						format(date, "yyyy-MM-dd HH:mm:ss")
					) : (
						<span>Pick a date</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={selectedDate}
					onSelect={handleDateSelect}
					initialFocus
				/>
				<div className="p-3 border-t border-border">
					<div className="flex items-center gap-2">
						<Clock className="h-4 w-4 text-muted-foreground" />
						<Label className="text-xs uppercase text-muted-foreground">
							Time
						</Label>
					</div>
					<div className="flex items-center gap-1 mt-2">
						<Input
							type="text"
							inputMode="numeric"
							className="w-12 text-center p-1 h-8"
							placeholder="HH"
							value={time.hours}
							onChange={(e) => handleTimeChange("hours", e.target.value)}
							onFocus={(e) => e.target.select()}
						/>
						<span className="text-muted-foreground">:</span>
						<Input
							type="text"
							inputMode="numeric"
							className="w-12 text-center p-1 h-8"
							placeholder="MM"
							value={time.minutes}
							onChange={(e) => handleTimeChange("minutes", e.target.value)}
							onFocus={(e) => e.target.select()}
						/>
						<span className="text-muted-foreground">:</span>
						<Input
							type="text"
							inputMode="numeric"
							className="w-12 text-center p-1 h-8"
							placeholder="SS"
							value={time.seconds}
							onChange={(e) => handleTimeChange("seconds", e.target.value)}
							onFocus={(e) => e.target.select()}
						/>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}

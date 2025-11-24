import { isAxiosError } from "axios";

export function getErrorMessage(error: unknown): string {
	if (isAxiosError(error)) {
		return (
			error.response?.data?.message ||
			error.message ||
			"An unexpected error occurred"
		);
	}
	if (error instanceof Error) {
		return error.message;
	}
	if (typeof error === "string") {
		return error;
	}
	return "An unexpected error occurred";
}

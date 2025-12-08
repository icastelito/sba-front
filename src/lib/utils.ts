// ==================== FORMATAÇÃO ====================

export function formatDate(date: string | null | undefined): string {
	if (!date) return "-";
	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(new Date(date));
}

export function formatDateTime(date: string | null | undefined): string {
	if (!date) return "-";
	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date));
}

export function formatCurrency(value: number): string {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value);
}

// ==================== VALIDAÇÃO ====================

export function isOverdue(dueDate: string | null | undefined): boolean {
	if (!dueDate) return false;
	const due = new Date(dueDate);
	due.setHours(23, 59, 59, 999);
	return due < new Date();
}

export function isDueToday(dueDate: string | null | undefined): boolean {
	if (!dueDate) return false;
	const due = new Date(dueDate);
	const today = new Date();
	return (
		due.getDate() === today.getDate() &&
		due.getMonth() === today.getMonth() &&
		due.getFullYear() === today.getFullYear()
	);
}

// ==================== DATE HELPERS ====================

export function addDays(date: Date, days: number): Date {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

export function toISODateString(date: Date): string {
	return date.toISOString().split("T")[0];
}

export function toDatetimeLocal(date: Date): string {
	const pad = (n: number) => n.toString().padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
		date.getMinutes()
	)}`;
}

// ==================== QUERY PARAMS ====================

export function buildQueryParams(filters: Record<string, unknown>): string {
	const params = new URLSearchParams();

	Object.entries(filters).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== "") {
			params.append(key, String(value));
		}
	});

	return params.toString();
}

// ==================== DEBOUNCE ====================

export function debounce<T extends (...args: Parameters<T>) => void>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	return (...args: Parameters<T>) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => {
			func(...args);
		}, wait);
	};
}

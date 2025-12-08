// ==================== ENUMS ====================

export const TaskStatus = {
	ALL: "ALL",
	PENDING: "PENDING",
	COMPLETED: "COMPLETED",
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

// ==================== PAGINATION ====================

export interface CursorPagination {
	nextCursor?: string;
	hasMore: boolean;
	limit: number;
}

export interface PaginatedResponse<T> {
	success: boolean;
	data: T[];
	pagination: CursorPagination;
}

export interface ApiResponse<T> {
	success: boolean;
	message?: string;
	data: T;
}

// ==================== TEMPLATE ====================

export interface Template {
	id: string;
	title: string;
	description?: string;
	defaultDueDays?: number;
	tags: string[];
	createdAt: string;
	updatedAt: string;
}

export interface CreateTemplateDto {
	title: string;
	description?: string;
	defaultDueDays?: number;
	tags?: string[];
}

export interface UpdateTemplateDto {
	title?: string;
	description?: string;
	defaultDueDays?: number;
	tags?: string[];
}

export interface TemplateFilters {
	search?: string;
	tag?: string;
	page?: number;
	limit?: number;
	sortBy?: "title" | "createdAt" | "updatedAt";
	sortOrder?: "asc" | "desc";
}

// ==================== TODO ====================

export interface Todo {
	id: string;
	title: string;
	description?: string;
	templateId?: string;
	dueDate?: string;
	completedAt?: string;
	completed: boolean;
	assignedTo?: string;
	requesterId?: number;
	tags: string[];
	version: number;
	createdAt: string;
	updatedAt: string;
	template?: {
		id: string;
		title: string;
	};
	requester?: {
		id: number;
		name: string;
	};
}

export interface CreateTodoDto {
	title?: string;
	description?: string;
	templateId?: string;
	dueDate?: string;
	assignedTo?: string;
	requesterId?: number;
	tags?: string[];
}

export interface UpdateTodoDto {
	title?: string;
	description?: string;
	dueDate?: string;
	assignedTo?: string;
	tags?: string[];
	version: number;
}

export interface CompleteTodoDto {
	completed: boolean;
	completedAt?: string;
}

export interface TodoFilters {
	search?: string;
	status?: TaskStatus;
	completed?: boolean;
	requesterId?: number;
	tag?: string;
	dueDateFrom?: string;
	dueDateTo?: string;
	overdue?: boolean;
	page?: number;
	limit?: number;
	sortBy?: "title" | "dueDate" | "createdAt" | "updatedAt";
	sortOrder?: "asc" | "desc";
}

export interface TodoStats {
	total: number;
	completed: number;
	pending: number;
	overdue: number;
	dueToday: number;
	completionRate: number;
}

// ==================== PRODUCT ====================

export const SortOrder = {
	ASC: "asc",
	DESC: "desc",
} as const;
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

export interface Product {
	id: string;
	name: string;
	description: string | null;
	price: number;
	image: string | null;
	imageType: "local" | "external" | null;
	link: string | null;
	badge: string | null;
	sku: string | null;
	category: string | null;
	isActive: boolean;
	isPublic: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateProductDto {
	name: string;
	description?: string;
	price: number;
	imageUrl?: string;
	link?: string;
	badge?: string;
	sku?: string;
	category?: string;
	isPublic?: boolean;
}

export interface UpdateProductDto {
	name?: string;
	description?: string;
	price?: number;
	imageUrl?: string;
	link?: string;
	badge?: string;
	sku?: string;
	category?: string;
	isActive?: boolean;
	isPublic?: boolean;
	removeImage?: boolean;
}

export interface ProductFilters {
	search?: string;
	category?: string;
	badge?: string;
	isActive?: boolean;
	isPublic?: boolean;
	minPrice?: number;
	maxPrice?: number;
	page?: number;
	limit?: number;
	sortBy?: "name" | "price" | "createdAt" | "updatedAt";
	sortOrder?: SortOrder;
}

export interface PaginationMeta {
	total: number;
	page: number;
	limit: number;
	totalPages: number;
	hasMore: boolean;
}

export interface OffsetPaginatedResponse<T> {
	success: boolean;
	data: T[];
	meta: PaginationMeta;
}

// ==================== REQUESTER ====================

export interface Requester {
	id: number;
	name: string;
	email?: string;
	phone?: string;
	department?: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

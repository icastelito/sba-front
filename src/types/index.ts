// ==================== AUTH ====================

export interface User {
	id: string;
	email: string;
	username: string;
	name: string;
	nickname: string | null;
	isActive: boolean;
	emailVerified: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface TokenResponse {
	accessToken: string;
	refreshToken: string;
	expiresIn: number;
	tokenType: "Bearer";
}

export interface RegisterDto {
	email: string;
	username: string;
	name: string;
	nickname?: string;
	password: string;
}

export interface LoginDto {
	login: string;
	password: string;
}

export interface UpdateProfileDto {
	name?: string;
	nickname?: string;
	username?: string;
}

export interface ChangePasswordDto {
	currentPassword: string;
	newPassword: string;
}

export interface AuthState {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

// ==================== SHOPEE ====================

export const ShopeeStoreStatus = {
	ACTIVE: "ACTIVE",
	TOKEN_EXPIRED: "TOKEN_EXPIRED",
	DISCONNECTED: "DISCONNECTED",
	ERROR: "ERROR",
} as const;
export type ShopeeStoreStatus = (typeof ShopeeStoreStatus)[keyof typeof ShopeeStoreStatus];

export interface ShopeeStore {
	id: string;
	shopId: string;
	shopName: string | null;
	region: string;
	status: ShopeeStoreStatus;
	tokenExpiresAt: string;
	lastSyncAt: string | null;
	errorMessage: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface ShopeeConnectResponse {
	success: boolean;
	message: string;
	data: {
		authUrl: string;
		instructions: string;
	};
}

export interface ShopeeStoresResponse {
	success: boolean;
	data: ShopeeStore[];
	meta: {
		total: number;
	};
}

export interface ShopeeConnectedResponse {
	success: boolean;
	connected: boolean;
	data: {
		totalStores: number;
		activeStores: number;
		stores: {
			shopId: string;
			shopName: string | null;
			status: ShopeeStoreStatus;
			isActive: boolean;
		}[];
	};
}

export interface ShopeeStoreStatusResponse {
	success: boolean;
	connected: boolean;
	data: {
		status: ShopeeStoreStatus;
		isActive: boolean;
		isExpired: boolean;
		tokenExpiresAt: string;
		shopName: string | null;
		lastSyncAt: string | null;
		errorMessage: string | null;
	};
}

export interface ShopeeSyncProductsResult {
	created: number;
	updated: number;
	deactivated: number;
	errors: string[];
}

export interface ShopeeSyncProductsResponse {
	success: boolean;
	message: string;
	data: ShopeeSyncProductsResult;
}

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

// ==================== CLIENT ====================

export interface Client {
	id: string;
	name: string;
	email?: string;
	phone?: string;
	document?: string;
	address?: string;
	city?: string;
	state?: string;
	zipCode?: string;
	notes?: string;
	isActive: boolean;
	ordersCount?: number;
	recentOrders?: SalesOrderSummary[];
	createdAt: string;
	updatedAt: string;
}

export interface CreateClientDto {
	name: string;
	email?: string;
	phone?: string;
	document?: string;
	address?: string;
	city?: string;
	state?: string;
	zipCode?: string;
	notes?: string;
	isActive?: boolean;
}

export interface UpdateClientDto {
	name?: string;
	email?: string;
	phone?: string;
	document?: string;
	address?: string;
	city?: string;
	state?: string;
	zipCode?: string;
	notes?: string;
	isActive?: boolean;
}

export interface ClientFilters {
	search?: string;
	city?: string;
	state?: string;
	isActive?: boolean;
	page?: number;
	limit?: number;
	sortBy?: "name" | "email" | "createdAt" | "updatedAt";
	sortOrder?: SortOrder;
}

// ==================== SALES ORDER ====================

export const OrderStatus = {
	PENDING: "PENDING",
	CONFIRMED: "CONFIRMED",
	PAID: "PAID",
	PROCESSING: "PROCESSING",
	SHIPPED: "SHIPPED",
	DELIVERED: "DELIVERED",
	CANCELED: "CANCELED",
	REFUNDED: "REFUNDED",
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface SalesOrderItem {
	id: string;
	productId: string;
	productName: string;
	productSku?: string;
	quantity: number;
	unitPrice: number;
	discount: number;
	total: number;
	product?: {
		id: string;
		name: string;
		image?: string;
		imageType?: string;
	};
}

export interface SalesOrderSummary {
	id: string;
	orderNumber: number;
	status: OrderStatus;
	total: number;
	createdAt: string;
}

export interface SalesOrder {
	id: string;
	orderNumber: number;
	status: OrderStatus;
	subtotal: number;
	discount: number;
	shipping: number;
	total: number;
	notes?: string;
	paymentMethod?: string;
	shipByDate?: string;
	paidAt?: string;
	shippedAt?: string;
	deliveredAt?: string;
	canceledAt?: string;
	client: Client;
	items: SalesOrderItem[];
	createdAt: string;
	updatedAt: string;
}

export interface CreateSalesOrderItemDto {
	productId: string;
	quantity: number;
	unitPrice?: number;
	discount?: number;
}

export interface CreateSalesOrderDto {
	clientId: string;
	items: CreateSalesOrderItemDto[];
	discount?: number;
	shipping?: number;
	notes?: string;
	paymentMethod?: string;
	shipByDate?: string;
}

export interface UpdateSalesOrderDto {
	discount?: number;
	shipping?: number;
	notes?: string;
	paymentMethod?: string;
	shipByDate?: string;
	items?: CreateSalesOrderItemDto[];
}

export interface SalesOrderFilters {
	search?: string;
	clientId?: string;
	status?: OrderStatus;
	dateFrom?: string;
	dateTo?: string;
	shipByDateFrom?: string;
	shipByDateTo?: string;
	totalMin?: number;
	totalMax?: number;
	page?: number;
	limit?: number;
	sortBy?: "orderNumber" | "total" | "status" | "createdAt" | "updatedAt" | "shipByDate";
	sortOrder?: SortOrder;
}

export interface SalesOrderStats {
	totalOrders: number;
	pendingOrders: number;
	paidOrders: number;
	canceledOrders: number;
	totalRevenue: number;
	todayOrders: number;
}

// ==================== TAG ====================

export interface Tag {
	id: string;
	name: string;
	color: string | null;
	description: string | null;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface TagSimple {
	id: string;
	name: string;
	color: string | null;
}

export interface CreateTagDto {
	name: string;
	color?: string;
	description?: string;
	isActive?: boolean;
}

export interface UpdateTagDto {
	name?: string;
	color?: string;
	description?: string;
	isActive?: boolean;
}

export interface TagFilters {
	search?: string;
	isActive?: boolean;
	page?: number;
	limit?: number;
	sortBy?: "name" | "createdAt" | "updatedAt";
	sortOrder?: SortOrder;
}

export interface TagStats {
	total: number;
	active: number;
	inactive: number;
	mostUsed: Array<{
		name: string;
		usageCount: number;
	}>;
}

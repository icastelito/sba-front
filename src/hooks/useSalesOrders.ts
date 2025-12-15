import { useState, useCallback } from "react";
import { api } from "../lib/api";
import type {
	SalesOrder,
	CreateSalesOrderDto,
	UpdateSalesOrderDto,
	SalesOrderFilters,
	SalesOrderStats,
	OffsetPaginatedResponse,
	PaginationMeta,
	ApiResponse,
	OrderStatus,
} from "../types";
import { buildQueryParams } from "../lib/utils";

export function useSalesOrders() {
	const [orders, setOrders] = useState<SalesOrder[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [pagination, setPagination] = useState<PaginationMeta | null>(null);
	const [stats, setStats] = useState<SalesOrderStats | null>(null);

	const fetchOrders = useCallback(async (filters: SalesOrderFilters = {}) => {
		setLoading(true);
		setError(null);
		try {
			const queryString = buildQueryParams(filters as Record<string, unknown>);
			const response = await api.get<OffsetPaginatedResponse<SalesOrder>>(
				`/sales-orders${queryString ? `?${queryString}` : ""}`
			);
			setOrders(response.data);
			setPagination(response.meta);
			return response;
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erro ao carregar pedidos";
			setError(message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const getOrder = useCallback(async (id: string) => {
		const response = await api.get<ApiResponse<SalesOrder>>(`/sales-orders/${id}`);
		return response.data;
	}, []);

	const getOrderByNumber = useCallback(async (orderNumber: number) => {
		const response = await api.get<ApiResponse<SalesOrder>>(`/sales-orders/by-number/${orderNumber}`);
		return response.data;
	}, []);

	const fetchStats = useCallback(async () => {
		const response = await api.get<ApiResponse<SalesOrderStats>>("/sales-orders/stats");
		setStats(response.data);
		return response.data;
	}, []);

	const createOrder = useCallback(async (data: CreateSalesOrderDto) => {
		const response = await api.post<ApiResponse<SalesOrder>>("/sales-orders", data);
		return response.data;
	}, []);

	const updateOrder = useCallback(async (id: string, data: UpdateSalesOrderDto) => {
		const response = await api.put<ApiResponse<SalesOrder>>(`/sales-orders/${id}`, data);
		return response.data;
	}, []);

	const updateStatus = useCallback(async (id: string, status: OrderStatus, reason?: string) => {
		const response = await api.patch<ApiResponse<SalesOrder>>(`/sales-orders/${id}/status`, {
			status,
			reason,
		});
		setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: response.data.status } : o)));
		return response.data;
	}, []);

	const deleteOrder = useCallback(async (id: string) => {
		await api.delete(`/sales-orders/${id}`);
		setOrders((prev) => prev.filter((o) => o.id !== id));
	}, []);

	return {
		orders,
		loading,
		error,
		pagination,
		stats,
		fetchOrders,
		getOrder,
		getOrderByNumber,
		fetchStats,
		createOrder,
		updateOrder,
		updateStatus,
		deleteOrder,
	};
}

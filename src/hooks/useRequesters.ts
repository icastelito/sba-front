import { useState, useCallback } from "react";
import { api } from "../lib/api";
import { buildQueryParams } from "../lib/utils";
import type { Requester, OffsetPaginatedResponse, PaginationMeta } from "../types";

export interface RequesterFilters {
	search?: string;
	isActive?: boolean;
	department?: string;
	page?: number;
	limit?: number;
}

export interface CreateRequesterDto {
	name: string;
	email?: string;
	phone?: string;
	department?: string;
}

export interface UpdateRequesterDto {
	name?: string;
	email?: string;
	phone?: string;
	department?: string;
}

export function useRequesters() {
	const [requesters, setRequesters] = useState<Requester[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [pagination, setPagination] = useState<PaginationMeta | null>(null);

	const fetchRequesters = useCallback(async (filters: RequesterFilters = {}) => {
		setLoading(true);
		setError(null);
		try {
			const query = buildQueryParams(filters as Record<string, unknown>);
			const response = await api.get<OffsetPaginatedResponse<Requester>>(`/requesters?${query}`);

			setRequesters(response.data);
			setPagination(response.meta);
			return response;
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erro ao carregar demandantes";
			setError(message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const getRequester = useCallback(async (id: number) => {
		const response = await api.get<{ data: Requester }>(`/requesters/${id}`);
		return response.data;
	}, []);

	const createRequester = useCallback(async (data: CreateRequesterDto) => {
		const response = await api.post<{ data: Requester }>("/requesters", data);
		return response.data;
	}, []);

	const updateRequester = useCallback(async (id: number, data: UpdateRequesterDto) => {
		const response = await api.patch<{ data: Requester }>(`/requesters/${id}`, data);
		return response.data;
	}, []);

	const toggleActive = useCallback(async (id: number) => {
		const response = await api.patch<{ data: Requester }>(`/requesters/${id}/toggle-active`, {});
		setRequesters((prev) => prev.map((r) => (r.id === id ? { ...r, isActive: response.data.isActive } : r)));
		return response.data;
	}, []);

	const deleteRequester = useCallback(async (id: number) => {
		await api.delete(`/requesters/${id}`);
		setRequesters((prev) => prev.filter((r) => r.id !== id));
	}, []);

	return {
		requesters,
		loading,
		error,
		pagination,
		fetchRequesters,
		getRequester,
		createRequester,
		updateRequester,
		toggleActive,
		deleteRequester,
	};
}

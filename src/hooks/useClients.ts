import { useState, useCallback } from "react";
import { api } from "../lib/api";
import type {
	Client,
	CreateClientDto,
	UpdateClientDto,
	ClientFilters,
	OffsetPaginatedResponse,
	PaginationMeta,
	ApiResponse,
} from "../types";
import { buildQueryParams } from "../lib/utils";

export function useClients() {
	const [clients, setClients] = useState<Client[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [pagination, setPagination] = useState<PaginationMeta | null>(null);

	const fetchClients = useCallback(async (filters: ClientFilters = {}) => {
		setLoading(true);
		setError(null);
		try {
			const queryString = buildQueryParams(filters as Record<string, unknown>);
			const response = await api.get<OffsetPaginatedResponse<Client>>(
				`/clients${queryString ? `?${queryString}` : ""}`
			);
			setClients(response.data);
			setPagination(response.meta);
			return response;
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erro ao carregar clientes";
			setError(message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const getClient = useCallback(async (id: string) => {
		const response = await api.get<ApiResponse<Client>>(`/clients/${id}`);
		return response.data;
	}, []);

	const fetchCities = useCallback(async () => {
		const response = await api.get<ApiResponse<string[]>>("/clients/cities");
		return response.data;
	}, []);

	const fetchStates = useCallback(async () => {
		const response = await api.get<ApiResponse<string[]>>("/clients/states");
		return response.data;
	}, []);

	const createClient = useCallback(async (data: CreateClientDto) => {
		const response = await api.post<ApiResponse<Client>>("/clients", data);
		return response.data;
	}, []);

	const updateClient = useCallback(async (id: string, data: UpdateClientDto) => {
		const response = await api.put<ApiResponse<Client>>(`/clients/${id}`, data);
		return response.data;
	}, []);

	const deleteClient = useCallback(async (id: string) => {
		await api.delete(`/clients/${id}`);
		setClients((prev) => prev.filter((c) => c.id !== id));
	}, []);

	const toggleActive = useCallback(
		async (id: string) => {
			const client = clients.find((c) => c.id === id);
			if (!client) return;

			const response = await api.put<ApiResponse<Client>>(`/clients/${id}`, {
				isActive: !client.isActive,
			});
			setClients((prev) => prev.map((c) => (c.id === id ? { ...c, isActive: response.data.isActive } : c)));
			return response.data;
		},
		[clients]
	);

	return {
		clients,
		loading,
		error,
		pagination,
		fetchClients,
		getClient,
		fetchCities,
		fetchStates,
		createClient,
		updateClient,
		deleteClient,
		toggleActive,
	};
}

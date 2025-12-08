import { useState, useCallback } from "react";
import { api } from "../lib/api";
import { buildQueryParams } from "../lib/utils";
import type {
	Template,
	CreateTemplateDto,
	UpdateTemplateDto,
	TemplateFilters,
	OffsetPaginatedResponse,
	PaginationMeta,
	ApiResponse,
} from "../types";

export function useTemplates() {
	const [templates, setTemplates] = useState<Template[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [pagination, setPagination] = useState<PaginationMeta | null>(null);

	const fetchTemplates = useCallback(async (filters: TemplateFilters = {}) => {
		setLoading(true);
		setError(null);
		try {
			const query = buildQueryParams(filters as Record<string, unknown>);
			const response = await api.get<OffsetPaginatedResponse<Template>>(`/templates?${query}`);

			setTemplates(response.data);
			setPagination(response.meta);
			return response;
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erro ao carregar templates";
			setError(message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const getTemplate = useCallback(async (id: string) => {
		const response = await api.get<ApiResponse<Template>>(`/templates/${id}`);
		return response.data;
	}, []);

	const createTemplate = useCallback(async (data: CreateTemplateDto) => {
		const response = await api.post<ApiResponse<Template>>("/templates", data);
		return response.data;
	}, []);

	const updateTemplate = useCallback(async (id: string, data: UpdateTemplateDto) => {
		const response = await api.patch<ApiResponse<Template>>(`/templates/${id}`, data);
		return response.data;
	}, []);

	const deleteTemplate = useCallback(async (id: string) => {
		await api.delete(`/templates/${id}`);
	}, []);

	return {
		templates,
		loading,
		error,
		pagination,
		fetchTemplates,
		getTemplate,
		createTemplate,
		updateTemplate,
		deleteTemplate,
	};
}

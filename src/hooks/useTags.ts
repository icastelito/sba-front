import { useState, useCallback } from "react";
import { api } from "../lib/api";
import { buildQueryParams } from "../lib/utils";
import type {
	Tag,
	TagSimple,
	CreateTagDto,
	UpdateTagDto,
	TagFilters,
	TagStats,
	OffsetPaginatedResponse,
	PaginationMeta,
} from "../types";

export function useTags() {
	const [tags, setTags] = useState<Tag[]>([]);
	const [activeTags, setActiveTags] = useState<TagSimple[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [pagination, setPagination] = useState<PaginationMeta | null>(null);
	const [stats, setStats] = useState<TagStats | null>(null);

	const fetchTags = useCallback(async (filters: TagFilters = {}) => {
		setLoading(true);
		setError(null);
		try {
			const query = buildQueryParams(filters as Record<string, unknown>);
			const response = await api.get<OffsetPaginatedResponse<Tag>>(`/tags?${query}`);

			setTags(response.data);
			setPagination(response.meta);
			return response;
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erro ao carregar tags";
			setError(message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchActiveTags = useCallback(async () => {
		try {
			const response = await api.get<TagSimple[]>("/tags/active");
			setActiveTags(response);
			return response;
		} catch (err) {
			console.error("Erro ao carregar tags ativas:", err);
			return [];
		}
	}, []);

	const fetchStats = useCallback(async () => {
		try {
			const response = await api.get<TagStats>("/tags/stats");
			setStats(response);
			return response;
		} catch (err) {
			console.error("Erro ao carregar estatísticas:", err);
			return null;
		}
	}, []);

	const getTag = useCallback(async (id: string) => {
		const response = await api.get<Tag>(`/tags/${id}`);
		return response;
	}, []);

	const createTag = useCallback(async (data: CreateTagDto) => {
		const response = await api.post<Tag>("/tags", data);
		return response;
	}, []);

	const updateTag = useCallback(async (id: string, data: UpdateTagDto) => {
		const response = await api.patch<Tag>(`/tags/${id}`, data);
		return response;
	}, []);

	const deleteTag = useCallback(async (id: string) => {
		await api.delete(`/tags/${id}`);
	}, []);

	const validateTags = useCallback(async (tagNames: string[]) => {
		const response = await api.post<{ valid: boolean; tags: string[] }>("/tags/validate", { tags: tagNames });
		return response;
	}, []);

	return {
		tags,
		activeTags,
		loading,
		error,
		pagination,
		stats,
		fetchTags,
		fetchActiveTags,
		fetchStats,
		getTag,
		createTag,
		updateTag,
		deleteTag,
		validateTags,
	};
}

import { useState, useCallback } from "react";
import { api } from "../lib/api";
import type {
	Product,
	CreateProductDto,
	UpdateProductDto,
	ProductFilters,
	OffsetPaginatedResponse,
	PaginationMeta,
} from "../types";
import { buildQueryParams } from "../lib/utils";

export function useProducts() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [pagination, setPagination] = useState<PaginationMeta | null>(null);

	const fetchProducts = useCallback(async (filters: ProductFilters = {}) => {
		setLoading(true);
		setError(null);
		try {
			const queryString = buildQueryParams(filters as Record<string, unknown>);
			const response = await api.get<OffsetPaginatedResponse<Product>>(
				`/products${queryString ? `?${queryString}` : ""}`
			);
			setProducts(response.data);
			setPagination(response.meta);
			return response;
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erro ao carregar produtos";
			setError(message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const getProduct = useCallback(async (id: string) => {
		const response = await api.get<{ data: Product }>(`/products/${id}`);
		return response.data;
	}, []);

	const fetchCategories = useCallback(async () => {
		const response = await api.get<{ data: string[] }>("/products/categories");
		return response.data;
	}, []);

	const fetchBadges = useCallback(async () => {
		const response = await api.get<{ data: string[] }>("/products/badges");
		return response.data;
	}, []);

	const createProduct = useCallback(async (data: CreateProductDto, imageFile?: File) => {
		const formData = new FormData();

		formData.append("name", data.name);
		formData.append("price", String(data.price));
		if (data.description) formData.append("description", data.description);
		if (data.imageUrl) formData.append("imageUrl", data.imageUrl);
		if (data.link) formData.append("link", data.link);
		if (data.badge) formData.append("badge", data.badge);
		if (data.sku) formData.append("sku", data.sku);
		if (data.category) formData.append("category", data.category);
		if (data.isPublic !== undefined) formData.append("isPublic", String(data.isPublic));

		if (imageFile) {
			formData.append("image", imageFile);
		}

		const response = await api.postFormData<{ data: Product }>("/products", formData);
		return response.data;
	}, []);

	const updateProduct = useCallback(async (id: string, data: UpdateProductDto, imageFile?: File) => {
		const formData = new FormData();

		if (data.name) formData.append("name", data.name);
		if (data.price !== undefined) formData.append("price", String(data.price));
		if (data.description !== undefined) formData.append("description", data.description || "");
		if (data.imageUrl) formData.append("imageUrl", data.imageUrl);
		if (data.link !== undefined) formData.append("link", data.link || "");
		if (data.badge !== undefined) formData.append("badge", data.badge || "");
		if (data.sku !== undefined) formData.append("sku", data.sku || "");
		if (data.category !== undefined) formData.append("category", data.category || "");
		if (data.isActive !== undefined) formData.append("isActive", String(data.isActive));
		if (data.isPublic !== undefined) formData.append("isPublic", String(data.isPublic));
		if (data.removeImage) formData.append("removeImage", "true");

		if (imageFile) {
			formData.append("image", imageFile);
		}

		const response = await api.patchFormData<{ data: Product }>(`/products/${id}`, formData);
		return response.data;
	}, []);

	const toggleActive = useCallback(async (id: string) => {
		const response = await api.patch<{ data: Product }>(`/products/${id}/toggle-active`, {});
		setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, isActive: response.data.isActive } : p)));
		return response.data;
	}, []);

	const togglePublic = useCallback(async (id: string) => {
		const response = await api.patch<{ data: Product }>(`/products/${id}/toggle-public`, {});
		setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, isPublic: response.data.isPublic } : p)));
		return response.data;
	}, []);

	const deleteProduct = useCallback(async (id: string) => {
		await api.delete(`/products/${id}`);
		setProducts((prev) => prev.filter((p) => p.id !== id));
	}, []);

	const deleteProducts = useCallback(async (ids: string[]) => {
		await api.delete("/products", { ids });
		setProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
	}, []);

	return {
		products,
		loading,
		error,
		pagination,
		fetchProducts,
		getProduct,
		fetchCategories,
		fetchBadges,
		createProduct,
		updateProduct,
		toggleActive,
		togglePublic,
		deleteProduct,
		deleteProducts,
	};
}

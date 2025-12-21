import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import type { Product, ProductFilters } from "../../types";
import { ProductCard } from "./ProductCard";
import { ProductFiltersComponent } from "./ProductFilters";
import { ConfirmDialog, Loading, ErrorMessage, IconPlus, IconProducts, Pagination } from "../ui";

export function ProductList() {
	const navigate = useNavigate();
	const {
		products,
		loading,
		error,
		pagination,
		fetchProducts,
		fetchCategories,
		fetchBadges,
		toggleActive,
		togglePublic,
		deleteProduct,
	} = useProducts();

	const [filters, setFilters] = useState<ProductFilters>({
		page: 1,
		limit: 12,
		sortBy: "createdAt",
		sortOrder: "desc",
	});

	const [categories, setCategories] = useState<string[]>([]);
	const [badges, setBadges] = useState<string[]>([]);
	const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

	// Carregar produtos
	useEffect(() => {
		fetchProducts(filters);
	}, [filters, fetchProducts]);

	// Carregar categorias e badges
	useEffect(() => {
		const loadMeta = async () => {
			try {
				const [cats, bdgs] = await Promise.all([fetchCategories(), fetchBadges()]);
				setCategories(cats || []);
				setBadges(bdgs || []);
			} catch {
				// Ignorar erro
			}
		};
		loadMeta();
	}, [fetchCategories, fetchBadges]);

	const handleFiltersChange = useCallback((newFilters: ProductFilters) => {
		setFilters(newFilters);
	}, []);

	const handleCreate = () => {
		navigate("/produtos/novo");
	};

	const handleEdit = (product: Product) => {
		navigate(`/produtos/${product.id}/editar`);
	};

	const handleToggleActive = async (id: string) => {
		try {
			await toggleActive(id);
		} catch (err) {
			alert(err instanceof Error ? err.message : "Erro ao alterar status");
		}
	};

	const handleTogglePublic = async (id: string) => {
		try {
			await togglePublic(id);
		} catch (err) {
			alert(err instanceof Error ? err.message : "Erro ao alterar visibilidade");
		}
	};

	const handleDeleteConfirm = async () => {
		if (!deleteConfirm) return;
		try {
			await deleteProduct(deleteConfirm.id);
			setDeleteConfirm(null);
		} catch (err) {
			alert(err instanceof Error ? err.message : "Erro ao deletar produto");
		}
	};

	const handlePageChange = (page: number) => {
		setFilters((prev) => ({ ...prev, page }));
	};

	return (
		<div>
			{/* Header */}
			<div className="section-header">
				<h1 className="section-title">
					<IconProducts size={28} />
					Produtos
				</h1>
				<button onClick={handleCreate} className="btn btn-primary">
					<IconPlus size={18} />
					Novo Produto
				</button>
			</div>

			{/* Filtros */}
			<ProductFiltersComponent
				filters={filters}
				categories={categories}
				badges={badges}
				onFiltersChange={handleFiltersChange}
			/>

			{/* Erro */}
			{error && <ErrorMessage message={error} />}

			{/* Loading */}
			{loading && products.length === 0 && <Loading />}

			{/* Grid de produtos */}
			{!loading && products.length === 0 ? (
				<div className="empty-state">
					<IconProducts size={48} className="empty-state-icon" />
					<p className="empty-state-title">Nenhum produto encontrado</p>
					<p className="empty-state-text">
						{filters.search || filters.category || filters.badge
							? "Tente ajustar os filtros"
							: "Crie seu primeiro produto"}
					</p>
				</div>
			) : (
				<div className={`products-grid ${loading ? "loading" : ""}`}>
					{products.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
							onEdit={handleEdit}
							onToggleActive={handleToggleActive}
							onTogglePublic={handleTogglePublic}
							onDelete={(id) => setDeleteConfirm(products.find((p) => p.id === id) || null)}
						/>
					))}
				</div>
			)}

			{/* Paginação */}
			{pagination && <Pagination meta={pagination} onPageChange={handlePageChange} />}

			{/* Confirmação de exclusão */}
			<ConfirmDialog
				isOpen={!!deleteConfirm}
				title="Excluir Produto"
				message={`Tem certeza que deseja excluir "${deleteConfirm?.name}"? Esta ação não pode ser desfeita.`}
				confirmLabel="Excluir"
				onConfirm={handleDeleteConfirm}
				onCancel={() => setDeleteConfirm(null)}
			/>
		</div>
	);
}

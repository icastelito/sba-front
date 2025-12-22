import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import type { Product, ProductFilters } from "../../types";
import { ProductCard } from "./ProductCard";
import { ProductListView } from "./ProductListView";
import { ProductFiltersComponent } from "./ProductFilters";
import { SyncShopeeModal } from "./SyncShopeeModal";
import {
	ConfirmDialog,
	Loading,
	ErrorMessage,
	IconPlus,
	IconProducts,
	IconGrid,
	IconList,
	Pagination,
	IconShopee,
} from "../ui";

type ViewMode = "grid" | "list";

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
	const [viewMode, setViewMode] = useState<ViewMode>("grid");
	const [showSyncModal, setShowSyncModal] = useState(false);

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

	const handleSyncComplete = () => {
		// Recarregar produtos após sincronização
		fetchProducts(filters);
	};

	return (
		<div className="page">
			{/* Header */}
			<div className="page-header">
				<div className="page-title-group">
					<IconProducts size={28} className="page-icon" />
					<h1 className="page-title">Produtos</h1>
				</div>
				<div className="page-header-actions">
					<div className="view-toggle">
						<button
							onClick={() => setViewMode("grid")}
							className={`btn btn-icon ${viewMode === "grid" ? "btn-primary" : "btn-ghost"}`}
							aria-label="Visualização em grid"
							title="Cards"
						>
							<IconGrid size={18} />
						</button>
						<button
							onClick={() => setViewMode("list")}
							className={`btn btn-icon ${viewMode === "list" ? "btn-primary" : "btn-ghost"}`}
							aria-label="Visualização em lista"
							title="Lista"
						>
							<IconList size={18} />
						</button>
					</div>
					<button onClick={() => setShowSyncModal(true)} className="btn btn-secondary">
						<IconShopee size={18} />
						<span>Sincronizar Shopee</span>
					</button>
					<button onClick={handleCreate} className="btn btn-primary">
						<IconPlus size={18} />
						<span>Novo Produto</span>
					</button>
				</div>
			</div>

			{/* Filtros */}
			<ProductFiltersComponent
				filters={filters}
				categories={categories}
				badges={badges}
				onFiltersChange={handleFiltersChange}
			/>

			<div className="product-content">
				{/* Erro */}
				{error && <ErrorMessage message={error} />}

				{/* Loading */}
				{loading && products.length === 0 && <Loading />}

				{/* Grid de produtos */}
				{!loading && products.length === 0 ? (
					<div className="empty-state">
						<IconProducts size={48} className="empty-state-icon" />
						<p className="empty-state-title">Nenhum produto encontrado</p>
						<p className="empty-state-description">
							{filters.search || filters.category || filters.badge
								? "Tente ajustar os filtros"
								: "Crie seu primeiro produto"}
						</p>
					</div>
				) : viewMode === "grid" ? (
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
				) : (
					<ProductListView
						products={products}
						onEdit={handleEdit}
						onToggleActive={handleToggleActive}
						onTogglePublic={handleTogglePublic}
						onDelete={(id) => setDeleteConfirm(products.find((p) => p.id === id) || null)}
					/>
				)}
			</div>

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

			{/* Modal de Sincronização Shopee */}
			<SyncShopeeModal
				isOpen={showSyncModal}
				onClose={() => setShowSyncModal(false)}
				onSyncComplete={handleSyncComplete}
			/>
		</div>
	);
}

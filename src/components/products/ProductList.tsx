import { useState, useEffect, useCallback } from "react";
import { useProducts } from "../../hooks/useProducts";
import type { Product, ProductFilters, CreateProductDto, UpdateProductDto } from "../../types";
import { ProductCard } from "./ProductCard";
import { ProductFiltersComponent } from "./ProductFilters";
import { ProductForm } from "./ProductForm";
import { Modal, ConfirmDialog, Loading, ErrorMessage, IconPlus, IconProducts, Pagination } from "../ui";

export function ProductList() {
	const {
		products,
		loading,
		error,
		pagination,
		fetchProducts,
		fetchCategories,
		fetchBadges,
		createProduct,
		updateProduct,
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

	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);
	const [formLoading, setFormLoading] = useState(false);

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
		setEditingProduct(null);
		setIsFormOpen(true);
	};

	const handleEdit = (product: Product) => {
		setEditingProduct(product);
		setIsFormOpen(true);
	};

	const handleFormSubmit = async (data: CreateProductDto | UpdateProductDto, imageFile?: File) => {
		setFormLoading(true);
		try {
			if (editingProduct) {
				await updateProduct(editingProduct.id, data as UpdateProductDto, imageFile);
			} else {
				await createProduct(data as CreateProductDto, imageFile);
			}
			setIsFormOpen(false);
			setEditingProduct(null);
			// Recarregar categorias e badges caso tenha criado novos
			const [cats, bdgs] = await Promise.all([fetchCategories(), fetchBadges()]);
			setCategories(cats || []);
			setBadges(bdgs || []);
			// Recarregar produtos
			fetchProducts(filters);
		} catch (err) {
			alert(err instanceof Error ? err.message : "Erro ao salvar produto");
		} finally {
			setFormLoading(false);
		}
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

			{/* Modal de formulário */}
			<Modal
				isOpen={isFormOpen}
				onClose={() => {
					setIsFormOpen(false);
					setEditingProduct(null);
				}}
				title={editingProduct ? "Editar Produto" : "Novo Produto"}
				size="large"
			>
				<ProductForm
					product={editingProduct}
					categories={categories}
					badges={badges}
					onSubmit={handleFormSubmit}
					onCancel={() => {
						setIsFormOpen(false);
						setEditingProduct(null);
					}}
					loading={formLoading}
				/>
			</Modal>

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

import { useState, useEffect, useCallback } from "react";
import { useSalesOrders } from "../../hooks/useSalesOrders";
import { useClients } from "../../hooks/useClients";
import { useProducts } from "../../hooks/useProducts";
import type { SalesOrder, SalesOrderFilters, CreateSalesOrderDto, UpdateSalesOrderDto, OrderStatus } from "../../types";
import { SalesOrderCard } from "./SalesOrderCard";
import { SalesOrderFiltersComponent } from "./SalesOrderFilters";
import { SalesOrderForm } from "./SalesOrderForm";
import { SalesOrderDetail } from "./SalesOrderDetail";
import { SalesOrderStatsComponent } from "./SalesOrderStats";
import { Modal, ConfirmDialog, Loading, ErrorMessage, IconPlus, Pagination } from "../ui";
import { IconShoppingCart } from "../ui/Icons";

export function SalesOrderList() {
	const {
		orders,
		loading,
		error,
		pagination,
		stats,
		fetchOrders,
		fetchStats,
		createOrder,
		updateOrder,
		updateStatus,
		deleteOrder,
	} = useSalesOrders();

	const { clients, fetchClients } = useClients();
	const { products, fetchProducts } = useProducts();

	const [filters, setFilters] = useState<SalesOrderFilters>({
		page: 1,
		limit: 12,
		sortBy: "createdAt",
		sortOrder: "desc",
	});

	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingOrder, setEditingOrder] = useState<SalesOrder | null>(null);
	const [viewingOrder, setViewingOrder] = useState<SalesOrder | null>(null);
	const [deleteConfirm, setDeleteConfirm] = useState<SalesOrder | null>(null);
	const [formLoading, setFormLoading] = useState(false);

	// Carregar pedidos
	useEffect(() => {
		fetchOrders(filters);
	}, [filters, fetchOrders]);

	// Carregar stats
	useEffect(() => {
		fetchStats();
	}, [fetchStats]);

	// Carregar clientes e produtos para o formulário
	useEffect(() => {
		fetchClients({ limit: 100, isActive: true });
		fetchProducts({ limit: 100, isActive: true });
	}, [fetchClients, fetchProducts]);

	const handleFiltersChange = useCallback((newFilters: SalesOrderFilters) => {
		setFilters(newFilters);
	}, []);

	const handleCreate = () => {
		setEditingOrder(null);
		setIsFormOpen(true);
	};

	const handleEdit = (order: SalesOrder) => {
		setEditingOrder(order);
		setIsFormOpen(true);
	};

	const handleView = (order: SalesOrder) => {
		setViewingOrder(order);
	};

	const handleFormSubmit = async (data: CreateSalesOrderDto | UpdateSalesOrderDto) => {
		setFormLoading(true);
		try {
			if (editingOrder) {
				await updateOrder(editingOrder.id, data as UpdateSalesOrderDto);
			} else {
				await createOrder(data as CreateSalesOrderDto);
			}
			setIsFormOpen(false);
			setEditingOrder(null);
			// Recarregar pedidos e stats
			fetchOrders(filters);
			fetchStats();
		} catch (err) {
			alert(err instanceof Error ? err.message : "Erro ao salvar pedido");
		} finally {
			setFormLoading(false);
		}
	};

	const handleUpdateStatus = async (id: string, status: OrderStatus) => {
		try {
			await updateStatus(id, status);
			fetchStats();
			// Atualizar o pedido visualizado se for o mesmo
			if (viewingOrder && viewingOrder.id === id) {
				const updatedOrder = orders.find((o) => o.id === id);
				if (updatedOrder) {
					setViewingOrder({ ...updatedOrder, status });
				}
			}
		} catch (err) {
			alert(err instanceof Error ? err.message : "Erro ao atualizar status");
		}
	};

	const handleDeleteConfirm = async () => {
		if (!deleteConfirm) return;
		try {
			await deleteOrder(deleteConfirm.id);
			setDeleteConfirm(null);
			fetchStats();
		} catch (err) {
			alert(err instanceof Error ? err.message : "Erro ao deletar pedido");
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
					<IconShoppingCart size={28} />
					Pedidos de Venda
				</h1>
				<button onClick={handleCreate} className="btn btn-primary">
					<IconPlus size={18} />
					Novo Pedido
				</button>
			</div>

			{/* Stats */}
			{stats && <SalesOrderStatsComponent stats={stats} />}

			{/* Filtros */}
			<SalesOrderFiltersComponent filters={filters} onFiltersChange={handleFiltersChange} />

			{/* Erro */}
			{error && <ErrorMessage message={error} />}

			{/* Loading */}
			{loading && orders.length === 0 && <Loading />}

			{/* Grid de pedidos */}
			{!loading && orders.length === 0 ? (
				<div className="empty-state">
					<IconShoppingCart size={48} className="empty-state-icon" />
					<p className="empty-state-title">Nenhum pedido encontrado</p>
					<p className="empty-state-text">
						{filters.search || filters.status || filters.dateFrom || filters.dateTo
							? "Tente ajustar os filtros"
							: "Crie seu primeiro pedido de venda"}
					</p>
				</div>
			) : (
				<div className={`cards-grid ${loading ? "loading" : ""}`}>
					{orders.map((order) => (
						<SalesOrderCard
							key={order.id}
							order={order}
							onView={handleView}
							onEdit={handleEdit}
							onUpdateStatus={handleUpdateStatus}
							onDelete={(id) => setDeleteConfirm(orders.find((o) => o.id === id) || null)}
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
					setEditingOrder(null);
				}}
				title={editingOrder ? "Editar Pedido" : "Novo Pedido"}
				size="large"
			>
				<SalesOrderForm
					order={editingOrder}
					clients={clients}
					products={products}
					onSubmit={handleFormSubmit}
					onCancel={() => {
						setIsFormOpen(false);
						setEditingOrder(null);
					}}
					loading={formLoading}
				/>
			</Modal>

			{/* Modal de detalhes */}
			<Modal isOpen={!!viewingOrder} onClose={() => setViewingOrder(null)} title="" size="large">
				{viewingOrder && (
					<SalesOrderDetail
						order={viewingOrder}
						onClose={() => setViewingOrder(null)}
						onUpdateStatus={handleUpdateStatus}
					/>
				)}
			</Modal>

			{/* Diálogo de confirmação de exclusão */}
			<ConfirmDialog
				isOpen={!!deleteConfirm}
				onClose={() => setDeleteConfirm(null)}
				onConfirm={handleDeleteConfirm}
				title="Excluir Pedido"
				message={`Tem certeza que deseja excluir o pedido #${deleteConfirm?.orderNumber}? Esta ação não pode ser desfeita.`}
				confirmText="Excluir"
				isDestructive
			/>
		</div>
	);
}

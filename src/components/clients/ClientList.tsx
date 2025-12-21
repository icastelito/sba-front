import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useClients } from "../../hooks/useClients";
import type { Client, ClientFilters } from "../../types";
import { ClientCard } from "./ClientCard";
import { ClientListView } from "./ClientListView";
import { ClientFiltersComponent } from "./ClientFilters";
import { ConfirmDialog, Loading, ErrorMessage, IconPlus, IconUsers, IconGrid, IconList, Pagination } from "../ui";

type ViewMode = "grid" | "list";

export function ClientList() {
	const navigate = useNavigate();
	const { clients, loading, error, pagination, fetchClients, fetchCities, fetchStates, deleteClient, toggleActive } =
		useClients();

	const [filters, setFilters] = useState<ClientFilters>({
		page: 1,
		limit: 12,
		sortBy: "createdAt",
		sortOrder: "desc",
	});

	const [cities, setCities] = useState<string[]>([]);
	const [states, setStates] = useState<string[]>([]);
	const [deleteConfirm, setDeleteConfirm] = useState<Client | null>(null);
	const [viewMode, setViewMode] = useState<ViewMode>("grid");

	// Carregar clientes
	useEffect(() => {
		fetchClients(filters);
	}, [filters, fetchClients]);

	// Carregar cidades e estados
	useEffect(() => {
		const loadMeta = async () => {
			try {
				const [citiesData, statesData] = await Promise.all([fetchCities(), fetchStates()]);
				setCities(citiesData || []);
				setStates(statesData || []);
			} catch {
				// Ignorar erro
			}
		};
		loadMeta();
	}, [fetchCities, fetchStates]);

	const handleFiltersChange = useCallback((newFilters: ClientFilters) => {
		setFilters(newFilters);
	}, []);

	const handleCreate = () => {
		navigate("/clientes/novo");
	};

	const handleEdit = (client: Client) => {
		navigate(`/clientes/${client.id}/editar`);
	};

	const handleToggleActive = async (id: string) => {
		try {
			await toggleActive(id);
		} catch (err) {
			alert(err instanceof Error ? err.message : "Erro ao alterar status");
		}
	};

	const handleDeleteConfirm = async () => {
		if (!deleteConfirm) return;
		try {
			await deleteClient(deleteConfirm.id);
			setDeleteConfirm(null);
		} catch (err) {
			alert(err instanceof Error ? err.message : "Erro ao deletar cliente");
		}
	};

	const handlePageChange = (page: number) => {
		setFilters((prev) => ({ ...prev, page }));
	};

	return (
		<div className="page">
			{/* Header */}
			<div className="page-header">
				<div className="page-title-group">
					<IconUsers size={28} className="page-icon" />
					<h1 className="page-title">Clientes</h1>
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
					<button onClick={handleCreate} className="btn btn-primary">
						<IconPlus size={18} />
						<span>Novo Cliente</span>
					</button>
				</div>
			</div>

			{/* Filtros */}
			<ClientFiltersComponent
				filters={filters}
				cities={cities}
				states={states}
				onFiltersChange={handleFiltersChange}
			/>

			<div className="client-content">
				{/* Erro */}
				{error && <ErrorMessage message={error} />}

				{/* Loading */}
				{loading && clients.length === 0 && <Loading />}

				{/* Grid de clientes */}
				{!loading && clients.length === 0 ? (
					<div className="empty-state">
						<IconUsers size={48} className="empty-state-icon" />
						<p className="empty-state-title">Nenhum cliente encontrado</p>
						<p className="empty-state-description">
							{filters.search || filters.city || filters.state
								? "Tente ajustar os filtros"
								: "Cadastre seu primeiro cliente"}
						</p>
					</div>
				) : viewMode === "grid" ? (
					<div className={`cards-grid ${loading ? "loading" : ""}`}>
						{clients.map((client) => (
							<ClientCard
								key={client.id}
								client={client}
								onEdit={handleEdit}
								onToggleActive={handleToggleActive}
								onDelete={(id) => setDeleteConfirm(clients.find((c) => c.id === id) || null)}
							/>
						))}
					</div>
				) : (
					<ClientListView
						clients={clients}
						onEdit={handleEdit}
						onToggleActive={handleToggleActive}
						onDelete={(id) => setDeleteConfirm(clients.find((c) => c.id === id) || null)}
					/>
				)}
			</div>

			{/* Paginação */}
			{pagination && <Pagination meta={pagination} onPageChange={handlePageChange} />}

			{/* Diálogo de confirmação de exclusão */}
			<ConfirmDialog
				isOpen={!!deleteConfirm}
				onClose={() => setDeleteConfirm(null)}
				onConfirm={handleDeleteConfirm}
				title="Excluir Cliente"
				message={`Tem certeza que deseja excluir o cliente "${deleteConfirm?.name}"? Esta ação não pode ser desfeita.`}
				confirmText="Excluir"
				isDestructive
			/>
		</div>
	);
}

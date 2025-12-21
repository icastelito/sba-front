import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useClients } from "../../hooks/useClients";
import type { Client, ClientFilters } from "../../types";
import { ClientCard } from "./ClientCard";
import { ClientFiltersComponent } from "./ClientFilters";
import { ConfirmDialog, Loading, ErrorMessage, IconPlus, IconUsers, Pagination } from "../ui";

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
		<div>
			{/* Header */}
			<div className="section-header">
				<h1 className="section-title">
					<IconUsers size={28} />
					Clientes
				</h1>
				<button onClick={handleCreate} className="btn btn-primary">
					<IconPlus size={18} />
					Novo Cliente
				</button>
			</div>

			{/* Filtros */}
			<ClientFiltersComponent
				filters={filters}
				cities={cities}
				states={states}
				onFiltersChange={handleFiltersChange}
			/>

			{/* Erro */}
			{error && <ErrorMessage message={error} />}

			{/* Loading */}
			{loading && clients.length === 0 && <Loading />}

			{/* Grid de clientes */}
			{!loading && clients.length === 0 ? (
				<div className="empty-state">
					<IconUsers size={48} className="empty-state-icon" />
					<p className="empty-state-title">Nenhum cliente encontrado</p>
					<p className="empty-state-text">
						{filters.search || filters.city || filters.state
							? "Tente ajustar os filtros"
							: "Cadastre seu primeiro cliente"}
					</p>
				</div>
			) : (
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
			)}

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

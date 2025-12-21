import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useRequesters } from "../../hooks";
import type { RequesterFilters } from "../../hooks/useRequesters";
import type { Requester } from "../../types";
import { ConfirmDialog, Loading, ErrorMessage, Pagination, IconPlus, IconUsers, IconGrid, IconList } from "../ui";
import { RequesterCard } from "./RequesterCard";
import { RequesterListView } from "./RequesterListView";
import { RequesterFiltersBar } from "./RequesterFilters";

type ViewMode = "grid" | "list";

export function RequesterList() {
	const navigate = useNavigate();
	const { requesters, loading, error, pagination, fetchRequesters, toggleActive, deleteRequester } = useRequesters();

	const [filters, setFilters] = useState<RequesterFilters>({
		limit: 20,
	});

	const [deleteConfirm, setDeleteConfirm] = useState<Requester | null>(null);
	const [viewMode, setViewMode] = useState<ViewMode>("grid");

	const loadRequesters = useCallback(() => {
		fetchRequesters(filters);
	}, [fetchRequesters, filters]);

	useEffect(() => {
		loadRequesters();
	}, [loadRequesters]);

	const handleFiltersChange = (newFilters: RequesterFilters) => {
		setFilters(newFilters);
	};

	const handleCreate = () => {
		navigate("/demandantes/novo");
	};

	const handleEdit = (requester: Requester) => {
		navigate(`/demandantes/${requester.id}/editar`);
	};

	const handleToggleActive = async (id: number) => {
		try {
			await toggleActive(id);
		} catch (err) {
			alert(err instanceof Error ? err.message : "Erro ao alterar status");
		}
	};

	const handleDelete = async () => {
		if (!deleteConfirm) return;
		try {
			await deleteRequester(deleteConfirm.id);
			setDeleteConfirm(null);
			loadRequesters();
		} catch (err) {
			alert(err instanceof Error ? err.message : "Erro ao excluir");
		}
	};

	return (
		<div className="page">
			<div className="page-header">
				<div className="page-title-group">
					<IconUsers size={28} className="page-icon" />
					<h1 className="page-title">Demandantes</h1>
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
						<span>Novo Demandante</span>
					</button>
				</div>
			</div>

			<RequesterFiltersBar filters={filters} onChange={handleFiltersChange} />

			<div className="requester-content">
				{loading && requesters.length === 0 && <Loading />}
				{error && <ErrorMessage message={error} onRetry={loadRequesters} />}

				{!loading && !error && requesters.length === 0 && (
					<div className="empty-state">
						<IconUsers size={48} className="empty-state-icon" />
						<p className="empty-state-title">Nenhum demandante encontrado</p>
						<p className="empty-state-description">Cadastre um novo demandante para começar</p>
					</div>
				)}

				{viewMode === "grid" ? (
					<div className="requester-grid">
						{requesters.map((requester) => (
							<RequesterCard
								key={requester.id}
								requester={requester}
								onEdit={handleEdit}
								onDelete={(id) => setDeleteConfirm(requesters.find((r) => r.id === id) || null)}
								onToggleActive={handleToggleActive}
							/>
						))}
					</div>
				) : (
					<RequesterListView
						requesters={requesters}
						onEdit={handleEdit}
						onDelete={(id) => setDeleteConfirm(requesters.find((r) => r.id === id) || null)}
						onToggleActive={handleToggleActive}
					/>
				)}
			</div>

			<Pagination meta={pagination} onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))} />

			<ConfirmDialog
				isOpen={!!deleteConfirm}
				onClose={() => setDeleteConfirm(null)}
				onConfirm={handleDelete}
				title="Excluir Demandante"
				message={`Tem certeza que deseja excluir "${deleteConfirm?.name}"? Esta ação não pode ser desfeita.`}
				confirmText="Excluir"
				isDestructive
			/>
		</div>
	);
}

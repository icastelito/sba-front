import { useEffect, useState, useCallback } from "react";
import { useRequesters } from "../../hooks";
import type { RequesterFilters, CreateRequesterDto, UpdateRequesterDto } from "../../hooks/useRequesters";
import type { Requester } from "../../types";
import { Modal, ConfirmDialog, Loading, ErrorMessage, Pagination, IconPlus, IconUsers } from "../ui";
import { RequesterCard } from "./RequesterCard";
import { RequesterForm } from "./RequesterForm";
import { RequesterFiltersBar } from "./RequesterFilters";

export function RequesterList() {
	const {
		requesters,
		loading,
		error,
		pagination,
		fetchRequesters,
		createRequester,
		updateRequester,
		toggleActive,
		deleteRequester,
	} = useRequesters();

	const [filters, setFilters] = useState<RequesterFilters>({
		limit: 20,
	});

	const [modalOpen, setModalOpen] = useState(false);
	const [editingRequester, setEditingRequester] = useState<Requester | null>(null);
	const [deleteConfirm, setDeleteConfirm] = useState<Requester | null>(null);
	const [submitting, setSubmitting] = useState(false);

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
		setEditingRequester(null);
		setModalOpen(true);
	};

	const handleEdit = (requester: Requester) => {
		setEditingRequester(requester);
		setModalOpen(true);
	};

	const handleSubmit = async (data: CreateRequesterDto | UpdateRequesterDto) => {
		setSubmitting(true);
		try {
			if (editingRequester) {
				await updateRequester(editingRequester.id, data);
			} else {
				await createRequester(data as CreateRequesterDto);
			}
			setModalOpen(false);
			loadRequesters();
		} catch (err) {
			alert(err instanceof Error ? err.message : "Erro ao salvar");
		} finally {
			setSubmitting(false);
		}
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
				<button onClick={handleCreate} className="btn btn-primary">
					<IconPlus size={18} />
					<span>Novo Demandante</span>
				</button>
			</div>

			<RequesterFiltersBar filters={filters} onChange={handleFiltersChange} />

			{loading && requesters.length === 0 && <Loading />}
			{error && <ErrorMessage message={error} onRetry={loadRequesters} />}

			{!loading && !error && requesters.length === 0 && (
				<div className="empty-state">
					<IconUsers size={48} className="empty-state-icon" />
					<p className="empty-state-title">Nenhum demandante encontrado</p>
					<p className="empty-state-description">Cadastre um novo demandante para começar</p>
				</div>
			)}

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

			<Pagination meta={pagination} onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))} />

			<Modal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				title={editingRequester ? "Editar Demandante" : "Novo Demandante"}
			>
				<RequesterForm
					requester={editingRequester}
					onSubmit={handleSubmit}
					onCancel={() => setModalOpen(false)}
					loading={submitting}
				/>
			</Modal>

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

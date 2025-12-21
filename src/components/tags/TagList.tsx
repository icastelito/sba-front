import { useEffect, useState, useCallback } from "react";
import { useTags } from "../../hooks";
import type { Tag, TagFilters, CreateTagDto, UpdateTagDto } from "../../types";
import { Modal, ConfirmDialog, Loading, ErrorMessage, IconPlus, IconTag, Pagination } from "../ui";
import { TagCard } from "./TagCard";
import { TagForm } from "./TagForm";
import { TagFiltersBar } from "./TagFilters";
import { TagStatsBar } from "./TagStats";

export function TagList() {
	const { tags, loading, error, pagination, stats, fetchTags, fetchStats, createTag, updateTag, deleteTag } =
		useTags();

	const [filters, setFilters] = useState<TagFilters>({
		limit: 20,
		sortBy: "name",
		sortOrder: "asc",
	});

	const [modalOpen, setModalOpen] = useState(false);
	const [editingTag, setEditingTag] = useState<Tag | null>(null);
	const [deleteConfirm, setDeleteConfirm] = useState<Tag | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [statsKey, setStatsKey] = useState(0);

	const loadTags = useCallback(() => {
		fetchTags(filters);
	}, [fetchTags, filters]);

	useEffect(() => {
		loadTags();
	}, [loadTags]);

	useEffect(() => {
		fetchStats();
	}, [fetchStats, statsKey]);

	const handleFiltersChange = (newFilters: TagFilters) => {
		setFilters(newFilters);
	};

	const handleCreate = () => {
		setEditingTag(null);
		setModalOpen(true);
	};

	const handleEdit = (tag: Tag) => {
		setEditingTag(tag);
		setModalOpen(true);
	};

	const handleSubmit = async (data: CreateTagDto | UpdateTagDto) => {
		setSubmitting(true);
		try {
			if (editingTag) {
				await updateTag(editingTag.id, data);
			} else {
				await createTag(data as CreateTagDto);
			}
			setModalOpen(false);
			loadTags();
			setStatsKey((k) => k + 1);
		} catch (err) {
			alert(err instanceof Error ? err.message : "Erro ao salvar");
		} finally {
			setSubmitting(false);
		}
	};

	const handleToggleActive = async (id: string) => {
		const tag = tags.find((t) => t.id === id);
		if (!tag) return;

		try {
			await updateTag(id, { isActive: !tag.isActive });
			loadTags();
			setStatsKey((k) => k + 1);
		} catch (err) {
			alert(err instanceof Error ? err.message : "Erro ao atualizar status");
		}
	};

	const handleDelete = async () => {
		if (!deleteConfirm) return;
		try {
			await deleteTag(deleteConfirm.id);
			setDeleteConfirm(null);
			loadTags();
			setStatsKey((k) => k + 1);
		} catch (err) {
			alert(err instanceof Error ? err.message : "Erro ao excluir");
		}
	};

	return (
		<div className="page">
			<div className="page-header">
				<div className="page-title-group">
					<IconTag size={28} className="page-icon" />
					<h1 className="page-title">Tags</h1>
				</div>
				<button onClick={handleCreate} className="btn btn-primary">
					<IconPlus size={18} />
					<span>Nova Tag</span>
				</button>
			</div>

			<TagStatsBar stats={stats} />

			<TagFiltersBar filters={filters} onFiltersChange={handleFiltersChange} />

			<div className="tag-content">
				{loading && tags.length === 0 && <Loading />}
				{error && <ErrorMessage message={error} onRetry={loadTags} />}

				{!loading && !error && tags.length === 0 && (
					<div className="empty-state">
						<IconTag size={48} className="empty-state-icon" />
						<p className="empty-state-title">Nenhuma tag encontrada</p>
						<p className="empty-state-description">
							Crie uma nova tag para categorizar suas tarefas e templates
						</p>
					</div>
				)}

				<div className="tag-grid">
					{tags.map((tag) => (
						<TagCard
							key={tag.id}
							tag={tag}
							onEdit={handleEdit}
							onToggleActive={handleToggleActive}
							onDelete={(id) => setDeleteConfirm(tags.find((t) => t.id === id) || null)}
						/>
					))}
				</div>
			</div>

			<Pagination meta={pagination} onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))} />

			<Modal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				title={editingTag ? "Editar Tag" : "Nova Tag"}
			>
				<TagForm
					tag={editingTag}
					onSubmit={handleSubmit}
					onCancel={() => setModalOpen(false)}
					loading={submitting}
				/>
			</Modal>

			<ConfirmDialog
				isOpen={!!deleteConfirm}
				onClose={() => setDeleteConfirm(null)}
				onConfirm={handleDelete}
				title="Excluir Tag"
				message={`Tem certeza que deseja excluir a tag "${deleteConfirm?.name}"? Templates e tarefas que usam esta tag manterão a referência, mas ela não será mais validada.`}
				confirmText="Excluir"
				isDestructive
			/>
		</div>
	);
}

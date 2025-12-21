import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTags } from "../../hooks";
import type { Tag, TagFilters } from "../../types";
import { ConfirmDialog, Loading, ErrorMessage, IconPlus, IconTag, IconGrid, IconList, Pagination } from "../ui";
import { TagCard } from "./TagCard";
import { TagListView } from "./TagListView";
import { TagFiltersBar } from "./TagFilters";
import { TagStatsBar } from "./TagStats";

type ViewMode = "grid" | "list";

export function TagList() {
	const navigate = useNavigate();
	const { tags, loading, error, pagination, stats, fetchTags, fetchStats, updateTag, deleteTag } = useTags();

	const [filters, setFilters] = useState<TagFilters>({
		limit: 20,
		sortBy: "name",
		sortOrder: "asc",
	});

	const [deleteConfirm, setDeleteConfirm] = useState<Tag | null>(null);
	const [statsKey, setStatsKey] = useState(0);
	const [viewMode, setViewMode] = useState<ViewMode>("grid");

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
		navigate("/tags/novo");
	};

	const handleEdit = (tag: Tag) => {
		navigate(`/tags/${tag.id}/editar`);
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
						<span>Nova Tag</span>
					</button>
				</div>
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

				{viewMode === "grid" ? (
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
				) : (
					<TagListView
						tags={tags}
						onEdit={handleEdit}
						onToggleActive={handleToggleActive}
						onDelete={(id) => setDeleteConfirm(tags.find((t) => t.id === id) || null)}
					/>
				)}
			</div>

			<Pagination meta={pagination} onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))} />

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

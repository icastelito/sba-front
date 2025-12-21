import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTemplates } from "../../hooks";
import type { Template, TemplateFilters } from "../../types";
import {
	ConfirmDialog,
	Loading,
	ErrorMessage,
	SearchInput,
	IconPlus,
	IconTemplate,
	IconSort,
	IconTag,
	Pagination,
} from "../ui";
import { TemplateCard } from "./TemplateCard";

export function TemplateList() {
	const navigate = useNavigate();
	const { templates, loading, error, pagination, fetchTemplates, deleteTemplate } = useTemplates();

	const [filters, setFilters] = useState<TemplateFilters>({
		limit: 20,
	});

	const [deleteConfirm, setDeleteConfirm] = useState<Template | null>(null);

	const loadTemplates = useCallback(() => {
		fetchTemplates(filters);
	}, [fetchTemplates, filters]);

	useEffect(() => {
		loadTemplates();
	}, [loadTemplates]);

	const handleSearch = (search: string) => {
		setFilters((prev) => ({ ...prev, search: search || undefined, page: 1 }));
	};

	const handleCreate = () => {
		navigate("/templates/novo");
	};

	const handleEdit = (template: Template) => {
		navigate(`/templates/${template.id}/editar`);
	};

	const handleDelete = async () => {
		if (!deleteConfirm) return;
		try {
			await deleteTemplate(deleteConfirm.id);
			setDeleteConfirm(null);
			loadTemplates();
		} catch (err) {
			alert(err instanceof Error ? err.message : "Erro ao excluir");
		}
	};

	return (
		<div className="page">
			<div className="page-header">
				<div className="page-title-group">
					<IconTemplate size={28} className="page-icon" />
					<h1 className="page-title">Templates</h1>
				</div>
				<button onClick={handleCreate} className="btn btn-primary">
					<IconPlus size={18} />
					<span>Novo Template</span>
				</button>
			</div>

			<div className="filters-bar">
				<div className="filters-search">
					<SearchInput
						value={filters.search || ""}
						onChange={handleSearch}
						placeholder="Buscar templates..."
					/>
				</div>

				<div className="filters-group">
					<div className="form-group">
						<label className="form-label">
							<IconTag size={14} />
							Tag
						</label>
						<input
							type="text"
							value={filters.tag || ""}
							onChange={(e) =>
								setFilters((prev) => ({ ...prev, tag: e.target.value || undefined, page: 1 }))
							}
							placeholder="Filtrar por tag"
							className="form-input"
						/>
					</div>

					<div className="form-group">
						<label className="form-label">
							<IconSort size={14} />
							Ordenar
						</label>
						<select
							value={`${filters.sortBy || "createdAt"}-${filters.sortOrder || "desc"}`}
							onChange={(e) => {
								const [sortBy, sortOrder] = e.target.value.split("-") as [
									TemplateFilters["sortBy"],
									TemplateFilters["sortOrder"]
								];
								setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
							}}
							className="form-select"
						>
							<option value="createdAt-desc">Mais recentes</option>
							<option value="createdAt-asc">Mais antigos</option>
							<option value="title-asc">Título A-Z</option>
							<option value="title-desc">Título Z-A</option>
						</select>
					</div>
				</div>
			</div>

			{loading && templates.length === 0 && <Loading />}
			{error && <ErrorMessage message={error} onRetry={loadTemplates} />}

			{!loading && !error && templates.length === 0 && (
				<div className="empty-state">
					<IconTemplate size={48} className="empty-state-icon" />
					<p className="empty-state-title">Nenhum template encontrado</p>
					<p className="empty-state-description">Crie um template para agilizar a criação de tarefas</p>
				</div>
			)}

			<div className="template-grid">
				{templates.map((template) => (
					<TemplateCard
						key={template.id}
						template={template}
						onEdit={handleEdit}
						onDelete={(id) => setDeleteConfirm(templates.find((t) => t.id === id) || null)}
					/>
				))}
			</div>

			<Pagination meta={pagination} onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))} />

			<ConfirmDialog
				isOpen={!!deleteConfirm}
				onClose={() => setDeleteConfirm(null)}
				onConfirm={handleDelete}
				title="Excluir Template"
				message={`Tem certeza que deseja excluir "${deleteConfirm?.title}"? Esta ação não pode ser desfeita.`}
				confirmText="Excluir"
				isDestructive
			/>
		</div>
	);
}

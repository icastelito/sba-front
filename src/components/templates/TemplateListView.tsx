import type { Template } from "../../types";
import { IconEdit, IconTrash, IconCalendar, IconTag } from "../ui";

interface TemplateListViewProps {
	templates: Template[];
	onEdit: (template: Template) => void;
	onDelete: (id: string) => void;
}

export function TemplateListView({ templates, onEdit, onDelete }: TemplateListViewProps) {
	return (
		<div className="list-view">
			<table className="list-table">
				<thead>
					<tr>
						<th>Título</th>
						<th>Descrição</th>
						<th style={{ width: "120px" }}>Prazo Padrão</th>
						<th style={{ width: "200px" }}>Tags</th>
						<th style={{ width: "100px" }}>Ações</th>
					</tr>
				</thead>
				<tbody>
					{templates.map((template) => (
						<tr key={template.id}>
							<td>
								<span className="list-title">{template.title}</span>
							</td>
							<td>
								{template.description && (
									<span className="text-muted list-description-cell">{template.description}</span>
								)}
							</td>
							<td>
								{template.defaultDueDays !== undefined && (
									<span className="text-muted">
										<IconCalendar size={14} className="inline-icon" />
										{template.defaultDueDays} dias
									</span>
								)}
							</td>
							<td>
								{template.tags.length > 0 && (
									<div className="list-tags">
										{template.tags.slice(0, 3).map((tag) => (
											<span key={tag} className="tag tag-sm">
												<IconTag size={10} />
												{tag}
											</span>
										))}
										{template.tags.length > 3 && (
											<span className="tag tag-sm tag-more">+{template.tags.length - 3}</span>
										)}
									</div>
								)}
							</td>
							<td>
								<div className="list-actions">
									<button
										onClick={() => onEdit(template)}
										className="btn btn-ghost btn-icon btn-sm"
										aria-label="Editar"
									>
										<IconEdit size={16} />
									</button>
									<button
										onClick={() => onDelete(template.id)}
										className="btn btn-ghost btn-icon btn-icon-danger btn-sm"
										aria-label="Excluir"
									>
										<IconTrash size={16} />
									</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

import type { Template } from "../../types";
import { IconEdit, IconTrash, IconCalendar, IconTag } from "../ui";

interface TemplateCardProps {
	template: Template;
	onEdit: (template: Template) => void;
	onDelete: (id: string) => void;
}

export function TemplateCard({ template, onEdit, onDelete }: TemplateCardProps) {
	return (
		<div className="card template-card">
			<div className="template-card-content">
				<div className="template-card-body">
					<h3 className="template-card-title">{template.title}</h3>

					{template.description && <p className="template-card-description">{template.description}</p>}

					<div className="template-card-meta">
						{template.defaultDueDays !== undefined && (
							<span className="template-meta-item">
								<IconCalendar size={14} />
								Prazo padrão: {template.defaultDueDays} dias
							</span>
						)}
					</div>

					{template.tags.length > 0 && (
						<div className="template-card-tags">
							{template.tags.map((tag) => (
								<span key={tag} className="tag">
									<IconTag size={12} />
									{tag}
								</span>
							))}
						</div>
					)}
				</div>

				<div className="template-card-actions">
					<button onClick={() => onEdit(template)} className="btn btn-secondary btn-sm">
						<IconEdit size={14} />
						<span>Editar</span>
					</button>
					<button onClick={() => onDelete(template.id)} className="btn btn-danger btn-sm">
						<IconTrash size={14} />
						<span>Excluir</span>
					</button>
				</div>
			</div>
		</div>
	);
}

import type { Tag } from "../../types";
import { formatDate } from "../../lib/utils";
import { IconEdit, IconTrash } from "../ui";

interface TagCardProps {
	tag: Tag;
	onEdit: (tag: Tag) => void;
	onToggleActive: (id: string) => void;
	onDelete: (id: string) => void;
}

export function TagCard({ tag, onEdit, onToggleActive, onDelete }: TagCardProps) {
	return (
		<div className={`card tag-card ${!tag.isActive ? "tag-card-inactive" : ""}`}>
			<div className="tag-card-content">
				<div className="tag-card-header">
					<div className="tag-card-preview">
						<span
							className="tag-badge"
							style={{
								backgroundColor: tag.color || "var(--primary-500)",
								color: "#fff",
							}}
						>
							{tag.name}
						</span>
					</div>
					<div className="tag-card-actions">
						<button onClick={() => onEdit(tag)} className="btn btn-ghost btn-icon" aria-label="Editar tag">
							<IconEdit size={18} />
						</button>
						<button
							onClick={() => onDelete(tag.id)}
							className="btn btn-ghost btn-icon btn-icon-danger"
							aria-label="Excluir tag"
						>
							<IconTrash size={18} />
						</button>
					</div>
				</div>

				{tag.description && <p className="tag-card-description">{tag.description}</p>}

				<div className="tag-card-footer">
					<div className="tag-card-meta">
						{tag.color && (
							<span className="tag-color-preview">
								<span className="tag-color-dot" style={{ backgroundColor: tag.color }} />
								{tag.color}
							</span>
						)}
						<span className="tag-date">Criado em {formatDate(tag.createdAt)}</span>
					</div>
					<button
						onClick={() => onToggleActive(tag.id)}
						className={`badge ${tag.isActive ? "badge-success" : "badge-secondary"}`}
						style={{ cursor: "pointer" }}
					>
						{tag.isActive ? "Ativa" : "Inativa"}
					</button>
				</div>
			</div>
		</div>
	);
}

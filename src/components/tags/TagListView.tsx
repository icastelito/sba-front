import type { Tag } from "../../types";
import { formatDate } from "../../lib/utils";
import { IconEdit, IconTrash } from "../ui";

interface TagListViewProps {
	tags: Tag[];
	onEdit: (tag: Tag) => void;
	onToggleActive: (id: string) => void;
	onDelete: (id: string) => void;
}

export function TagListView({ tags, onEdit, onToggleActive, onDelete }: TagListViewProps) {
	return (
		<div className="list-view">
			<table className="list-table">
				<thead>
					<tr>
						<th>Tag</th>
						<th>Descrição</th>
						<th style={{ width: "120px" }}>Cor</th>
						<th style={{ width: "120px" }}>Criado em</th>
						<th style={{ width: "100px" }}>Status</th>
						<th style={{ width: "120px" }}>Ações</th>
					</tr>
				</thead>
				<tbody>
					{tags.map((tag) => (
						<tr key={tag.id} className={!tag.isActive ? "row-inactive" : ""}>
							<td>
								<span
									className="tag-badge"
									style={{
										backgroundColor: tag.color || "var(--primary-500)",
										color: "#fff",
									}}
								>
									{tag.name}
								</span>
							</td>
							<td>{tag.description && <span className="text-muted">{tag.description}</span>}</td>
							<td>
								{tag.color && (
									<span className="tag-color-preview">
										<span className="tag-color-dot" style={{ backgroundColor: tag.color }} />
										{tag.color}
									</span>
								)}
							</td>
							<td>
								<span className="text-muted text-sm">{formatDate(tag.createdAt)}</span>
							</td>
							<td>
								<button
									onClick={() => onToggleActive(tag.id)}
									className={`badge badge-sm ${tag.isActive ? "badge-success" : "badge-secondary"}`}
									style={{ cursor: "pointer" }}
								>
									{tag.isActive ? "Ativa" : "Inativa"}
								</button>
							</td>
							<td>
								<div className="list-actions">
									<button
										onClick={() => onEdit(tag)}
										className="btn btn-ghost btn-icon btn-sm"
										aria-label="Editar"
									>
										<IconEdit size={16} />
									</button>
									<button
										onClick={() => onDelete(tag.id)}
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

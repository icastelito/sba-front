import type { Requester } from "../../types";
import { IconEdit, IconTrash, IconMail, IconPhone } from "../ui";

interface RequesterListViewProps {
	requesters: Requester[];
	onEdit: (requester: Requester) => void;
	onDelete: (id: number) => void;
	onToggleActive: (id: number) => void;
}

export function RequesterListView({ requesters, onEdit, onDelete, onToggleActive }: RequesterListViewProps) {
	return (
		<div className="list-view">
			<table className="list-table">
				<thead>
					<tr>
						<th>Nome</th>
						<th style={{ width: "150px" }}>Departamento</th>
						<th style={{ width: "200px" }}>Contato</th>
						<th style={{ width: "100px" }}>Status</th>
						<th style={{ width: "140px" }}>Ações</th>
					</tr>
				</thead>
				<tbody>
					{requesters.map((requester) => (
						<tr key={requester.id} className={!requester.isActive ? "row-inactive" : ""}>
							<td>
								<div className="list-title-cell">
									<div className="list-avatar">{requester.name.charAt(0).toUpperCase()}</div>
									<span className="list-title">{requester.name}</span>
								</div>
							</td>
							<td>
								{requester.department && <span className="text-muted">{requester.department}</span>}
							</td>
							<td>
								<div className="list-contact">
									{requester.email && (
										<span className="list-contact-item">
											<IconMail size={14} />
											<span>{requester.email}</span>
										</span>
									)}
									{requester.phone && (
										<span className="list-contact-item">
											<IconPhone size={14} />
											<span>{requester.phone}</span>
										</span>
									)}
								</div>
							</td>
							<td>
								<span
									className={`badge badge-sm ${
										requester.isActive ? "badge-success" : "badge-secondary"
									}`}
								>
									{requester.isActive ? "Ativo" : "Inativo"}
								</span>
							</td>
							<td>
								<div className="list-actions">
									<button
										onClick={() => onEdit(requester)}
										className="btn btn-ghost btn-icon btn-sm"
										aria-label="Editar"
									>
										<IconEdit size={16} />
									</button>
									<button
										onClick={() => onToggleActive(requester.id)}
										className="btn btn-ghost btn-sm"
									>
										{requester.isActive ? "Desativar" : "Ativar"}
									</button>
									<button
										onClick={() => onDelete(requester.id)}
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

import type { Client } from "../../types";
import { IconEdit, IconTrash, IconMail, IconPhone, IconMapPin } from "../ui";

interface ClientListViewProps {
	clients: Client[];
	onEdit: (client: Client) => void;
	onToggleActive: (id: string) => void;
	onDelete: (id: string) => void;
}

export function ClientListView({ clients, onEdit, onToggleActive, onDelete }: ClientListViewProps) {
	return (
		<div className="list-view">
			<table className="list-table">
				<thead>
					<tr>
						<th>Nome</th>
						<th style={{ width: "200px" }}>Contato</th>
						<th style={{ width: "180px" }}>Localização</th>
						<th style={{ width: "100px" }}>Pedidos</th>
						<th style={{ width: "100px" }}>Status</th>
						<th style={{ width: "140px" }}>Ações</th>
					</tr>
				</thead>
				<tbody>
					{clients.map((client) => (
						<tr key={client.id} className={!client.isActive ? "row-inactive" : ""}>
							<td>
								<div className="list-title-cell">
									<span className="list-title">{client.name}</span>
									{client.document && <span className="list-subtitle">{client.document}</span>}
								</div>
							</td>
							<td>
								<div className="list-contact">
									{client.email && (
										<a href={`mailto:${client.email}`} className="list-contact-item">
											<IconMail size={14} />
											<span>{client.email}</span>
										</a>
									)}
									{client.phone && (
										<a href={`tel:${client.phone}`} className="list-contact-item">
											<IconPhone size={14} />
											<span>{client.phone}</span>
										</a>
									)}
								</div>
							</td>
							<td>
								{(client.city || client.state) && (
									<span className="list-location">
										<IconMapPin size={14} />
										{client.city}
										{client.city && client.state ? " - " : ""}
										{client.state}
									</span>
								)}
							</td>
							<td>
								{client.ordersCount !== undefined && client.ordersCount > 0 && (
									<span className="badge badge-info badge-sm">{client.ordersCount}</span>
								)}
							</td>
							<td>
								<span
									className={`badge badge-sm ${
										client.isActive ? "badge-success" : "badge-secondary"
									}`}
								>
									{client.isActive ? "Ativo" : "Inativo"}
								</span>
							</td>
							<td>
								<div className="list-actions">
									<button
										onClick={() => onEdit(client)}
										className="btn btn-ghost btn-icon btn-sm"
										aria-label="Editar"
									>
										<IconEdit size={16} />
									</button>
									<button onClick={() => onToggleActive(client.id)} className="btn btn-ghost btn-sm">
										{client.isActive ? "Desativar" : "Ativar"}
									</button>
									<button
										onClick={() => onDelete(client.id)}
										className="btn btn-ghost btn-icon btn-icon-danger btn-sm"
										aria-label="Excluir"
										disabled={client.ordersCount !== undefined && client.ordersCount > 0}
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

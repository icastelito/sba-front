import type { Client } from "../../types";
import { formatDate } from "../../lib/utils";
import { IconEdit, IconTrash, IconMail, IconPhone, IconUser, IconMapPin } from "../ui";

interface ClientCardProps {
	client: Client;
	onEdit: (client: Client) => void;
	onToggleActive: (id: string) => void;
	onDelete: (id: string) => void;
}

export function ClientCard({ client, onEdit, onToggleActive, onDelete }: ClientCardProps) {
	return (
		<div className={`card client-card ${!client.isActive ? "inactive" : ""}`}>
			{/* Header com avatar */}
			<div className="client-card-header">
				<div className="client-card-avatar">
					<IconUser size={32} />
				</div>
				{!client.isActive && <span className="client-card-status">Inativo</span>}
			</div>

			{/* Conteúdo */}
			<div className="client-card-content">
				<h3 className="client-card-name">{client.name}</h3>

				{/* Contato */}
				<div className="client-card-contact">
					{client.email && (
						<a href={`mailto:${client.email}`} className="client-card-contact-item">
							<IconMail size={14} />
							<span>{client.email}</span>
						</a>
					)}
					{client.phone && (
						<a href={`tel:${client.phone}`} className="client-card-contact-item">
							<IconPhone size={14} />
							<span>{client.phone}</span>
						</a>
					)}
				</div>

				{/* Documento */}
				{client.document && (
					<div className="client-card-document">
						<span className="label">Documento:</span> {client.document}
					</div>
				)}

				{/* Endereço */}
				{(client.address || client.city || client.state) && (
					<div className="client-card-address">
						<IconMapPin size={14} />
						<div>
							{client.address && <span>{client.address}</span>}
							{(client.city || client.state || client.zipCode) && (
								<span>
									{client.city}
									{client.city && client.state ? " - " : ""}
									{client.state}
									{client.zipCode && ` | CEP: ${client.zipCode}`}
								</span>
							)}
						</div>
					</div>
				)}

				{/* Notas */}
				{client.notes && <p className="client-card-notes">{client.notes}</p>}

				{/* Meta */}
				<div className="client-card-meta">
					{client.ordersCount !== undefined && client.ordersCount > 0 && (
						<span className="badge badge-info">{client.ordersCount} pedidos</span>
					)}
					<span className="text-muted">Criado em {formatDate(client.createdAt)}</span>
				</div>
			</div>

			{/* Ações */}
			<div className="client-card-actions">
				<button onClick={() => onEdit(client)} className="btn btn-outline btn-sm">
					<IconEdit size={16} />
					Editar
				</button>
				<button onClick={() => onToggleActive(client.id)} className="btn btn-ghost btn-sm">
					{client.isActive ? "Desativar" : "Ativar"}
				</button>
				<button
					onClick={() => onDelete(client.id)}
					className="btn btn-danger btn-icon btn-sm"
					title="Excluir"
					disabled={client.ordersCount !== undefined && client.ordersCount > 0}
				>
					<IconTrash size={16} />
				</button>
			</div>
		</div>
	);
}

import type { Requester } from "../../types";
import { IconEdit, IconTrash, IconMail, IconPhone } from "../ui";

interface RequesterCardProps {
	requester: Requester;
	onEdit: (requester: Requester) => void;
	onDelete: (id: number) => void;
	onToggleActive: (id: number) => void;
}

export function RequesterCard({ requester, onEdit, onDelete, onToggleActive }: RequesterCardProps) {
	return (
		<div className={`requester-card ${!requester.isActive ? "requester-card-inactive" : ""}`}>
			<div className="requester-card-main">
				<div className="requester-avatar">{requester.name.charAt(0).toUpperCase()}</div>

				<div className="requester-content">
					<div className="requester-header">
						<h3 className="requester-name">{requester.name}</h3>
						<span className={`badge ${requester.isActive ? "badge-success" : "badge-secondary"}`}>
							{requester.isActive ? "Ativo" : "Inativo"}
						</span>
					</div>

					<div className="requester-meta">
						{requester.department && <span className="requester-department">{requester.department}</span>}
						{requester.email && (
							<span className="requester-contact">
								<IconMail size={14} />
								{requester.email}
							</span>
						)}
						{requester.phone && (
							<span className="requester-contact">
								<IconPhone size={14} />
								{requester.phone}
							</span>
						)}
					</div>
				</div>
			</div>

			<div className="requester-actions">
				<button onClick={() => onEdit(requester)} className="btn btn-outline btn-sm">
					<IconEdit size={16} />
					Editar
				</button>
				<button onClick={() => onToggleActive(requester.id)} className="btn btn-ghost btn-sm">
					{requester.isActive ? "Desativar" : "Ativar"}
				</button>
				<button
					onClick={() => onDelete(requester.id)}
					className="btn btn-danger btn-icon btn-sm"
					title="Excluir"
				>
					<IconTrash size={16} />
				</button>
			</div>
		</div>
	);
}

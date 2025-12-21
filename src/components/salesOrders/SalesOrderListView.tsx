import type { SalesOrder, OrderStatus } from "../../types";
import { formatCurrency, formatDateTime } from "../../lib/utils";
import {
	IconEdit,
	IconTrash,
	IconEye,
	IconHourglass,
	IconCheckCircle,
	IconCash,
	IconCog,
	IconTruck,
	IconXCircle,
	IconArrowUturnLeft,
	IconHomeCheck,
} from "../ui";
import type { ComponentType } from "react";

interface SalesOrderListViewProps {
	orders: SalesOrder[];
	onView: (order: SalesOrder) => void;
	onEdit: (order: SalesOrder) => void;
	onUpdateStatus: (id: string, status: OrderStatus) => void;
	onDelete: (id: string) => void;
}

type IconComponent = ComponentType<{ size?: number }>;

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; Icon: IconComponent }> = {
	PENDING: { label: "Pendente", color: "pending", Icon: IconHourglass },
	CONFIRMED: { label: "Confirmado", color: "info", Icon: IconCheckCircle },
	PAID: { label: "Pago", color: "success", Icon: IconCash },
	PROCESSING: { label: "Em processamento", color: "warning", Icon: IconCog },
	SHIPPED: { label: "Enviado", color: "info", Icon: IconTruck },
	DELIVERED: { label: "Entregue", color: "success", Icon: IconHomeCheck },
	CANCELED: { label: "Cancelado", color: "danger", Icon: IconXCircle },
	REFUNDED: { label: "Reembolsado", color: "danger", Icon: IconArrowUturnLeft },
};

const ALL_STATUSES: OrderStatus[] = [
	"PENDING",
	"CONFIRMED",
	"PAID",
	"PROCESSING",
	"SHIPPED",
	"DELIVERED",
	"CANCELED",
	"REFUNDED",
];

const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
	PENDING: ALL_STATUSES.filter((s) => s !== "PENDING"),
	CONFIRMED: ALL_STATUSES.filter((s) => s !== "CONFIRMED"),
	PAID: ALL_STATUSES.filter((s) => s !== "PAID"),
	PROCESSING: ALL_STATUSES.filter((s) => s !== "PROCESSING"),
	SHIPPED: ALL_STATUSES.filter((s) => s !== "SHIPPED"),
	DELIVERED: ALL_STATUSES.filter((s) => s !== "DELIVERED"),
	CANCELED: ALL_STATUSES.filter((s) => s !== "CANCELED"),
	REFUNDED: ALL_STATUSES.filter((s) => s !== "REFUNDED"),
};

export function SalesOrderListView({ orders, onView, onEdit, onUpdateStatus, onDelete }: SalesOrderListViewProps) {
	return (
		<div className="list-view">
			<table className="list-table">
				<thead>
					<tr>
						<th style={{ width: "100px" }}>Nº Pedido</th>
						<th>Cliente</th>
						<th style={{ width: "100px" }}>Itens</th>
						<th style={{ width: "120px" }}>Total</th>
						<th style={{ width: "150px" }}>Status</th>
						<th style={{ width: "130px" }}>Data</th>
						<th style={{ width: "140px" }}>Ações</th>
					</tr>
				</thead>
				<tbody>
					{orders.map((order) => {
						const statusConfig = STATUS_CONFIG[order.status];
						const StatusIcon = statusConfig.Icon;
						const canEdit = !["SHIPPED", "DELIVERED", "CANCELED", "REFUNDED"].includes(order.status);
						const canDelete = ["PENDING", "CANCELED"].includes(order.status);
						const availableTransitions = STATUS_TRANSITIONS[order.status];
						const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

						return (
							<tr key={order.id}>
								<td>
									<span className="order-number-cell">#{order.orderNumber}</span>
								</td>
								<td>
									<div className="list-title-cell">
										<span className="list-title">{order.client.name}</span>
										{order.client.phone && (
											<span className="list-subtitle">{order.client.phone}</span>
										)}
									</div>
								</td>
								<td>
									<span className="badge badge-secondary badge-sm">
										{totalItems} {totalItems === 1 ? "item" : "itens"}
									</span>
								</td>
								<td>
									<span className="list-price">{formatCurrency(order.total)}</span>
								</td>
								<td>
									<div className="list-status-with-select">
										<span className={`badge badge-sm badge-${statusConfig.color}`}>
											<StatusIcon size={12} />
											{statusConfig.label}
										</span>
										{availableTransitions.length > 0 && (
											<select
												className="form-select form-select-xs"
												value=""
												onChange={(e) => {
													if (e.target.value) {
														onUpdateStatus(order.id, e.target.value as OrderStatus);
													}
												}}
											>
												<option value="">...</option>
												{availableTransitions.map((status) => (
													<option key={status} value={status}>
														{STATUS_CONFIG[status].label}
													</option>
												))}
											</select>
										)}
									</div>
								</td>
								<td>
									<span className="text-muted text-sm">{formatDateTime(order.createdAt)}</span>
								</td>
								<td>
									<div className="list-actions">
										<button
											onClick={() => onView(order)}
											className="btn btn-ghost btn-icon btn-sm"
											title="Ver detalhes"
										>
											<IconEye size={16} />
										</button>
										{canEdit && (
											<button
												onClick={() => onEdit(order)}
												className="btn btn-ghost btn-icon btn-sm"
												title="Editar"
											>
												<IconEdit size={16} />
											</button>
										)}
										{canDelete && (
											<button
												onClick={() => onDelete(order.id)}
												className="btn btn-ghost btn-icon btn-icon-danger btn-sm"
												title="Excluir"
											>
												<IconTrash size={16} />
											</button>
										)}
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

import type { SalesOrder, OrderStatus } from "../../types";
import { formatCurrency, formatDateTime, formatDate } from "../../lib/utils";
import {
	IconEdit,
	IconTrash,
	IconUser,
	IconEye,
	IconShoppingCart,
	IconHourglass,
	IconCheckCircle,
	IconCash,
	IconCog,
	IconTruck,
	IconXCircle,
	IconArrowUturnLeft,
	IconHomeCheck,
	IconCalendar,
} from "../ui";
import type { ComponentType } from "react";

interface SalesOrderCardProps {
	order: SalesOrder;
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

export function SalesOrderCard({ order, onView, onEdit, onUpdateStatus, onDelete }: SalesOrderCardProps) {
	const statusConfig = STATUS_CONFIG[order.status];
	const StatusIcon = statusConfig.Icon;
	const canEdit = !["SHIPPED", "DELIVERED", "CANCELED", "REFUNDED"].includes(order.status);
	const canDelete = ["PENDING", "CANCELED"].includes(order.status);
	const availableTransitions = STATUS_TRANSITIONS[order.status];
	const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

	return (
		<div className={`card order-card order-card--${statusConfig.color}`}>
			{/* Header com status visual */}
			<div className="order-card-header">
				<div className="order-card-header-left">
					<span className="order-number">#{order.orderNumber}</span>
					<span className="order-date">{formatDateTime(order.createdAt)}</span>
				</div>
				<span className={`order-status-badge order-status-badge--${statusConfig.color}`}>
					<StatusIcon size={14} />
					{statusConfig.label}
				</span>
			</div>

			<div className="order-card-body">
				{/* Cliente */}
				<div className="order-client-section">
					<div className="order-client-avatar">
						<IconUser size={20} />
					</div>
					<div className="order-client-info">
						<span className="order-client-name">{order.client.name}</span>
						{order.client.phone && <span className="order-client-phone">{order.client.phone}</span>}
					</div>
				</div>

				{/* Lista de Itens */}
				<div className="order-items-section">
					<div className="order-items-header">
						<IconShoppingCart size={14} />
						<span>
							{totalItems} {totalItems === 1 ? "produto" : "produtos"}
						</span>
					</div>
					<ul className="order-items-list">
						{order.items.slice(0, 3).map((item, index) => (
							<li key={index} className="order-item">
								<span className="order-item-qty">{item.quantity}x</span>
								<span className="order-item-name">{item.productName}</span>
								<span className="order-item-price">{formatCurrency(item.total)}</span>
							</li>
						))}
						{order.items.length > 3 && (
							<li className="order-item order-item-more">
								<span>
									+{order.items.length - 3} {order.items.length - 3 === 1 ? "item" : "itens"}
								</span>
							</li>
						)}
					</ul>
				</div>

				{/* Resumo Financeiro */}
				<div className="order-financial">
					{order.discount > 0 && (
						<div className="order-financial-row order-discount">
							<span>Desconto</span>
							<span>-{formatCurrency(order.discount)}</span>
						</div>
					)}
					{order.shipping > 0 && (
						<div className="order-financial-row">
							<span>Frete</span>
							<span>{formatCurrency(order.shipping)}</span>
						</div>
					)}
					<div className="order-financial-total">
						<span>Total</span>
						<span className="order-total-value">{formatCurrency(order.total)}</span>
					</div>
				</div>

				{/* Método de pagamento */}
				{order.paymentMethod && (
					<div className="order-payment-badge">
						<span className="badge badge-outline">{order.paymentMethod}</span>
					</div>
				)}

				{/* Data limite de envio */}
				{order.shipByDate && (
					<div className="order-ship-date">
						<IconCalendar size={14} />
						<span>Enviar até: {formatDate(order.shipByDate)}</span>
					</div>
				)}

				{/* Seletor de status */}
				{availableTransitions.length > 0 && (
					<div className="order-status-update">
						<select
							className="form-select form-select-sm"
							value=""
							onChange={(e) => {
								if (e.target.value) {
									onUpdateStatus(order.id, e.target.value as OrderStatus);
								}
							}}
						>
							<option value="">Alterar status...</option>
							{availableTransitions.map((status) => (
								<option key={status} value={status}>
									{STATUS_CONFIG[status].label}
								</option>
							))}
						</select>
					</div>
				)}
			</div>

			{/* Ações */}
			<div className="order-card-actions">
				<button onClick={() => onView(order)} className="btn btn-ghost btn-sm" title="Ver detalhes">
					<IconEye size={16} />
					<span>Detalhes</span>
				</button>
				{canEdit && (
					<button onClick={() => onEdit(order)} className="btn btn-outline btn-sm" title="Editar pedido">
						<IconEdit size={16} />
						<span>Editar</span>
					</button>
				)}
				{canDelete && (
					<button
						onClick={() => onDelete(order.id)}
						className="btn btn-danger btn-icon btn-sm"
						title="Excluir pedido"
					>
						<IconTrash size={16} />
					</button>
				)}
			</div>
		</div>
	);
}

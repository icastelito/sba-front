import type { SalesOrder, OrderStatus } from "../../types";
import { formatCurrency, formatDateTime } from "../../lib/utils";
import { API_BASE_URL } from "../../lib/api";
import { IconClose, IconUser, IconMail, IconPhone, IconProducts } from "../ui";

interface SalesOrderDetailProps {
	order: SalesOrder;
	onClose: () => void;
	onUpdateStatus: (id: string, status: OrderStatus) => void;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
	PENDING: { label: "Pendente", color: "pending" },
	CONFIRMED: { label: "Confirmado", color: "info" },
	PAID: { label: "Pago", color: "success" },
	PROCESSING: { label: "Em processamento", color: "warning" },
	SHIPPED: { label: "Enviado", color: "info" },
	DELIVERED: { label: "Entregue", color: "success" },
	CANCELED: { label: "Cancelado", color: "danger" },
	REFUNDED: { label: "Reembolsado", color: "danger" },
};

const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
	PENDING: ["CONFIRMED", "PAID", "CANCELED"],
	CONFIRMED: ["PAID", "CANCELED"],
	PAID: ["PROCESSING", "SHIPPED", "REFUNDED"],
	PROCESSING: ["SHIPPED", "REFUNDED"],
	SHIPPED: ["DELIVERED", "REFUNDED"],
	DELIVERED: ["REFUNDED"],
	CANCELED: [],
	REFUNDED: [],
};

export function SalesOrderDetail({ order, onClose, onUpdateStatus }: SalesOrderDetailProps) {
	const statusConfig = STATUS_CONFIG[order.status];
	const availableTransitions = STATUS_TRANSITIONS[order.status];

	const getProductImage = (item: SalesOrder["items"][0]) => {
		if (!item.product?.image) return null;
		if (item.product.imageType === "external") return item.product.image;
		return `${API_BASE_URL}${item.product.image}`;
	};

	return (
		<div className="order-detail">
			{/* Header */}
			<div className="order-detail-header">
				<div>
					<h2>Pedido #{order.orderNumber}</h2>
					<span className={`badge badge-${statusConfig.color}`}>{statusConfig.label}</span>
				</div>
				<button onClick={onClose} className="btn btn-ghost btn-icon">
					<IconClose size={24} />
				</button>
			</div>

			{/* Cliente */}
			<div className="order-detail-section">
				<h3>
					<IconUser size={18} />
					Cliente
				</h3>
				<div className="order-detail-client">
					<p className="client-name">{order.client.name}</p>
					{order.client.email && (
						<p className="client-contact">
							<IconMail size={14} />
							{order.client.email}
						</p>
					)}
					{order.client.phone && (
						<p className="client-contact">
							<IconPhone size={14} />
							{order.client.phone}
						</p>
					)}
				</div>
			</div>

			{/* Itens */}
			<div className="order-detail-section">
				<h3>
					<IconProducts size={18} />
					Itens do Pedido
				</h3>
				<div className="order-detail-items">
					{order.items.map((item) => {
						const imageUrl = getProductImage(item);
						return (
							<div key={item.id} className="order-detail-item">
								<div className="order-detail-item-image">
									{imageUrl ? (
										<img src={imageUrl} alt={item.productName} />
									) : (
										<div className="order-detail-item-placeholder">
											<IconProducts size={24} />
										</div>
									)}
								</div>
								<div className="order-detail-item-info">
									<p className="item-name">{item.productName}</p>
									{item.productSku && <p className="item-sku">SKU: {item.productSku}</p>}
									<p className="item-quantity">
										{item.quantity}x {formatCurrency(item.unitPrice)}
									</p>
								</div>
								<div className="order-detail-item-total">
									{item.discount > 0 && (
										<span className="item-discount">-{formatCurrency(item.discount)}</span>
									)}
									<span className="item-total">{formatCurrency(item.total)}</span>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Valores */}
			<div className="order-detail-section">
				<h3>Resumo</h3>
				<div className="order-detail-summary">
					<div className="summary-row">
						<span>Subtotal</span>
						<span>{formatCurrency(order.subtotal)}</span>
					</div>
					{order.discount > 0 && (
						<div className="summary-row text-danger">
							<span>Desconto</span>
							<span>-{formatCurrency(order.discount)}</span>
						</div>
					)}
					{order.shipping > 0 && (
						<div className="summary-row">
							<span>Frete</span>
							<span>{formatCurrency(order.shipping)}</span>
						</div>
					)}
					<div className="summary-row summary-total">
						<span>Total</span>
						<span>{formatCurrency(order.total)}</span>
					</div>
				</div>
			</div>

			{/* Informações adicionais */}
			<div className="order-detail-section">
				<h3>Informações</h3>
				<div className="order-detail-info">
					{order.paymentMethod && (
						<div className="info-row">
							<span className="info-label">Forma de Pagamento:</span>
							<span>{order.paymentMethod}</span>
						</div>
					)}
					<div className="info-row">
						<span className="info-label">Criado em:</span>
						<span>{formatDateTime(order.createdAt)}</span>
					</div>
					{order.paidAt && (
						<div className="info-row">
							<span className="info-label">Pago em:</span>
							<span>{formatDateTime(order.paidAt)}</span>
						</div>
					)}
					{order.shippedAt && (
						<div className="info-row">
							<span className="info-label">Enviado em:</span>
							<span>{formatDateTime(order.shippedAt)}</span>
						</div>
					)}
					{order.deliveredAt && (
						<div className="info-row">
							<span className="info-label">Entregue em:</span>
							<span>{formatDateTime(order.deliveredAt)}</span>
						</div>
					)}
					{order.canceledAt && (
						<div className="info-row">
							<span className="info-label">Cancelado em:</span>
							<span>{formatDateTime(order.canceledAt)}</span>
						</div>
					)}
				</div>
			</div>

			{/* Notas */}
			{order.notes && (
				<div className="order-detail-section">
					<h3>Observações</h3>
					<p className="order-notes">{order.notes}</p>
				</div>
			)}

			{/* Atualizar Status */}
			{availableTransitions.length > 0 && (
				<div className="order-detail-section">
					<h3>Atualizar Status</h3>
					<div className="order-status-buttons">
						{availableTransitions.map((status) => (
							<button
								key={status}
								onClick={() => onUpdateStatus(order.id, status)}
								className={`btn btn-outline btn-${STATUS_CONFIG[status].color}`}
							>
								{STATUS_CONFIG[status].label}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

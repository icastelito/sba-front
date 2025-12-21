import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSalesOrders, useClients, useProducts } from "../hooks";
import type { SalesOrder, CreateSalesOrderDto, UpdateSalesOrderDto, CreateSalesOrderItemDto } from "../types";
import { formatCurrency } from "../lib/utils";
import { Loading, ErrorMessage, IconArrowLeft, IconPlus, IconTrash } from "../components/ui";

interface OrderItemForm {
	productId: string;
	quantity: number;
	unitPrice: number;
	discount: number;
}

const PAYMENT_METHODS = [
	"PIX",
	"Cartão de Crédito",
	"Cartão de Débito",
	"Boleto",
	"Dinheiro",
	"Transferência",
	"Shopee",
];

export function SalesOrderCreatePage() {
	const navigate = useNavigate();
	const { createOrder } = useSalesOrders();
	const { clients, fetchClients } = useClients();
	const { products, fetchProducts } = useProducts();

	const [clientId, setClientId] = useState("");
	const [items, setItems] = useState<OrderItemForm[]>([]);
	const [discount, setDiscount] = useState("");
	const [shipping, setShipping] = useState("");
	const [notes, setNotes] = useState("");
	const [paymentMethod, setPaymentMethod] = useState("");
	const [shipByDate, setShipByDate] = useState("");
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const loadData = async () => {
			try {
				await Promise.all([fetchClients({ isActive: true }), fetchProducts({ isActive: true })]);
			} catch {
				// Error handled by hooks
			} finally {
				setLoading(false);
			}
		};
		loadData();
	}, [fetchClients, fetchProducts]);

	const handleAddItem = () => {
		setItems([...items, { productId: "", quantity: 1, unitPrice: 0, discount: 0 }]);
	};

	const handleRemoveItem = (index: number) => {
		setItems(items.filter((_, i) => i !== index));
	};

	const handleItemChange = (index: number, field: keyof OrderItemForm, value: string | number) => {
		const newItems = [...items];
		if (field === "productId") {
			const product = products.find((p) => p.id === value);
			newItems[index] = {
				...newItems[index],
				productId: value as string,
				unitPrice: product?.price || 0,
			};
		} else {
			newItems[index] = {
				...newItems[index],
				[field]: field === "quantity" ? Math.max(1, Number(value)) : Number(value),
			};
		}
		setItems(newItems);
	};

	const calculateSubtotal = () => {
		return items.reduce((sum, item) => {
			const itemTotal = item.unitPrice * item.quantity - item.discount;
			return sum + Math.max(0, itemTotal);
		}, 0);
	};

	const calculateTotal = () => {
		const subtotal = calculateSubtotal();
		const discountValue = parseFloat(discount) || 0;
		const shippingValue = parseFloat(shipping) || 0;
		return Math.max(0, subtotal - discountValue + shippingValue);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (items.length === 0) {
			alert("Adicione pelo menos um item ao pedido");
			return;
		}

		const orderItems: CreateSalesOrderItemDto[] = items
			.filter((item) => item.productId)
			.map((item) => ({
				productId: item.productId,
				quantity: item.quantity,
				unitPrice: item.unitPrice,
				discount: item.discount || undefined,
			}));

		setSubmitting(true);
		try {
			const data: CreateSalesOrderDto = {
				clientId,
				items: orderItems,
				discount: discount ? parseFloat(discount) : undefined,
				shipping: shipping ? parseFloat(shipping) : undefined,
				notes: notes || undefined,
				paymentMethod: paymentMethod || undefined,
				shipByDate: shipByDate || undefined,
			};
			await createOrder(data);
			navigate("/pedidos");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erro ao criar pedido";
			alert(message);
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) return <Loading />;

	return (
		<div className="page">
			<div className="page-header">
				<div className="page-header-content">
					<button onClick={() => navigate("/pedidos")} className="btn btn-ghost btn-sm">
						<IconArrowLeft size={16} />
						Voltar
					</button>
					<h1 className="page-title">Novo Pedido</h1>
				</div>
			</div>

			<div className="page-content">
				<div className="form-page-container form-page-wide">
					<form onSubmit={handleSubmit} className="form">
						{/* Cliente */}
						<div className="form-group">
							<label className="form-label">
								Cliente <span className="form-required">*</span>
							</label>
							<select
								value={clientId}
								onChange={(e) => setClientId(e.target.value)}
								className="form-select"
								required
							>
								<option value="">Selecione um cliente</option>
								{clients
									.filter((c) => c.isActive)
									.map((client) => (
										<option key={client.id} value={client.id}>
											{client.name} {client.document ? `(${client.document})` : ""}
										</option>
									))}
							</select>
						</div>

						{/* Itens */}
						<div className="form-group">
							<div className="form-label-row">
								<label className="form-label">
									Itens <span className="form-required">*</span>
								</label>
								<button type="button" onClick={handleAddItem} className="btn btn-outline btn-sm">
									<IconPlus size={14} />
									Adicionar Item
								</button>
							</div>

							{items.length === 0 ? (
								<p className="text-muted">Nenhum item adicionado</p>
							) : (
								<div className="order-items-form">
									{items.map((item, index) => (
										<div key={index} className="order-item-row">
											<div className="order-item-product">
												<div className="form-group">
													<label className="form-label">Produto</label>
													<select
														value={item.productId}
														onChange={(e) =>
															handleItemChange(index, "productId", e.target.value)
														}
														className="form-select"
														required
													>
														<option value="">Selecione</option>
														{products
															.filter((p) => p.isActive)
															.map((product) => (
																<option key={product.id} value={product.id}>
																	{product.name} - {formatCurrency(product.price)}
																</option>
															))}
													</select>
												</div>
												<button
													type="button"
													onClick={() => handleRemoveItem(index)}
													className="btn btn-danger btn-icon btn-sm"
												>
													<IconTrash size={16} />
												</button>
											</div>
											<div className="order-item-details">
												<div className="form-group">
													<label className="form-label">Qtd</label>
													<input
														type="number"
														value={item.quantity}
														onChange={(e) =>
															handleItemChange(index, "quantity", e.target.value)
														}
														className="form-input"
														min="1"
														required
													/>
												</div>
												<div className="form-group">
													<label className="form-label">Preço Unit.</label>
													<input
														type="number"
														value={item.unitPrice}
														onChange={(e) =>
															handleItemChange(index, "unitPrice", e.target.value)
														}
														className="form-input"
														min="0"
														step="0.01"
													/>
												</div>
												<div className="form-group">
													<label className="form-label">Desconto</label>
													<input
														type="number"
														value={item.discount}
														onChange={(e) =>
															handleItemChange(index, "discount", e.target.value)
														}
														className="form-input"
														min="0"
														step="0.01"
													/>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Desconto e Frete */}
						<div className="form-row">
							<div className="form-group">
								<label className="form-label">Desconto Geral (R$)</label>
								<input
									type="number"
									value={discount}
									onChange={(e) => setDiscount(e.target.value)}
									className="form-input"
									placeholder="0,00"
									min="0"
									step="0.01"
								/>
							</div>
							<div className="form-group">
								<label className="form-label">Frete (R$)</label>
								<input
									type="number"
									value={shipping}
									onChange={(e) => setShipping(e.target.value)}
									className="form-input"
									placeholder="0,00"
									min="0"
									step="0.01"
								/>
							</div>
						</div>

						{/* Método de Pagamento e Data */}
						<div className="form-row">
							<div className="form-group">
								<label className="form-label">Método de Pagamento</label>
								<select
									value={paymentMethod}
									onChange={(e) => setPaymentMethod(e.target.value)}
									className="form-select"
								>
									<option value="">Selecione</option>
									{PAYMENT_METHODS.map((method) => (
										<option key={method} value={method}>
											{method}
										</option>
									))}
								</select>
							</div>
							<div className="form-group">
								<label className="form-label">Data Limite de Envio</label>
								<input
									type="date"
									value={shipByDate}
									onChange={(e) => setShipByDate(e.target.value)}
									className="form-input"
								/>
							</div>
						</div>

						{/* Notas */}
						<div className="form-group">
							<label className="form-label">Observações</label>
							<textarea
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								className="form-textarea"
								placeholder="Observações do pedido"
								rows={3}
							/>
						</div>

						{/* Resumo */}
						<div className="order-summary">
							<div className="order-summary-row">
								<span>Subtotal:</span>
								<span>{formatCurrency(calculateSubtotal())}</span>
							</div>
							{parseFloat(discount) > 0 && (
								<div className="order-summary-row text-danger">
									<span>Desconto:</span>
									<span>-{formatCurrency(parseFloat(discount))}</span>
								</div>
							)}
							{parseFloat(shipping) > 0 && (
								<div className="order-summary-row">
									<span>Frete:</span>
									<span>{formatCurrency(parseFloat(shipping))}</span>
								</div>
							)}
							<div className="order-summary-row order-summary-total">
								<span>Total:</span>
								<span>{formatCurrency(calculateTotal())}</span>
							</div>
						</div>

						<div className="form-actions">
							<button
								type="button"
								onClick={() => navigate("/pedidos")}
								disabled={submitting}
								className="btn btn-secondary"
							>
								Cancelar
							</button>
							<button
								type="submit"
								disabled={submitting || items.length === 0}
								className="btn btn-primary"
							>
								{submitting ? "Criando..." : "Criar Pedido"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export function SalesOrderEditPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { getOrder, updateOrder } = useSalesOrders();
	const { fetchClients } = useClients();
	const { products, fetchProducts } = useProducts();

	const [order, setOrder] = useState<SalesOrder | null>(null);
	const [items, setItems] = useState<OrderItemForm[]>([]);
	const [discount, setDiscount] = useState("");
	const [shipping, setShipping] = useState("");
	const [notes, setNotes] = useState("");
	const [paymentMethod, setPaymentMethod] = useState("");
	const [shipByDate, setShipByDate] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const loadData = async () => {
			if (!id) return;
			setLoading(true);
			try {
				const [orderData] = await Promise.all([
					getOrder(id),
					fetchClients({ isActive: true }),
					fetchProducts({ isActive: true }),
				]);
				setOrder(orderData);
				setItems(
					orderData.items.map((item) => ({
						productId: item.productId,
						quantity: item.quantity,
						unitPrice: item.unitPrice,
						discount: item.discount,
					}))
				);
				setDiscount(String(orderData.discount || ""));
				setShipping(String(orderData.shipping || ""));
				setNotes(orderData.notes || "");
				setPaymentMethod(orderData.paymentMethod || "");
				setShipByDate(orderData.shipByDate ? orderData.shipByDate.split("T")[0] : "");
			} catch (err) {
				setError(err instanceof Error ? err.message : "Erro ao carregar pedido");
			} finally {
				setLoading(false);
			}
		};
		loadData();
	}, [id, getOrder, fetchClients, fetchProducts]);

	const handleAddItem = () => {
		setItems([...items, { productId: "", quantity: 1, unitPrice: 0, discount: 0 }]);
	};

	const handleRemoveItem = (index: number) => {
		setItems(items.filter((_, i) => i !== index));
	};

	const handleItemChange = (index: number, field: keyof OrderItemForm, value: string | number) => {
		const newItems = [...items];
		if (field === "productId") {
			const product = products.find((p) => p.id === value);
			newItems[index] = {
				...newItems[index],
				productId: value as string,
				unitPrice: product?.price || 0,
			};
		} else {
			newItems[index] = {
				...newItems[index],
				[field]: field === "quantity" ? Math.max(1, Number(value)) : Number(value),
			};
		}
		setItems(newItems);
	};

	const calculateSubtotal = () => {
		return items.reduce((sum, item) => {
			const itemTotal = item.unitPrice * item.quantity - item.discount;
			return sum + Math.max(0, itemTotal);
		}, 0);
	};

	const calculateTotal = () => {
		const subtotal = calculateSubtotal();
		const discountValue = parseFloat(discount) || 0;
		const shippingValue = parseFloat(shipping) || 0;
		return Math.max(0, subtotal - discountValue + shippingValue);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!order) return;

		if (items.length === 0) {
			alert("Adicione pelo menos um item ao pedido");
			return;
		}

		const orderItems: CreateSalesOrderItemDto[] = items
			.filter((item) => item.productId)
			.map((item) => ({
				productId: item.productId,
				quantity: item.quantity,
				unitPrice: item.unitPrice,
				discount: item.discount || undefined,
			}));

		setSubmitting(true);
		try {
			const data: UpdateSalesOrderDto = {
				discount: discount ? parseFloat(discount) : undefined,
				shipping: shipping ? parseFloat(shipping) : undefined,
				notes: notes || undefined,
				paymentMethod: paymentMethod || undefined,
				shipByDate: shipByDate || undefined,
				items: orderItems,
			};
			await updateOrder(order.id, data);
			navigate("/pedidos");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erro ao atualizar pedido";
			alert(message);
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) return <Loading />;
	if (error) return <ErrorMessage message={error} />;
	if (!order) return <ErrorMessage message="Pedido não encontrado" />;

	return (
		<div className="page">
			<div className="page-header">
				<div className="page-header-content">
					<button onClick={() => navigate("/pedidos")} className="btn btn-ghost btn-sm">
						<IconArrowLeft size={16} />
						Voltar
					</button>
					<h1 className="page-title">Editar Pedido #{order.orderNumber}</h1>
				</div>
			</div>

			<div className="page-content">
				<div className="form-page-container form-page-wide">
					<form onSubmit={handleSubmit} className="form">
						{/* Cliente (não editável) */}
						<div className="form-group">
							<label className="form-label">Cliente</label>
							<select value={order.client.id} className="form-select" disabled>
								<option value={order.client.id}>
									{order.client.name} {order.client.document ? `(${order.client.document})` : ""}
								</option>
							</select>
							<small className="form-help">
								O cliente não pode ser alterado após a criação do pedido
							</small>
						</div>

						{/* Itens */}
						<div className="form-group">
							<div className="form-label-row">
								<label className="form-label">
									Itens <span className="form-required">*</span>
								</label>
								<button type="button" onClick={handleAddItem} className="btn btn-outline btn-sm">
									<IconPlus size={14} />
									Adicionar Item
								</button>
							</div>

							{items.length === 0 ? (
								<p className="text-muted">Nenhum item adicionado</p>
							) : (
								<div className="order-items-form">
									{items.map((item, index) => (
										<div key={index} className="order-item-row">
											<div className="order-item-product">
												<div className="form-group">
													<label className="form-label">Produto</label>
													<select
														value={item.productId}
														onChange={(e) =>
															handleItemChange(index, "productId", e.target.value)
														}
														className="form-select"
														required
													>
														<option value="">Selecione</option>
														{products
															.filter((p) => p.isActive)
															.map((product) => (
																<option key={product.id} value={product.id}>
																	{product.name} - {formatCurrency(product.price)}
																</option>
															))}
													</select>
												</div>
												<button
													type="button"
													onClick={() => handleRemoveItem(index)}
													className="btn btn-danger btn-icon btn-sm"
												>
													<IconTrash size={16} />
												</button>
											</div>
											<div className="order-item-details">
												<div className="form-group">
													<label className="form-label">Qtd</label>
													<input
														type="number"
														value={item.quantity}
														onChange={(e) =>
															handleItemChange(index, "quantity", e.target.value)
														}
														className="form-input"
														min="1"
														required
													/>
												</div>
												<div className="form-group">
													<label className="form-label">Preço Unit.</label>
													<input
														type="number"
														value={item.unitPrice}
														onChange={(e) =>
															handleItemChange(index, "unitPrice", e.target.value)
														}
														className="form-input"
														min="0"
														step="0.01"
													/>
												</div>
												<div className="form-group">
													<label className="form-label">Desconto</label>
													<input
														type="number"
														value={item.discount}
														onChange={(e) =>
															handleItemChange(index, "discount", e.target.value)
														}
														className="form-input"
														min="0"
														step="0.01"
													/>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Desconto e Frete */}
						<div className="form-row">
							<div className="form-group">
								<label className="form-label">Desconto Geral (R$)</label>
								<input
									type="number"
									value={discount}
									onChange={(e) => setDiscount(e.target.value)}
									className="form-input"
									placeholder="0,00"
									min="0"
									step="0.01"
								/>
							</div>
							<div className="form-group">
								<label className="form-label">Frete (R$)</label>
								<input
									type="number"
									value={shipping}
									onChange={(e) => setShipping(e.target.value)}
									className="form-input"
									placeholder="0,00"
									min="0"
									step="0.01"
								/>
							</div>
						</div>

						{/* Método de Pagamento e Data */}
						<div className="form-row">
							<div className="form-group">
								<label className="form-label">Método de Pagamento</label>
								<select
									value={paymentMethod}
									onChange={(e) => setPaymentMethod(e.target.value)}
									className="form-select"
								>
									<option value="">Selecione</option>
									{PAYMENT_METHODS.map((method) => (
										<option key={method} value={method}>
											{method}
										</option>
									))}
								</select>
							</div>
							<div className="form-group">
								<label className="form-label">Data Limite de Envio</label>
								<input
									type="date"
									value={shipByDate}
									onChange={(e) => setShipByDate(e.target.value)}
									className="form-input"
								/>
							</div>
						</div>

						{/* Notas */}
						<div className="form-group">
							<label className="form-label">Observações</label>
							<textarea
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								className="form-textarea"
								placeholder="Observações do pedido"
								rows={3}
							/>
						</div>

						{/* Resumo */}
						<div className="order-summary">
							<div className="order-summary-row">
								<span>Subtotal:</span>
								<span>{formatCurrency(calculateSubtotal())}</span>
							</div>
							{parseFloat(discount) > 0 && (
								<div className="order-summary-row text-danger">
									<span>Desconto:</span>
									<span>-{formatCurrency(parseFloat(discount))}</span>
								</div>
							)}
							{parseFloat(shipping) > 0 && (
								<div className="order-summary-row">
									<span>Frete:</span>
									<span>{formatCurrency(parseFloat(shipping))}</span>
								</div>
							)}
							<div className="order-summary-row order-summary-total">
								<span>Total:</span>
								<span>{formatCurrency(calculateTotal())}</span>
							</div>
						</div>

						<div className="form-actions">
							<button
								type="button"
								onClick={() => navigate("/pedidos")}
								disabled={submitting}
								className="btn btn-secondary"
							>
								Cancelar
							</button>
							<button
								type="submit"
								disabled={submitting || items.length === 0}
								className="btn btn-primary"
							>
								{submitting ? "Salvando..." : "Salvar Alterações"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

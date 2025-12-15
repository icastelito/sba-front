import type { SalesOrderFilters, SortOrder, OrderStatus } from "../../types";
import { SearchInput, IconFilter, IconSort, IconClose, IconCalendar, IconCurrency, IconTruck } from "../ui";

interface SalesOrderFiltersProps {
	filters: SalesOrderFilters;
	onFiltersChange: (filters: SalesOrderFilters) => void;
}

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
	{ value: "PENDING", label: "Pendente" },
	{ value: "CONFIRMED", label: "Confirmado" },
	{ value: "PAID", label: "Pago" },
	{ value: "PROCESSING", label: "Em processamento" },
	{ value: "SHIPPED", label: "Enviado" },
	{ value: "DELIVERED", label: "Entregue" },
	{ value: "CANCELED", label: "Cancelado" },
	{ value: "REFUNDED", label: "Reembolsado" },
];

export function SalesOrderFiltersComponent({ filters, onFiltersChange }: SalesOrderFiltersProps) {
	const hasFilters =
		filters.search ||
		filters.status ||
		filters.dateFrom ||
		filters.dateTo ||
		filters.shipByDateFrom ||
		filters.shipByDateTo ||
		filters.totalMin ||
		filters.totalMax;

	return (
		<div className="filters-container">
			{/* Busca e Status */}
			<div className="filters-bar">
				<div className="filters-search">
					<SearchInput
						value={filters.search || ""}
						onChange={(search) => onFiltersChange({ ...filters, search, page: 1 })}
						placeholder="Buscar por número ou cliente..."
					/>
				</div>

				<div className="filters-group">
					<div className="form-group">
						<label className="form-label">
							<IconFilter size={14} />
							Status
						</label>
						<select
							value={filters.status || ""}
							onChange={(e) =>
								onFiltersChange({
									...filters,
									status: (e.target.value || undefined) as OrderStatus | undefined,
									page: 1,
								})
							}
							className="form-select"
						>
							<option value="">Todos</option>
							{STATUS_OPTIONS.map((status) => (
								<option key={status.value} value={status.value}>
									{status.label}
								</option>
							))}
						</select>
					</div>

					<div className="form-group">
						<label className="form-label">
							<IconSort size={14} />
							Ordenar por
						</label>
						<select
							value={`${filters.sortBy || "createdAt"}-${filters.sortOrder || "desc"}`}
							onChange={(e) => {
								const [sortBy, sortOrder] = e.target.value.split("-") as [
									SalesOrderFilters["sortBy"],
									SortOrder
								];
								onFiltersChange({ ...filters, sortBy, sortOrder });
							}}
							className="form-select"
						>
							<option value="createdAt-desc">Mais recentes</option>
							<option value="createdAt-asc">Mais antigos</option>
							<option value="orderNumber-desc">Nº Pedido (maior)</option>
							<option value="orderNumber-asc">Nº Pedido (menor)</option>
							<option value="total-desc">Maior valor</option>
							<option value="total-asc">Menor valor</option>
							<option value="shipByDate-asc">Envio mais próximo</option>
							<option value="shipByDate-desc">Envio mais distante</option>
						</select>
					</div>

					{hasFilters && (
						<button
							onClick={() =>
								onFiltersChange({
									page: 1,
									limit: filters.limit,
									sortBy: filters.sortBy,
									sortOrder: filters.sortOrder,
								})
							}
							className="btn btn-ghost btn-sm"
							style={{ alignSelf: "flex-end" }}
						>
							<IconClose size={16} />
							Limpar filtros
						</button>
					)}
				</div>
			</div>

			{/* Filtros avançados */}
			<div className="filters-advanced">
				{/* Data de Criação */}
				<fieldset className="filters-fieldset">
					<legend>
						<IconCalendar size={14} />
						Data de Criação
					</legend>
					<div className="filters-row">
						<div className="form-group">
							<label className="form-label">De</label>
							<input
								type="date"
								value={filters.dateFrom || ""}
								onChange={(e) =>
									onFiltersChange({ ...filters, dateFrom: e.target.value || undefined, page: 1 })
								}
								className="form-input"
							/>
						</div>
						<div className="form-group">
							<label className="form-label">Até</label>
							<input
								type="date"
								value={filters.dateTo || ""}
								onChange={(e) =>
									onFiltersChange({ ...filters, dateTo: e.target.value || undefined, page: 1 })
								}
								className="form-input"
							/>
						</div>
					</div>
				</fieldset>

				{/* Data Limite de Envio */}
				<fieldset className="filters-fieldset">
					<legend>
						<IconTruck size={14} />
						Data Limite de Envio
					</legend>
					<div className="filters-row">
						<div className="form-group">
							<label className="form-label">De</label>
							<input
								type="date"
								value={filters.shipByDateFrom || ""}
								onChange={(e) =>
									onFiltersChange({
										...filters,
										shipByDateFrom: e.target.value || undefined,
										page: 1,
									})
								}
								className="form-input"
							/>
						</div>
						<div className="form-group">
							<label className="form-label">Até</label>
							<input
								type="date"
								value={filters.shipByDateTo || ""}
								onChange={(e) =>
									onFiltersChange({ ...filters, shipByDateTo: e.target.value || undefined, page: 1 })
								}
								className="form-input"
							/>
						</div>
					</div>
				</fieldset>

				{/* Valor do Pedido */}
				<fieldset className="filters-fieldset">
					<legend>
						<IconCurrency size={14} />
						Valor do Pedido
					</legend>
					<div className="filters-row">
						<div className="form-group">
							<label className="form-label">Mínimo</label>
							<input
								type="number"
								placeholder="R$ 0,00"
								value={filters.totalMin || ""}
								onChange={(e) =>
									onFiltersChange({
										...filters,
										totalMin: e.target.value ? Number(e.target.value) : undefined,
										page: 1,
									})
								}
								className="form-input"
								min="0"
								step="0.01"
							/>
						</div>
						<div className="form-group">
							<label className="form-label">Máximo</label>
							<input
								type="number"
								placeholder="R$ 0,00"
								value={filters.totalMax || ""}
								onChange={(e) =>
									onFiltersChange({
										...filters,
										totalMax: e.target.value ? Number(e.target.value) : undefined,
										page: 1,
									})
								}
								className="form-input"
								min="0"
								step="0.01"
							/>
						</div>
					</div>
				</fieldset>
			</div>
		</div>
	);
}

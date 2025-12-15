import type { ClientFilters, SortOrder } from "../../types";
import { SearchInput, IconFilter, IconSort, IconClose } from "../ui";

interface ClientFiltersProps {
	filters: ClientFilters;
	cities: string[];
	states: string[];
	onFiltersChange: (filters: ClientFilters) => void;
}

export function ClientFiltersComponent({ filters, cities, states, onFiltersChange }: ClientFiltersProps) {
	const hasFilters = filters.search || filters.city || filters.state || filters.isActive !== undefined;

	return (
		<div className="filters-bar">
			<div className="filters-search">
				<SearchInput
					value={filters.search || ""}
					onChange={(search) => onFiltersChange({ ...filters, search, page: 1 })}
					placeholder="Buscar clientes..."
				/>
			</div>

			<div className="filters-group">
				<div className="form-group">
					<label className="form-label">Cidade</label>
					<select
						value={filters.city || ""}
						onChange={(e) => onFiltersChange({ ...filters, city: e.target.value || undefined, page: 1 })}
						className="form-select"
					>
						<option value="">Todas</option>
						{cities.map((city) => (
							<option key={city} value={city}>
								{city}
							</option>
						))}
					</select>
				</div>

				<div className="form-group">
					<label className="form-label">Estado</label>
					<select
						value={filters.state || ""}
						onChange={(e) => onFiltersChange({ ...filters, state: e.target.value || undefined, page: 1 })}
						className="form-select"
					>
						<option value="">Todos</option>
						{states.map((state) => (
							<option key={state} value={state}>
								{state}
							</option>
						))}
					</select>
				</div>

				<div className="form-group">
					<label className="form-label">
						<IconFilter size={14} />
						Status
					</label>
					<select
						value={filters.isActive === undefined ? "" : filters.isActive ? "true" : "false"}
						onChange={(e) => {
							const value = e.target.value;
							onFiltersChange({
								...filters,
								isActive: value === "" ? undefined : value === "true",
								page: 1,
							});
						}}
						className="form-select"
					>
						<option value="">Todos</option>
						<option value="true">Ativos</option>
						<option value="false">Inativos</option>
					</select>
				</div>

				<div className="form-group">
					<label className="form-label">
						<IconSort size={14} />
						Ordenar
					</label>
					<select
						value={`${filters.sortBy || "createdAt"}-${filters.sortOrder || "desc"}`}
						onChange={(e) => {
							const [sortBy, sortOrder] = e.target.value.split("-") as [
								ClientFilters["sortBy"],
								SortOrder
							];
							onFiltersChange({ ...filters, sortBy, sortOrder });
						}}
						className="form-select"
					>
						<option value="createdAt-desc">Mais recentes</option>
						<option value="createdAt-asc">Mais antigos</option>
						<option value="name-asc">Nome A-Z</option>
						<option value="name-desc">Nome Z-A</option>
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
						Limpar
					</button>
				)}
			</div>
		</div>
	);
}

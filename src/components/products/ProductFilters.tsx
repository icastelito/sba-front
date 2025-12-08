import type { ProductFilters, SortOrder } from "../../types";
import { SearchInput, IconFilter, IconSort, IconTag, IconClose, IconEye } from "../ui";

interface ProductFiltersProps {
	filters: ProductFilters;
	categories: string[];
	badges: string[];
	onFiltersChange: (filters: ProductFilters) => void;
}

export function ProductFiltersComponent({ filters, categories, badges, onFiltersChange }: ProductFiltersProps) {
	const hasFilters =
		filters.search ||
		filters.category ||
		filters.badge ||
		filters.isActive !== undefined ||
		filters.isPublic !== undefined ||
		filters.minPrice ||
		filters.maxPrice;

	return (
		<div className="filters-bar">
			<div className="filters-search">
				<SearchInput
					value={filters.search || ""}
					onChange={(search) => onFiltersChange({ ...filters, search, page: 1 })}
					placeholder="Buscar produtos..."
				/>
			</div>

			<div className="filters-group">
				<div className="form-group">
					<label className="form-label">
						<IconTag size={14} />
						Categoria
					</label>
					<select
						value={filters.category || ""}
						onChange={(e) =>
							onFiltersChange({ ...filters, category: e.target.value || undefined, page: 1 })
						}
						className="form-select"
					>
						<option value="">Todas</option>
						{categories.map((cat) => (
							<option key={cat} value={cat}>
								{cat}
							</option>
						))}
					</select>
				</div>

				<div className="form-group">
					<label className="form-label">
						<IconTag size={14} />
						Badge
					</label>
					<select
						value={filters.badge || ""}
						onChange={(e) => onFiltersChange({ ...filters, badge: e.target.value || undefined, page: 1 })}
						className="form-select"
					>
						<option value="">Todos</option>
						{badges.map((badge) => (
							<option key={badge} value={badge}>
								{badge}
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
						<IconEye size={14} />
						Visibilidade
					</label>
					<select
						value={filters.isPublic === undefined ? "" : filters.isPublic ? "true" : "false"}
						onChange={(e) => {
							const value = e.target.value;
							onFiltersChange({
								...filters,
								isPublic: value === "" ? undefined : value === "true",
								page: 1,
							});
						}}
						className="form-select"
					>
						<option value="">Todos</option>
						<option value="true">Públicos</option>
						<option value="false">Privados</option>
					</select>
				</div>

				<div className="form-group">
					<label className="form-label">Preço mín.</label>
					<input
						type="number"
						placeholder="R$ 0,00"
						value={filters.minPrice || ""}
						onChange={(e) =>
							onFiltersChange({
								...filters,
								minPrice: e.target.value ? Number(e.target.value) : undefined,
								page: 1,
							})
						}
						className="form-input"
						min="0"
						step="0.01"
					/>
				</div>

				<div className="form-group">
					<label className="form-label">Preço máx.</label>
					<input
						type="number"
						placeholder="R$ 0,00"
						value={filters.maxPrice || ""}
						onChange={(e) =>
							onFiltersChange({
								...filters,
								maxPrice: e.target.value ? Number(e.target.value) : undefined,
								page: 1,
							})
						}
						className="form-input"
						min="0"
						step="0.01"
					/>
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
								ProductFilters["sortBy"],
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
						<option value="price-asc">Menor preço</option>
						<option value="price-desc">Maior preço</option>
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

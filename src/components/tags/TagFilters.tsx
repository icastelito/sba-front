import type { TagFilters, SortOrder } from "../../types";
import { SearchInput, IconFilter, IconSort, IconClose } from "../ui";

interface TagFiltersProps {
	filters: TagFilters;
	onFiltersChange: (filters: TagFilters) => void;
}

export function TagFiltersBar({ filters, onFiltersChange }: TagFiltersProps) {
	const handleSearch = (search: string) => {
		onFiltersChange({ ...filters, search: search || undefined, page: 1 });
	};

	const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;
		onFiltersChange({
			...filters,
			isActive: value === "" ? undefined : value === "true",
			page: 1,
		});
	};

	const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const [sortBy, sortOrder] = e.target.value.split("-") as [TagFilters["sortBy"], SortOrder];
		onFiltersChange({ ...filters, sortBy, sortOrder, page: 1 });
	};

	const clearFilters = () => {
		onFiltersChange({ limit: filters.limit });
	};

	const hasActiveFilters = filters.search || filters.isActive !== undefined;

	return (
		<div className="filters-bar">
			<div className="filters-search">
				<SearchInput value={filters.search || ""} onChange={handleSearch} placeholder="Buscar tags..." />
			</div>

			<div className="filters-group">
				<div className="form-group">
					<label className="form-label">
						<IconFilter size={14} />
						Status
					</label>
					<select
						value={filters.isActive === undefined ? "" : String(filters.isActive)}
						onChange={handleStatusChange}
						className="form-select"
					>
						<option value="">Todos os status</option>
						<option value="true">Ativas</option>
						<option value="false">Inativas</option>
					</select>
				</div>

				<div className="form-group">
					<label className="form-label">
						<IconSort size={14} />
						Ordenar
					</label>
					<select
						value={`${filters.sortBy || "name"}-${filters.sortOrder || "asc"}`}
						onChange={handleSortChange}
						className="form-select"
					>
						<option value="name-asc">Nome (A-Z)</option>
						<option value="name-desc">Nome (Z-A)</option>
						<option value="createdAt-desc">Mais recentes</option>
						<option value="createdAt-asc">Mais antigas</option>
					</select>
				</div>

				{hasActiveFilters && (
					<button onClick={clearFilters} className="btn btn-ghost btn-sm">
						<IconClose size={14} />
						<span>Limpar</span>
					</button>
				)}
			</div>
		</div>
	);
}

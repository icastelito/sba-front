import type { RequesterFilters } from "../../hooks/useRequesters";
import { SearchInput, IconFilter, IconUsers } from "../ui";

interface RequesterFiltersProps {
	filters: RequesterFilters;
	onChange: (filters: RequesterFilters) => void;
}

export function RequesterFiltersBar({ filters, onChange }: RequesterFiltersProps) {
	const handleChange = (field: keyof RequesterFilters, value: unknown) => {
		onChange({ ...filters, [field]: value, page: 1 });
	};

	return (
		<div className="filters-bar">
			<div className="filters-search">
				<SearchInput
					value={filters.search || ""}
					onChange={(value) => handleChange("search", value || undefined)}
					placeholder="Buscar demandantes..."
				/>
			</div>

			<div className="filters-group">
				<div className="form-group">
					<label className="form-label">
						<IconFilter size={14} />
						Status
					</label>
					<select
						value={filters.isActive === undefined ? "" : filters.isActive ? "true" : "false"}
						onChange={(e) => {
							const value = e.target.value;
							handleChange("isActive", value === "" ? undefined : value === "true");
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
						<IconUsers size={14} />
						Departamento
					</label>
					<input
						type="text"
						value={filters.department || ""}
						onChange={(e) => handleChange("department", e.target.value || undefined)}
						placeholder="Filtrar por departamento"
						className="form-input"
					/>
				</div>
			</div>
		</div>
	);
}

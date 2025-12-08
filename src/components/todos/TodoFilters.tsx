import type { TodoFilters, TaskStatus, Requester } from "../../types";
import { TaskStatus as TaskStatusEnum } from "../../types";
import { SearchInput, IconFilter, IconSort, IconUser, IconTag, IconCalendar } from "../ui";

interface TodoFiltersProps {
	filters: TodoFilters;
	requesters: Requester[];
	onChange: (filters: TodoFilters) => void;
}

export function TodoFiltersBar({ filters, requesters, onChange }: TodoFiltersProps) {
	const handleChange = (field: keyof TodoFilters, value: unknown) => {
		onChange({ ...filters, [field]: value, page: 1 });
	};

	return (
		<div className="filters-bar">
			<div className="filters-search">
				<SearchInput
					value={filters.search || ""}
					onChange={(value) => handleChange("search", value || undefined)}
					placeholder="Buscar tarefas..."
				/>
			</div>

			<div className="filters-group">
				<div className="form-group">
					<label className="form-label">
						<IconFilter size={14} />
						Status
					</label>
					<select
						value={filters.status || TaskStatusEnum.ALL}
						onChange={(e) => handleChange("status", (e.target.value as TaskStatus) || undefined)}
						className="form-select"
					>
						<option value={TaskStatusEnum.ALL}>Todas</option>
						<option value={TaskStatusEnum.PENDING}>Pendentes</option>
						<option value={TaskStatusEnum.COMPLETED}>Concluídas</option>
					</select>
				</div>

				<div className="form-group">
					<label className="form-label">
						<IconUser size={14} />
						Demandante
					</label>
					<select
						value={filters.requesterId || ""}
						onChange={(e) =>
							handleChange("requesterId", e.target.value ? Number(e.target.value) : undefined)
						}
						className="form-select"
					>
						<option value="">Todos os demandantes</option>
						{requesters.map((requester) => (
							<option key={requester.id} value={requester.id}>
								{requester.name}
							</option>
						))}
					</select>
				</div>

				<div className="form-group">
					<label className="form-label">
						<IconTag size={14} />
						Tag
					</label>
					<input
						type="text"
						value={filters.tag || ""}
						onChange={(e) => handleChange("tag", e.target.value || undefined)}
						placeholder="Filtrar por tag"
						className="form-input"
					/>
				</div>

				<div className="form-group">
					<label className="form-label">
						<IconCalendar size={14} />
						De
					</label>
					<input
						type="date"
						value={filters.dueDateFrom || ""}
						onChange={(e) => handleChange("dueDateFrom", e.target.value || undefined)}
						className="form-input"
					/>
				</div>

				<div className="form-group">
					<label className="form-label">
						<IconCalendar size={14} />
						Até
					</label>
					<input
						type="date"
						value={filters.dueDateTo || ""}
						onChange={(e) => handleChange("dueDateTo", e.target.value || undefined)}
						className="form-input"
					/>
				</div>

				<div className="form-group">
					<label className="form-label">
						<IconSort size={14} />
						Ordenar
					</label>
					<select
						value={`${filters.sortBy || "dueDate"}-${filters.sortOrder || "asc"}`}
						onChange={(e) => {
							const [sortBy, sortOrder] = e.target.value.split("-") as [
								TodoFilters["sortBy"],
								TodoFilters["sortOrder"]
							];
							onChange({ ...filters, sortBy, sortOrder });
						}}
						className="form-select"
					>
						<option value="dueDate-asc">Data venc. crescente</option>
						<option value="dueDate-desc">Data venc. decrescente</option>
						<option value="createdAt-desc">Mais recentes</option>
						<option value="createdAt-asc">Mais antigos</option>
						<option value="title-asc">Título A-Z</option>
						<option value="title-desc">Título Z-A</option>
					</select>
				</div>
			</div>
		</div>
	);
}

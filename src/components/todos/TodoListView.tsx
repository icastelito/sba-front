import type { Todo } from "../../types";
import { formatDate, formatDateTime, isOverdue, isDueToday } from "../../lib/utils";
import { IconEdit, IconTrash, IconCalendar, IconUser, IconCheck, IconWarning, IconClock } from "../ui";

interface TodoListViewProps {
	todos: Todo[];
	onComplete: (todo: Todo) => void;
	onReopen: (id: string) => void;
	onEdit: (todo: Todo) => void;
	onDelete: (id: string) => void;
}

export function TodoListView({ todos, onComplete, onReopen, onEdit, onDelete }: TodoListViewProps) {
	return (
		<div className="todo-list-view">
			<table className="todo-table">
				<thead>
					<tr>
						<th style={{ width: "40px" }}></th>
						<th>Título</th>
						<th style={{ width: "130px" }}>Vencimento</th>
						<th style={{ width: "150px" }}>Responsável</th>
						<th style={{ width: "120px" }}>Status</th>
						<th style={{ width: "100px" }}>Ações</th>
					</tr>
				</thead>
				<tbody>
					{todos.map((todo) => {
						const overdue = isOverdue(todo.dueDate) && !todo.completed;
						const dueToday = isDueToday(todo.dueDate) && !todo.completed;

						return (
							<tr
								key={todo.id}
								className={[
									todo.completed && "todo-row-completed",
									overdue && "todo-row-overdue",
									dueToday && "todo-row-due-today",
								]
									.filter(Boolean)
									.join(" ")}
							>
								<td>
									<label className="todo-checkbox todo-checkbox-small">
										<input
											type="checkbox"
											checked={todo.completed}
											onChange={() => (todo.completed ? onReopen(todo.id) : onComplete(todo))}
										/>
										<span className="todo-checkbox-custom">
											{todo.completed && <IconCheck size={12} />}
										</span>
									</label>
								</td>
								<td>
									<div className="todo-list-title">
										<span className={todo.completed ? "todo-title-completed" : ""}>
											{todo.title}
										</span>
										{todo.description && (
											<span className="todo-list-description">{todo.description}</span>
										)}
									</div>
								</td>
								<td>
									{todo.dueDate && (
										<span className={`todo-date ${overdue ? "todo-date-overdue" : ""}`}>
											<IconCalendar size={14} />
											{formatDate(todo.dueDate)}
										</span>
									)}
								</td>
								<td>
									{todo.assignedTo && (
										<span className="todo-assignee">
											<IconUser size={14} />
											{todo.assignedTo}
										</span>
									)}
								</td>
								<td>
									{overdue && (
										<span className="badge badge-danger badge-sm">
											<IconWarning size={12} />
											Atrasada
										</span>
									)}
									{dueToday && !overdue && (
										<span className="badge badge-warning badge-sm">
											<IconClock size={12} />
											Hoje
										</span>
									)}
									{todo.completed && (
										<span className="badge badge-success badge-sm">
											<IconCheck size={12} />
											Concluída
										</span>
									)}
									{!overdue && !dueToday && !todo.completed && (
										<span className="badge badge-secondary badge-sm">Pendente</span>
									)}
								</td>
								<td>
									<div className="todo-list-actions">
										<button
											onClick={() => onEdit(todo)}
											className="btn btn-ghost btn-icon btn-sm"
											aria-label="Editar"
										>
											<IconEdit size={16} />
										</button>
										<button
											onClick={() => onDelete(todo.id)}
											className="btn btn-ghost btn-icon btn-icon-danger btn-sm"
											aria-label="Excluir"
										>
											<IconTrash size={16} />
										</button>
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

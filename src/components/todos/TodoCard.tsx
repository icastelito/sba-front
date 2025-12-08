import type { Todo } from "../../types";
import { formatDate, formatDateTime, isOverdue, isDueToday } from "../../lib/utils";
import {
	IconEdit,
	IconTrash,
	IconCalendar,
	IconUser,
	IconCheck,
	IconTemplate,
	IconTag,
	IconWarning,
	IconClock,
} from "../ui";

interface TodoCardProps {
	todo: Todo;
	onComplete: (id: string) => void;
	onReopen: (id: string) => void;
	onEdit: (todo: Todo) => void;
	onDelete: (id: string) => void;
}

export function TodoCard({ todo, onComplete, onReopen, onEdit, onDelete }: TodoCardProps) {
	const overdue = isOverdue(todo.dueDate) && !todo.completed;
	const dueToday = isDueToday(todo.dueDate) && !todo.completed;

	const cardClass = [
		"card",
		"todo-card",
		todo.completed && "todo-card-completed",
		overdue && "todo-card-overdue",
		dueToday && "todo-card-due-today",
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div className={cardClass}>
			<div className="todo-card-content">
				<label className="todo-checkbox">
					<input
						type="checkbox"
						checked={todo.completed}
						onChange={() => (todo.completed ? onReopen(todo.id) : onComplete(todo.id))}
					/>
					<span className="todo-checkbox-custom">{todo.completed && <IconCheck size={14} />}</span>
				</label>

				<div className="todo-card-body">
					<div className="todo-card-header">
						<h3 className={`todo-card-title ${todo.completed ? "todo-card-title-completed" : ""}`}>
							{todo.title}
						</h3>
						<div className="todo-card-badges">
							{overdue && (
								<span className="badge badge-danger">
									<IconWarning size={12} />
									<span>Atrasada</span>
								</span>
							)}
							{dueToday && (
								<span className="badge badge-warning">
									<IconClock size={12} />
									<span>Vence hoje</span>
								</span>
							)}
							{todo.completed && (
								<span className="badge badge-success">
									<IconCheck size={12} />
									<span>Concluída</span>
								</span>
							)}
						</div>
					</div>

					{todo.description && <p className="todo-card-description">{todo.description}</p>}

					<div className="todo-card-meta">
						{todo.dueDate && (
							<span className={`todo-meta-item ${overdue ? "todo-meta-overdue" : ""}`}>
								<IconCalendar size={14} />
								{formatDate(todo.dueDate)}
							</span>
						)}
						{todo.assignedTo && (
							<span className="todo-meta-item">
								<IconUser size={14} />
								{todo.assignedTo}
							</span>
						)}
						{todo.completedAt && (
							<span className="todo-meta-item todo-meta-completed">
								<IconCheck size={14} />
								Concluída em {formatDateTime(todo.completedAt)}
							</span>
						)}
						{todo.template && (
							<span className="todo-meta-item todo-meta-template">
								<IconTemplate size={14} />
								{todo.template.title}
							</span>
						)}
					</div>

					{todo.tags.length > 0 && (
						<div className="todo-card-tags">
							{todo.tags.map((tag) => (
								<span key={tag} className="tag">
									<IconTag size={12} />
									{tag}
								</span>
							))}
						</div>
					)}
				</div>

				<div className="todo-card-actions">
					<button onClick={() => onEdit(todo)} className="btn btn-ghost btn-icon" aria-label="Editar tarefa">
						<IconEdit size={18} />
					</button>
					<button
						onClick={() => onDelete(todo.id)}
						className="btn btn-ghost btn-icon btn-icon-danger"
						aria-label="Excluir tarefa"
					>
						<IconTrash size={18} />
					</button>
				</div>
			</div>
		</div>
	);
}

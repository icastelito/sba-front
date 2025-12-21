import { useEffect, useState, useCallback } from "react";
import { useTodos } from "../../hooks";
import type { Todo, TodoFilters, CreateTodoDto, UpdateTodoDto } from "../../types";
import {
	Modal,
	ConfirmDialog,
	Loading,
	ErrorMessage,
	IconPlus,
	IconTasks,
	Pagination,
	IconGrid,
	IconList,
} from "../ui";
import { TodoCard } from "./TodoCard";
import { TodoListView } from "./TodoListView";
import { TodoForm } from "./TodoForm";
import { TodoFiltersBar } from "./TodoFilters";
import { TodoStatsBar } from "./TodoStats";
import { TodoCompleteModal } from "./TodoCompleteModal";

type ViewMode = "grid" | "list";

export function TodoList() {
	const {
		todos,
		loading,
		error,
		pagination,
		requesters,
		fetchTodos,
		fetchRequesters,
		createTodo,
		updateTodo,
		completeTodoOptimistic,
		reopenTodoOptimistic,
		deleteTodo,
	} = useTodos();

	const [filters, setFilters] = useState<TodoFilters>({
		limit: 20,
		sortBy: "dueDate",
		sortOrder: "asc",
	});

	const [modalOpen, setModalOpen] = useState(false);
	const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
	const [deleteConfirm, setDeleteConfirm] = useState<Todo | null>(null);
	const [completeConfirm, setCompleteConfirm] = useState<Todo | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [statsKey, setStatsKey] = useState(0);
	const [viewMode, setViewMode] = useState<ViewMode>("grid");

	const loadTodos = useCallback(() => {
		fetchTodos(filters);
	}, [fetchTodos, filters]);

	useEffect(() => {
		loadTodos();
	}, [loadTodos]);

	useEffect(() => {
		fetchRequesters();
	}, [fetchRequesters]);

	const handleFiltersChange = (newFilters: TodoFilters) => {
		setFilters(newFilters);
	};

	const handleCreate = () => {
		setEditingTodo(null);
		setModalOpen(true);
	};

	const handleEdit = (todo: Todo) => {
		setEditingTodo(todo);
		setModalOpen(true);
	};

	const handleSubmit = async (data: CreateTodoDto | UpdateTodoDto) => {
		setSubmitting(true);
		try {
			if (editingTodo) {
				await updateTodo(editingTodo.id, data as UpdateTodoDto);
			} else {
				await createTodo(data as CreateTodoDto);
			}
			setModalOpen(false);
			loadTodos();
			setStatsKey((k) => k + 1);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erro ao salvar";
			if (message.includes("409") || message.includes("modificada")) {
				alert("⚠️ Esta tarefa foi modificada. Recarregue e tente novamente.");
			} else {
				alert(message);
			}
		} finally {
			setSubmitting(false);
		}
	};

	const handleComplete = (todo: Todo) => {
		setCompleteConfirm(todo);
	};

	const handleConfirmComplete = async (completedAt?: string) => {
		if (!completeConfirm) return;
		try {
			await completeTodoOptimistic(completeConfirm.id, completedAt);
			setCompleteConfirm(null);
			setStatsKey((k) => k + 1);
		} catch (err) {
			alert(err instanceof Error ? err.message : "Erro ao concluir tarefa");
		}
	};

	const handleReopen = async (id: string) => {
		try {
			await reopenTodoOptimistic(id);
			setStatsKey((k) => k + 1);
		} catch (err) {
			alert(err instanceof Error ? err.message : "Erro ao reabrir tarefa");
		}
	};

	const handleDelete = async () => {
		if (!deleteConfirm) return;
		try {
			await deleteTodo(deleteConfirm.id);
			setDeleteConfirm(null);
			loadTodos();
			setStatsKey((k) => k + 1);
		} catch (err) {
			alert(err instanceof Error ? err.message : "Erro ao excluir");
		}
	};

	return (
		<div className="page">
			<div className="page-header">
				<div className="page-title-group">
					<IconTasks size={28} className="page-icon" />
					<h1 className="page-title">Tarefas</h1>
				</div>
				<div className="page-header-actions">
					<div className="view-toggle">
						<button
							onClick={() => setViewMode("grid")}
							className={`btn btn-icon ${viewMode === "grid" ? "btn-primary" : "btn-ghost"}`}
							aria-label="Visualização em grid"
							title="Cards"
						>
							<IconGrid size={18} />
						</button>
						<button
							onClick={() => setViewMode("list")}
							className={`btn btn-icon ${viewMode === "list" ? "btn-primary" : "btn-ghost"}`}
							aria-label="Visualização em lista"
							title="Lista"
						>
							<IconList size={18} />
						</button>
					</div>
					<button onClick={handleCreate} className="btn btn-primary">
						<IconPlus size={18} />
						<span>Nova Tarefa</span>
					</button>
				</div>
			</div>

			<TodoStatsBar key={statsKey} />

			<TodoFiltersBar filters={filters} requesters={requesters} onChange={handleFiltersChange} />

			<div className="todo-content">
				{loading && todos.length === 0 && <Loading />}
				{error && <ErrorMessage message={error} onRetry={loadTodos} />}

				{!loading && !error && todos.length === 0 && (
					<div className="empty-state">
						<IconTasks size={48} className="empty-state-icon" />
						<p className="empty-state-title">Nenhuma tarefa encontrada</p>
						<p className="empty-state-description">Crie uma nova tarefa ou ajuste os filtros de busca</p>
					</div>
				)}

				{viewMode === "grid" ? (
					<div className="todo-grid">
						{todos.map((todo) => (
							<TodoCard
								key={todo.id}
								todo={todo}
								onComplete={() => handleComplete(todo)}
								onReopen={() => handleReopen(todo.id)}
								onEdit={handleEdit}
								onDelete={(id) => setDeleteConfirm(todos.find((t) => t.id === id) || null)}
							/>
						))}
					</div>
				) : (
					<TodoListView
						todos={todos}
						onComplete={handleComplete}
						onReopen={handleReopen}
						onEdit={handleEdit}
						onDelete={(id) => setDeleteConfirm(todos.find((t) => t.id === id) || null)}
					/>
				)}
			</div>

			<Pagination meta={pagination} onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))} />

			<Modal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				title={editingTodo ? "Editar Tarefa" : "Nova Tarefa"}
			>
				<TodoForm
					todo={editingTodo}
					requesters={requesters}
					onSubmit={handleSubmit}
					onCancel={() => setModalOpen(false)}
					loading={submitting}
				/>
			</Modal>

			<TodoCompleteModal
				isOpen={!!completeConfirm}
				todoTitle={completeConfirm?.title || ""}
				onClose={() => setCompleteConfirm(null)}
				onConfirm={handleConfirmComplete}
			/>

			<ConfirmDialog
				isOpen={!!deleteConfirm}
				onClose={() => setDeleteConfirm(null)}
				onConfirm={handleDelete}
				title="Excluir Tarefa"
				message={`Tem certeza que deseja excluir "${deleteConfirm?.title}"? Esta ação não pode ser desfeita.`}
				confirmText="Excluir"
				isDestructive
			/>
		</div>
	);
}

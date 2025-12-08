import { useState, useCallback } from "react";
import { api } from "../lib/api";
import { buildQueryParams } from "../lib/utils";
import type {
	Todo,
	CreateTodoDto,
	UpdateTodoDto,
	CompleteTodoDto,
	TodoFilters,
	TodoStats,
	OffsetPaginatedResponse,
	PaginationMeta,
	ApiResponse,
	Requester,
} from "../types";

export function useTodos() {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [pagination, setPagination] = useState<PaginationMeta | null>(null);
	const [requesters, setRequesters] = useState<Requester[]>([]);

	const fetchTodos = useCallback(async (filters: TodoFilters = {}) => {
		setLoading(true);
		setError(null);
		try {
			const query = buildQueryParams(filters as Record<string, unknown>);
			const response = await api.get<OffsetPaginatedResponse<Todo>>(`/todos?${query}`);

			setTodos(response.data);
			setPagination(response.meta);
			return response;
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erro ao carregar tarefas";
			setError(message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchRequesters = useCallback(async () => {
		try {
			const response = await api.get<OffsetPaginatedResponse<Requester>>("/requesters?isActive=true&limit=100");
			setRequesters(response.data);
			return response.data;
		} catch (err) {
			console.error("Erro ao carregar demandantes:", err);
			return [];
		}
	}, []);

	const getTodo = useCallback(async (id: string) => {
		const response = await api.get<ApiResponse<Todo>>(`/todos/${id}`);
		return response.data;
	}, []);

	const createTodo = useCallback(async (data: CreateTodoDto) => {
		const response = await api.post<ApiResponse<Todo>>("/todos", data);
		return response.data;
	}, []);

	const updateTodo = useCallback(async (id: string, data: UpdateTodoDto) => {
		const response = await api.put<ApiResponse<Todo>>(`/todos/${id}`, data);
		return response.data;
	}, []);

	const completeTodo = useCallback(async (id: string, data: CompleteTodoDto) => {
		const response = await api.patch<ApiResponse<Todo>>(`/todos/${id}/complete`, data);
		return response.data;
	}, []);

	const deleteTodo = useCallback(async (id: string) => {
		await api.delete(`/todos/${id}`);
	}, []);

	const deleteTodos = useCallback(async (ids: string[]) => {
		await api.delete("/todos", { ids });
	}, []);

	const getStats = useCallback(async (assignedTo?: string) => {
		const query = assignedTo ? `?assignedTo=${assignedTo}` : "";
		const response = await api.get<ApiResponse<TodoStats>>(`/todos/stats${query}`);
		return response.data;
	}, []);

	// Atualização otimista para completar tarefa
	const completeTodoOptimistic = useCallback(
		async (id: string, completedAt?: string) => {
			const previousTodos = [...todos];

			// Atualiza UI imediatamente
			setTodos((prev) =>
				prev.map((t) =>
					t.id === id ? { ...t, completed: true, completedAt: completedAt || new Date().toISOString() } : t
				)
			);

			try {
				return await completeTodo(id, { completed: true, completedAt });
			} catch (err) {
				// Reverte em caso de erro
				setTodos(previousTodos);
				throw err;
			}
		},
		[todos, completeTodo]
	);

	// Atualização otimista para reabrir tarefa
	const reopenTodoOptimistic = useCallback(
		async (id: string) => {
			const previousTodos = [...todos];

			setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: false, completedAt: undefined } : t)));

			try {
				return await completeTodo(id, { completed: false });
			} catch (err) {
				setTodos(previousTodos);
				throw err;
			}
		},
		[todos, completeTodo]
	);

	return {
		todos,
		loading,
		error,
		pagination,
		requesters,
		fetchTodos,
		fetchRequesters,
		getTodo,
		createTodo,
		updateTodo,
		completeTodo,
		deleteTodo,
		deleteTodos,
		getStats,
		completeTodoOptimistic,
		reopenTodoOptimistic,
	};
}

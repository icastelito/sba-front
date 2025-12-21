import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTodos } from "../hooks";
import type { Todo, CreateTodoDto, UpdateTodoDto, Template } from "../types";
import { TemplateSelect } from "../components/templates";
import {
	TagSelect,
	Loading,
	ErrorMessage,
	IconTemplate,
	IconCalendar,
	IconUser,
	IconTag,
	IconInfo,
	IconArrowLeft,
} from "../components/ui";
import { addDays, toISODateString, toDatetimeLocal } from "../lib/utils";

export function TodoCreatePage() {
	const navigate = useNavigate();
	const { createTodo, requesters, fetchRequesters } = useTodos();

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		dueDate: "",
		assignedTo: "",
		requesterId: null as number | null,
		tags: [] as string[],
		templateId: null as string | null,
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		fetchRequesters();
	}, [fetchRequesters]);

	const handleTemplateSelect = (template: Template | null) => {
		if (template) {
			const newDueDate = template.defaultDueDays
				? toISODateString(addDays(new Date(), template.defaultDueDays))
				: formData.dueDate;

			setFormData((prev) => ({
				...prev,
				title: template.title,
				description: template.description || "",
				dueDate: newDueDate,
				tags: template.tags,
				templateId: template.id,
			}));
		} else {
			setFormData((prev) => ({ ...prev, templateId: null }));
		}
	};

	const validate = () => {
		const newErrors: Record<string, string> = {};
		if (!formData.title.trim() && !formData.templateId) {
			newErrors.title = "Título é obrigatório";
		}
		if (formData.title.length > 200) {
			newErrors.title = "Título deve ter no máximo 200 caracteres";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		setSubmitting(true);
		try {
			const data: CreateTodoDto = {
				title: formData.title.trim() || undefined,
				description: formData.description.trim() || undefined,
				templateId: formData.templateId || undefined,
				dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
				assignedTo: formData.assignedTo.trim() || undefined,
				requesterId: formData.requesterId || undefined,
				tags: formData.tags.length > 0 ? formData.tags : undefined,
			};
			await createTodo(data);
			navigate("/tarefas");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erro ao criar tarefa";
			alert(message);
		} finally {
			setSubmitting(false);
		}
	};

	const handleChange = (field: string, value: string | string[] | number | null) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	return (
		<div className="page">
			<div className="page-header">
				<div className="page-header-content">
					<button onClick={() => navigate("/tarefas")} className="btn btn-ghost btn-sm">
						<IconArrowLeft size={16} />
						Voltar
					</button>
					<h1 className="page-title">Nova Tarefa</h1>
				</div>
			</div>

			<div className="page-content">
				<div className="form-page-container">
					<form onSubmit={handleSubmit} className="form">
						<div className="form-group">
							<label className="form-label">
								<IconTemplate size={14} />
								Usar template
							</label>
							<TemplateSelect
								value={formData.templateId}
								onChange={handleTemplateSelect}
								placeholder="Selecione um template (opcional)..."
							/>
							<p className="form-hint">
								<IconInfo size={12} />
								Ao selecionar um template, os campos serão preenchidos automaticamente
							</p>
						</div>

						<div className="form-group">
							<label className="form-label">
								Título {!formData.templateId && <span className="form-required">*</span>}
							</label>
							<input
								type="text"
								value={formData.title}
								onChange={(e) => handleChange("title", e.target.value)}
								className={`form-input ${errors.title ? "form-input-error" : ""}`}
								placeholder="Título da tarefa"
								maxLength={200}
							/>
							{errors.title && <span className="form-error">{errors.title}</span>}
						</div>

						<div className="form-group">
							<label className="form-label">Descrição</label>
							<textarea
								value={formData.description}
								onChange={(e) => handleChange("description", e.target.value)}
								className="form-textarea"
								placeholder="Descrição da tarefa..."
								maxLength={2000}
							/>
						</div>

						<div className="form-row">
							<div className="form-group">
								<label className="form-label">
									<IconCalendar size={14} />
									Data de vencimento
								</label>
								<input
									type="datetime-local"
									value={formData.dueDate}
									onChange={(e) => handleChange("dueDate", e.target.value)}
									className="form-input"
								/>
							</div>

							<div className="form-group">
								<label className="form-label">
									<IconUser size={14} />
									Demandante
								</label>
								<select
									value={formData.requesterId || ""}
									onChange={(e) =>
										handleChange("requesterId", e.target.value ? Number(e.target.value) : null)
									}
									className="form-select"
								>
									<option value="">Selecione um demandante</option>
									{requesters.map((requester) => (
										<option key={requester.id} value={requester.id}>
											{requester.name}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="form-group">
							<label className="form-label">
								<IconUser size={14} />
								Responsável
							</label>
							<input
								type="text"
								value={formData.assignedTo}
								onChange={(e) => handleChange("assignedTo", e.target.value)}
								className="form-input"
								placeholder="email@exemplo.com"
							/>
						</div>

						<div className="form-group">
							<label className="form-label">
								<IconTag size={14} />
								Tags
							</label>
							<TagSelect
								value={formData.tags}
								onChange={(tags) => handleChange("tags", tags)}
								placeholder="Selecionar tags..."
							/>
						</div>

						<div className="form-actions">
							<button
								type="button"
								onClick={() => navigate("/tarefas")}
								disabled={submitting}
								className="btn btn-secondary"
							>
								Cancelar
							</button>
							<button type="submit" disabled={submitting} className="btn btn-primary">
								{submitting ? "Criando..." : "Criar Tarefa"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export function TodoEditPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { getTodo, updateTodo, requesters, fetchRequesters } = useTodos();

	const [todo, setTodo] = useState<Todo | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		dueDate: "",
		assignedTo: "",
		requesterId: null as number | null,
		tags: [] as string[],
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		fetchRequesters();
	}, [fetchRequesters]);

	useEffect(() => {
		const loadTodo = async () => {
			if (!id) return;
			setLoading(true);
			try {
				const data = await getTodo(id);
				setTodo(data);
				setFormData({
					title: data.title,
					description: data.description || "",
					dueDate: data.dueDate ? toDatetimeLocal(new Date(data.dueDate)) : "",
					assignedTo: data.assignedTo || "",
					requesterId: data.requesterId || null,
					tags: data.tags,
				});
			} catch (err) {
				setError(err instanceof Error ? err.message : "Erro ao carregar tarefa");
			} finally {
				setLoading(false);
			}
		};
		loadTodo();
	}, [id, getTodo]);

	const validate = () => {
		const newErrors: Record<string, string> = {};
		if (!formData.title.trim()) {
			newErrors.title = "Título é obrigatório";
		}
		if (formData.title.length > 200) {
			newErrors.title = "Título deve ter no máximo 200 caracteres";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate() || !todo) return;

		setSubmitting(true);
		try {
			const data: UpdateTodoDto = {
				title: formData.title.trim() || undefined,
				description: formData.description.trim() || undefined,
				dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
				assignedTo: formData.assignedTo.trim() || undefined,
				tags: formData.tags.length > 0 ? formData.tags : undefined,
				version: todo.version,
			};
			await updateTodo(todo.id, data);
			navigate("/tarefas");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erro ao atualizar tarefa";
			if (message.includes("409") || message.includes("modificada")) {
				alert("⚠️ Esta tarefa foi modificada. Recarregue e tente novamente.");
			} else {
				alert(message);
			}
		} finally {
			setSubmitting(false);
		}
	};

	const handleChange = (field: string, value: string | string[] | number | null) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	if (loading) return <Loading />;
	if (error) return <ErrorMessage message={error} />;
	if (!todo) return <ErrorMessage message="Tarefa não encontrada" />;

	return (
		<div className="page">
			<div className="page-header">
				<div className="page-header-content">
					<button onClick={() => navigate("/tarefas")} className="btn btn-ghost btn-sm">
						<IconArrowLeft size={16} />
						Voltar
					</button>
					<h1 className="page-title">Editar Tarefa</h1>
				</div>
			</div>

			<div className="page-content">
				<div className="form-page-container">
					<form onSubmit={handleSubmit} className="form">
						<div className="form-group">
							<label className="form-label">
								Título <span className="form-required">*</span>
							</label>
							<input
								type="text"
								value={formData.title}
								onChange={(e) => handleChange("title", e.target.value)}
								className={`form-input ${errors.title ? "form-input-error" : ""}`}
								placeholder="Título da tarefa"
								maxLength={200}
							/>
							{errors.title && <span className="form-error">{errors.title}</span>}
						</div>

						<div className="form-group">
							<label className="form-label">Descrição</label>
							<textarea
								value={formData.description}
								onChange={(e) => handleChange("description", e.target.value)}
								className="form-textarea"
								placeholder="Descrição da tarefa..."
								maxLength={2000}
							/>
						</div>

						<div className="form-row">
							<div className="form-group">
								<label className="form-label">
									<IconCalendar size={14} />
									Data de vencimento
								</label>
								<input
									type="datetime-local"
									value={formData.dueDate}
									onChange={(e) => handleChange("dueDate", e.target.value)}
									className="form-input"
								/>
							</div>

							<div className="form-group">
								<label className="form-label">
									<IconUser size={14} />
									Demandante
								</label>
								<select
									value={formData.requesterId || ""}
									onChange={(e) =>
										handleChange("requesterId", e.target.value ? Number(e.target.value) : null)
									}
									className="form-select"
								>
									<option value="">Selecione um demandante</option>
									{requesters.map((requester) => (
										<option key={requester.id} value={requester.id}>
											{requester.name}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="form-group">
							<label className="form-label">
								<IconUser size={14} />
								Responsável
							</label>
							<input
								type="text"
								value={formData.assignedTo}
								onChange={(e) => handleChange("assignedTo", e.target.value)}
								className="form-input"
								placeholder="email@exemplo.com"
							/>
						</div>

						<div className="form-group">
							<label className="form-label">
								<IconTag size={14} />
								Tags
							</label>
							<TagSelect
								value={formData.tags}
								onChange={(tags) => handleChange("tags", tags)}
								placeholder="Selecionar tags..."
							/>
						</div>

						<div className="form-actions">
							<button
								type="button"
								onClick={() => navigate("/tarefas")}
								disabled={submitting}
								className="btn btn-secondary"
							>
								Cancelar
							</button>
							<button type="submit" disabled={submitting} className="btn btn-primary">
								{submitting ? "Salvando..." : "Salvar Alterações"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

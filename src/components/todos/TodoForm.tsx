import { useState, useEffect } from "react";
import type { Todo, CreateTodoDto, UpdateTodoDto, Template, Requester } from "../../types";
import { TemplateSelect } from "../templates";
import { TagSelect, IconTemplate, IconCalendar, IconUser, IconTag, IconInfo } from "../ui";
import { addDays, toISODateString, toDatetimeLocal } from "../../lib/utils";

interface TodoFormProps {
	todo?: Todo | null;
	requesters?: Requester[];
	onSubmit: (data: CreateTodoDto | UpdateTodoDto) => Promise<void>;
	onCancel: () => void;
	loading?: boolean;
}

export function TodoForm({ todo, requesters = [], onSubmit, onCancel, loading }: TodoFormProps) {
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

	useEffect(() => {
		if (todo) {
			setFormData({
				title: todo.title,
				description: todo.description || "",
				dueDate: todo.dueDate ? toDatetimeLocal(new Date(todo.dueDate)) : "",
				assignedTo: todo.assignedTo || "",
				requesterId: todo.requesterId || null,
				tags: todo.tags,
				templateId: todo.templateId || null,
			});
		}
	}, [todo]);

	const handleTemplateSelect = (template: Template | null) => {
		if (template) {
			// Preencher campos automaticamente do template
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
		// Se não tem templateId, título é obrigatório
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

		if (todo) {
			// Atualização
			const data: UpdateTodoDto = {
				title: formData.title.trim() || undefined,
				description: formData.description.trim() || undefined,
				dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
				assignedTo: formData.assignedTo.trim() || undefined,
				tags: formData.tags.length > 0 ? formData.tags : undefined,
				version: todo.version,
			};
			await onSubmit(data);
		} else {
			// Criação
			const data: CreateTodoDto = {
				title: formData.title.trim() || undefined,
				description: formData.description.trim() || undefined,
				templateId: formData.templateId || undefined,
				dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
				assignedTo: formData.assignedTo.trim() || undefined,
				requesterId: formData.requesterId || undefined,
				tags: formData.tags.length > 0 ? formData.tags : undefined,
			};
			await onSubmit(data);
		}
	};

	const handleChange = (field: string, value: string | string[] | number | null) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	return (
		<form onSubmit={handleSubmit} className="form">
			{!todo && (
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
			)}

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
						onChange={(e) => handleChange("requesterId", e.target.value ? Number(e.target.value) : null)}
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
				<button type="button" onClick={onCancel} disabled={loading} className="btn btn-secondary">
					Cancelar
				</button>
				<button type="submit" disabled={loading} className="btn btn-primary">
					{loading ? "Salvando..." : "Salvar"}
				</button>
			</div>
		</form>
	);
}

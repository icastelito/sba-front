import { useState, useEffect } from "react";
import type { Template, CreateTemplateDto, UpdateTemplateDto } from "../../types";
import { TagSelect, IconCalendar, IconTag, IconInfo } from "../ui";

interface TemplateFormProps {
	template?: Template | null;
	onSubmit: (data: CreateTemplateDto | UpdateTemplateDto) => Promise<void>;
	onCancel: () => void;
	loading?: boolean;
}

export function TemplateForm({ template, onSubmit, onCancel, loading }: TemplateFormProps) {
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		defaultDueDays: "",
		tags: [] as string[],
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (template) {
			setFormData({
				title: template.title,
				description: template.description || "",
				defaultDueDays: template.defaultDueDays?.toString() || "",
				tags: template.tags,
			});
		}
	}, [template]);

	const validate = () => {
		const newErrors: Record<string, string> = {};
		if (!formData.title.trim()) {
			newErrors.title = "Título é obrigatório";
		}
		if (formData.title.length > 200) {
			newErrors.title = "Título deve ter no máximo 200 caracteres";
		}
		if (
			formData.defaultDueDays &&
			(isNaN(Number(formData.defaultDueDays)) || Number(formData.defaultDueDays) < 0)
		) {
			newErrors.defaultDueDays = "Prazo deve ser um número válido";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		const data: CreateTemplateDto = {
			title: formData.title.trim(),
			description: formData.description.trim() || undefined,
			defaultDueDays: formData.defaultDueDays ? Number(formData.defaultDueDays) : undefined,
			tags: formData.tags.length > 0 ? formData.tags : undefined,
		};

		await onSubmit(data);
	};

	const handleChange = (field: string, value: string | string[]) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	return (
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
					placeholder="Título do template"
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
					placeholder="Descrição do template..."
					maxLength={2000}
				/>
			</div>

			<div className="form-group">
				<label className="form-label">
					<IconCalendar size={14} />
					Prazo padrão (dias)
				</label>
				<input
					type="number"
					min={0}
					value={formData.defaultDueDays}
					onChange={(e) => handleChange("defaultDueDays", e.target.value)}
					className={`form-input form-input-sm ${errors.defaultDueDays ? "form-input-error" : ""}`}
					placeholder="Ex: 7"
				/>
				<p className="form-hint">
					<IconInfo size={12} />
					Ao criar tarefa, dueDate = hoje + este valor
				</p>
				{errors.defaultDueDays && <span className="form-error">{errors.defaultDueDays}</span>}
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

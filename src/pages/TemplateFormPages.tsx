import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTemplates } from "../hooks";
import type { Template, CreateTemplateDto, UpdateTemplateDto } from "../types";
import { TagSelect, Loading, ErrorMessage, IconCalendar, IconTag, IconInfo, IconArrowLeft } from "../components/ui";

export function TemplateCreatePage() {
	const navigate = useNavigate();
	const { createTemplate } = useTemplates();

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		defaultDueDays: "",
		tags: [] as string[],
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [submitting, setSubmitting] = useState(false);

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

		setSubmitting(true);
		try {
			const data: CreateTemplateDto = {
				title: formData.title.trim(),
				description: formData.description.trim() || undefined,
				defaultDueDays: formData.defaultDueDays ? Number(formData.defaultDueDays) : undefined,
				tags: formData.tags.length > 0 ? formData.tags : undefined,
			};
			await createTemplate(data);
			navigate("/templates");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erro ao criar template";
			alert(message);
		} finally {
			setSubmitting(false);
		}
	};

	const handleChange = (field: string, value: string | string[]) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	return (
		<div className="page">
			<div className="page-header">
				<div className="page-header-content">
					<button onClick={() => navigate("/templates")} className="btn btn-ghost btn-sm">
						<IconArrowLeft size={16} />
						Voltar
					</button>
					<h1 className="page-title">Novo Template</h1>
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
								className={`form-input form-input-sm ${
									errors.defaultDueDays ? "form-input-error" : ""
								}`}
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
							<button
								type="button"
								onClick={() => navigate("/templates")}
								disabled={submitting}
								className="btn btn-secondary"
							>
								Cancelar
							</button>
							<button type="submit" disabled={submitting} className="btn btn-primary">
								{submitting ? "Criando..." : "Criar Template"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export function TemplateEditPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { getTemplate, updateTemplate } = useTemplates();

	const [template, setTemplate] = useState<Template | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		defaultDueDays: "",
		tags: [] as string[],
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const loadTemplate = async () => {
			if (!id) return;
			setLoading(true);
			try {
				const data = await getTemplate(id);
				setTemplate(data);
				setFormData({
					title: data.title,
					description: data.description || "",
					defaultDueDays: data.defaultDueDays?.toString() || "",
					tags: data.tags,
				});
			} catch (err) {
				setError(err instanceof Error ? err.message : "Erro ao carregar template");
			} finally {
				setLoading(false);
			}
		};
		loadTemplate();
	}, [id, getTemplate]);

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
		if (!validate() || !template) return;

		setSubmitting(true);
		try {
			const data: UpdateTemplateDto = {
				title: formData.title.trim(),
				description: formData.description.trim() || undefined,
				defaultDueDays: formData.defaultDueDays ? Number(formData.defaultDueDays) : undefined,
				tags: formData.tags.length > 0 ? formData.tags : undefined,
			};
			await updateTemplate(template.id, data);
			navigate("/templates");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erro ao atualizar template";
			alert(message);
		} finally {
			setSubmitting(false);
		}
	};

	const handleChange = (field: string, value: string | string[]) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	if (loading) return <Loading />;
	if (error) return <ErrorMessage message={error} />;
	if (!template) return <ErrorMessage message="Template não encontrado" />;

	return (
		<div className="page">
			<div className="page-header">
				<div className="page-header-content">
					<button onClick={() => navigate("/templates")} className="btn btn-ghost btn-sm">
						<IconArrowLeft size={16} />
						Voltar
					</button>
					<h1 className="page-title">Editar Template</h1>
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
								className={`form-input form-input-sm ${
									errors.defaultDueDays ? "form-input-error" : ""
								}`}
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
							<button
								type="button"
								onClick={() => navigate("/templates")}
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

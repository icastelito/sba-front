import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTags } from "../hooks";
import type { Tag, CreateTagDto, UpdateTagDto } from "../types";
import { Loading, ErrorMessage, IconCheck, IconArrowLeft } from "../components/ui";

const DEFAULT_COLORS = [
	"#EF4444",
	"#F97316",
	"#F59E0B",
	"#EAB308",
	"#84CC16",
	"#22C55E",
	"#10B981",
	"#14B8A6",
	"#06B6D4",
	"#0EA5E9",
	"#3B82F6",
	"#6366F1",
	"#8B5CF6",
	"#A855F7",
	"#D946EF",
	"#EC4899",
	"#F43F5E",
	"#6B7280",
];

export function TagCreatePage() {
	const navigate = useNavigate();
	const { createTag } = useTags();

	const [formData, setFormData] = useState<CreateTagDto>({
		name: "",
		color: "#3B82F6",
		description: "",
		isActive: true,
	});
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			await createTag(formData);
			navigate("/tags");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erro ao criar tag";
			alert(message);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="page">
			<div className="page-header">
				<div className="page-header-content">
					<button onClick={() => navigate("/tags")} className="btn btn-ghost btn-sm">
						<IconArrowLeft size={16} />
						Voltar
					</button>
					<h1 className="page-title">Nova Tag</h1>
				</div>
			</div>

			<div className="page-content">
				<div className="form-page-container">
					<form onSubmit={handleSubmit} className="form">
						<div className="form-group">
							<label htmlFor="name" className="form-label">
								Nome da Tag <span className="form-required">*</span>
							</label>
							<input
								type="text"
								id="name"
								className="form-input"
								value={formData.name}
								onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase() })}
								placeholder="ex: urgente, revisão, pendente"
								required
								maxLength={50}
								disabled={submitting}
							/>
							<span className="form-hint">Será convertido para minúsculas automaticamente</span>
						</div>

						<div className="form-group">
							<label className="form-label">Cor</label>
							<div className="color-picker">
								<div className="color-swatches">
									{DEFAULT_COLORS.map((color) => (
										<button
											key={color}
											type="button"
											className={`color-swatch ${
												formData.color === color ? "color-swatch-selected" : ""
											}`}
											style={{ backgroundColor: color }}
											onClick={() => setFormData({ ...formData, color })}
											disabled={submitting}
											aria-label={`Selecionar cor ${color}`}
										>
											{formData.color === color && <IconCheck size={14} />}
										</button>
									))}
								</div>
								<div className="color-custom">
									<input
										type="color"
										value={formData.color || "#3B82F6"}
										onChange={(e) => setFormData({ ...formData, color: e.target.value })}
										disabled={submitting}
										className="color-input"
									/>
									<input
										type="text"
										value={formData.color || ""}
										onChange={(e) => setFormData({ ...formData, color: e.target.value })}
										placeholder="#000000"
										pattern="^#[0-9A-Fa-f]{6}$"
										className="form-input color-hex-input"
										disabled={submitting}
									/>
								</div>
							</div>
							<div className="color-preview-row">
								<span className="form-label-inline">Preview:</span>
								<span
									className="tag-badge"
									style={{ backgroundColor: formData.color || "var(--primary-500)", color: "#fff" }}
								>
									{formData.name || "nome-da-tag"}
								</span>
							</div>
						</div>

						<div className="form-group">
							<label htmlFor="description" className="form-label">
								Descrição
							</label>
							<textarea
								id="description"
								className="form-textarea"
								value={formData.description || ""}
								onChange={(e) => setFormData({ ...formData, description: e.target.value })}
								placeholder="Descreva o uso desta tag..."
								rows={3}
								maxLength={200}
								disabled={submitting}
							/>
						</div>

						<div className="form-group">
							<label className="form-checkbox-label">
								<input
									type="checkbox"
									checked={formData.isActive}
									onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
									disabled={submitting}
								/>
								<span>Tag ativa</span>
							</label>
							<span className="form-hint">Tags inativas não aparecem nas opções de seleção</span>
						</div>

						<div className="form-actions">
							<button
								type="button"
								onClick={() => navigate("/tags")}
								disabled={submitting}
								className="btn btn-secondary"
							>
								Cancelar
							</button>
							<button type="submit" disabled={submitting} className="btn btn-primary">
								{submitting ? "Criando..." : "Criar Tag"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export function TagEditPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { getTag, updateTag } = useTags();

	const [tag, setTag] = useState<Tag | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState<UpdateTagDto>({
		name: "",
		color: "#3B82F6",
		description: "",
		isActive: true,
	});
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const loadTag = async () => {
			if (!id) return;
			setLoading(true);
			try {
				const data = await getTag(id);
				setTag(data);
				setFormData({
					name: data.name,
					color: data.color || "#3B82F6",
					description: data.description || "",
					isActive: data.isActive,
				});
			} catch (err) {
				setError(err instanceof Error ? err.message : "Erro ao carregar tag");
			} finally {
				setLoading(false);
			}
		};
		loadTag();
	}, [id, getTag]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!tag) return;

		setSubmitting(true);
		try {
			await updateTag(tag.id, formData);
			navigate("/tags");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erro ao atualizar tag";
			alert(message);
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) return <Loading />;
	if (error) return <ErrorMessage message={error} />;
	if (!tag) return <ErrorMessage message="Tag não encontrada" />;

	return (
		<div className="page">
			<div className="page-header">
				<div className="page-header-content">
					<button onClick={() => navigate("/tags")} className="btn btn-ghost btn-sm">
						<IconArrowLeft size={16} />
						Voltar
					</button>
					<h1 className="page-title">Editar Tag</h1>
				</div>
			</div>

			<div className="page-content">
				<div className="form-page-container">
					<form onSubmit={handleSubmit} className="form">
						<div className="form-group">
							<label htmlFor="name" className="form-label">
								Nome da Tag <span className="form-required">*</span>
							</label>
							<input
								type="text"
								id="name"
								className="form-input"
								value={formData.name}
								onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase() })}
								placeholder="ex: urgente, revisão, pendente"
								required
								maxLength={50}
								disabled={submitting}
							/>
							<span className="form-hint">Será convertido para minúsculas automaticamente</span>
						</div>

						<div className="form-group">
							<label className="form-label">Cor</label>
							<div className="color-picker">
								<div className="color-swatches">
									{DEFAULT_COLORS.map((color) => (
										<button
											key={color}
											type="button"
											className={`color-swatch ${
												formData.color === color ? "color-swatch-selected" : ""
											}`}
											style={{ backgroundColor: color }}
											onClick={() => setFormData({ ...formData, color })}
											disabled={submitting}
											aria-label={`Selecionar cor ${color}`}
										>
											{formData.color === color && <IconCheck size={14} />}
										</button>
									))}
								</div>
								<div className="color-custom">
									<input
										type="color"
										value={formData.color || "#3B82F6"}
										onChange={(e) => setFormData({ ...formData, color: e.target.value })}
										disabled={submitting}
										className="color-input"
									/>
									<input
										type="text"
										value={formData.color || ""}
										onChange={(e) => setFormData({ ...formData, color: e.target.value })}
										placeholder="#000000"
										pattern="^#[0-9A-Fa-f]{6}$"
										className="form-input color-hex-input"
										disabled={submitting}
									/>
								</div>
							</div>
							<div className="color-preview-row">
								<span className="form-label-inline">Preview:</span>
								<span
									className="tag-badge"
									style={{ backgroundColor: formData.color || "var(--primary-500)", color: "#fff" }}
								>
									{formData.name || "nome-da-tag"}
								</span>
							</div>
						</div>

						<div className="form-group">
							<label htmlFor="description" className="form-label">
								Descrição
							</label>
							<textarea
								id="description"
								className="form-textarea"
								value={formData.description || ""}
								onChange={(e) => setFormData({ ...formData, description: e.target.value })}
								placeholder="Descreva o uso desta tag..."
								rows={3}
								maxLength={200}
								disabled={submitting}
							/>
						</div>

						<div className="form-group">
							<label className="form-checkbox-label">
								<input
									type="checkbox"
									checked={formData.isActive}
									onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
									disabled={submitting}
								/>
								<span>Tag ativa</span>
							</label>
							<span className="form-hint">Tags inativas não aparecem nas opções de seleção</span>
						</div>

						<div className="form-actions">
							<button
								type="button"
								onClick={() => navigate("/tags")}
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

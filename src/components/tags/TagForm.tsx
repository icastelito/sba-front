import { useState, useEffect } from "react";
import type { Tag, CreateTagDto, UpdateTagDto } from "../../types";
import { IconCheck, IconClose } from "../ui";

interface TagFormProps {
	tag?: Tag | null;
	onSubmit: (data: CreateTagDto | UpdateTagDto) => Promise<void>;
	onCancel: () => void;
	loading?: boolean;
}

const DEFAULT_COLORS = [
	"#EF4444", // red
	"#F97316", // orange
	"#F59E0B", // amber
	"#EAB308", // yellow
	"#84CC16", // lime
	"#22C55E", // green
	"#10B981", // emerald
	"#14B8A6", // teal
	"#06B6D4", // cyan
	"#0EA5E9", // sky
	"#3B82F6", // blue
	"#6366F1", // indigo
	"#8B5CF6", // violet
	"#A855F7", // purple
	"#D946EF", // fuchsia
	"#EC4899", // pink
	"#F43F5E", // rose
	"#6B7280", // gray
];

export function TagForm({ tag, onSubmit, onCancel, loading }: TagFormProps) {
	const [formData, setFormData] = useState<CreateTagDto>({
		name: "",
		color: "#3B82F6",
		description: "",
		isActive: true,
	});

	useEffect(() => {
		if (tag) {
			setFormData({
				name: tag.name,
				color: tag.color || "#3B82F6",
				description: tag.description || "",
				isActive: tag.isActive,
			});
		}
	}, [tag]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await onSubmit(formData);
	};

	return (
		<form onSubmit={handleSubmit} className="tag-form">
			<div className="form-group">
				<label htmlFor="name" className="form-label">
					Nome da Tag *
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
					disabled={loading}
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
								className={`color-swatch ${formData.color === color ? "color-swatch-selected" : ""}`}
								style={{ backgroundColor: color }}
								onClick={() => setFormData({ ...formData, color })}
								disabled={loading}
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
							disabled={loading}
							className="color-input"
						/>
						<input
							type="text"
							value={formData.color || ""}
							onChange={(e) => setFormData({ ...formData, color: e.target.value })}
							placeholder="#000000"
							pattern="^#[0-9A-Fa-f]{6}$"
							className="form-input color-hex-input"
							disabled={loading}
						/>
					</div>
				</div>
				<div className="color-preview-row">
					<span className="form-label-inline">Preview:</span>
					<span
						className="tag-badge"
						style={{
							backgroundColor: formData.color || "var(--primary-500)",
							color: "#fff",
						}}
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
					className="form-input form-textarea"
					value={formData.description || ""}
					onChange={(e) => setFormData({ ...formData, description: e.target.value })}
					placeholder="Descreva o uso desta tag..."
					rows={3}
					maxLength={200}
					disabled={loading}
				/>
			</div>

			<div className="form-group">
				<label className="form-checkbox-label">
					<input
						type="checkbox"
						checked={formData.isActive}
						onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
						disabled={loading}
					/>
					<span>Tag ativa</span>
				</label>
				<span className="form-hint">Tags inativas não aparecem nas opções de seleção</span>
			</div>

			<div className="form-actions">
				<button type="button" onClick={onCancel} className="btn btn-ghost" disabled={loading}>
					<IconClose size={18} />
					<span>Cancelar</span>
				</button>
				<button type="submit" className="btn btn-primary" disabled={loading}>
					<IconCheck size={18} />
					<span>{loading ? "Salvando..." : tag ? "Atualizar" : "Criar Tag"}</span>
				</button>
			</div>
		</form>
	);
}

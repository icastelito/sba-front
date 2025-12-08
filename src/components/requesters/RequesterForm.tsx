import { useState, useEffect } from "react";
import type { Requester } from "../../types";
import type { CreateRequesterDto, UpdateRequesterDto } from "../../hooks/useRequesters";
import { IconUser, IconMail, IconPhone, IconTag } from "../ui";

interface RequesterFormProps {
	requester?: Requester | null;
	onSubmit: (data: CreateRequesterDto | UpdateRequesterDto) => Promise<void>;
	onCancel: () => void;
	loading?: boolean;
}

export function RequesterForm({ requester, onSubmit, onCancel, loading }: RequesterFormProps) {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		department: "",
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (requester) {
			setFormData({
				name: requester.name,
				email: requester.email || "",
				phone: requester.phone || "",
				department: requester.department || "",
			});
		}
	}, [requester]);

	const validate = () => {
		const newErrors: Record<string, string> = {};
		if (!formData.name.trim()) {
			newErrors.name = "Nome é obrigatório";
		}
		if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Email inválido";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		const data: CreateRequesterDto | UpdateRequesterDto = {
			name: formData.name.trim(),
			email: formData.email.trim() || undefined,
			phone: formData.phone.trim() || undefined,
			department: formData.department.trim() || undefined,
		};

		await onSubmit(data);
	};

	const handleChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	return (
		<form onSubmit={handleSubmit} className="form">
			<div className="form-group">
				<label className="form-label">
					<IconUser size={14} />
					Nome <span className="form-required">*</span>
				</label>
				<input
					type="text"
					value={formData.name}
					onChange={(e) => handleChange("name", e.target.value)}
					className={`form-input ${errors.name ? "form-input-error" : ""}`}
					placeholder="Nome do demandante"
				/>
				{errors.name && <span className="form-error">{errors.name}</span>}
			</div>

			<div className="form-group">
				<label className="form-label">
					<IconMail size={14} />
					Email
				</label>
				<input
					type="email"
					value={formData.email}
					onChange={(e) => handleChange("email", e.target.value)}
					className={`form-input ${errors.email ? "form-input-error" : ""}`}
					placeholder="email@exemplo.com"
				/>
				{errors.email && <span className="form-error">{errors.email}</span>}
			</div>

			<div className="form-group">
				<label className="form-label">
					<IconPhone size={14} />
					Telefone
				</label>
				<input
					type="tel"
					value={formData.phone}
					onChange={(e) => handleChange("phone", e.target.value)}
					className="form-input"
					placeholder="(00) 00000-0000"
				/>
			</div>

			<div className="form-group">
				<label className="form-label">
					<IconTag size={14} />
					Departamento
				</label>
				<input
					type="text"
					value={formData.department}
					onChange={(e) => handleChange("department", e.target.value)}
					className="form-input"
					placeholder="Ex: Marketing, Vendas, TI..."
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

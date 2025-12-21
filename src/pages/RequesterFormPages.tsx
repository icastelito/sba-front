import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRequesters } from "../hooks";
import type { Requester } from "../types";
import type { CreateRequesterDto, UpdateRequesterDto } from "../hooks/useRequesters";
import { Loading, ErrorMessage, IconUser, IconMail, IconPhone, IconTag, IconArrowLeft } from "../components/ui";

export function RequesterCreatePage() {
	const navigate = useNavigate();
	const { createRequester } = useRequesters();

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		department: "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [submitting, setSubmitting] = useState(false);

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

		setSubmitting(true);
		try {
			const data: CreateRequesterDto = {
				name: formData.name.trim(),
				email: formData.email.trim() || undefined,
				phone: formData.phone.trim() || undefined,
				department: formData.department.trim() || undefined,
			};
			await createRequester(data);
			navigate("/demandantes");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erro ao criar demandante";
			alert(message);
		} finally {
			setSubmitting(false);
		}
	};

	const handleChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	return (
		<div className="page">
			<div className="page-header">
				<div className="page-header-content">
					<button onClick={() => navigate("/demandantes")} className="btn btn-ghost btn-sm">
						<IconArrowLeft size={16} />
						Voltar
					</button>
					<h1 className="page-title">Novo Demandante</h1>
				</div>
			</div>

			<div className="page-content">
				<div className="form-page-container">
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
							<button
								type="button"
								onClick={() => navigate("/demandantes")}
								disabled={submitting}
								className="btn btn-secondary"
							>
								Cancelar
							</button>
							<button type="submit" disabled={submitting} className="btn btn-primary">
								{submitting ? "Criando..." : "Criar Demandante"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export function RequesterEditPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { getRequester, updateRequester } = useRequesters();

	const [requester, setRequester] = useState<Requester | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		department: "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const loadRequester = async () => {
			if (!id) return;
			setLoading(true);
			try {
				const data = await getRequester(Number(id));
				setRequester(data);
				setFormData({
					name: data.name,
					email: data.email || "",
					phone: data.phone || "",
					department: data.department || "",
				});
			} catch (err) {
				setError(err instanceof Error ? err.message : "Erro ao carregar demandante");
			} finally {
				setLoading(false);
			}
		};
		loadRequester();
	}, [id, getRequester]);

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
		if (!validate() || !requester) return;

		setSubmitting(true);
		try {
			const data: UpdateRequesterDto = {
				name: formData.name.trim(),
				email: formData.email.trim() || undefined,
				phone: formData.phone.trim() || undefined,
				department: formData.department.trim() || undefined,
			};
			await updateRequester(requester.id, data);
			navigate("/demandantes");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erro ao atualizar demandante";
			alert(message);
		} finally {
			setSubmitting(false);
		}
	};

	const handleChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	if (loading) return <Loading />;
	if (error) return <ErrorMessage message={error} />;
	if (!requester) return <ErrorMessage message="Demandante não encontrado" />;

	return (
		<div className="page">
			<div className="page-header">
				<div className="page-header-content">
					<button onClick={() => navigate("/demandantes")} className="btn btn-ghost btn-sm">
						<IconArrowLeft size={16} />
						Voltar
					</button>
					<h1 className="page-title">Editar Demandante</h1>
				</div>
			</div>

			<div className="page-content">
				<div className="form-page-container">
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
							<button
								type="button"
								onClick={() => navigate("/demandantes")}
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

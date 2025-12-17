import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loading, ErrorMessage } from "../components";

interface FormErrors {
	email?: string;
	username?: string;
	name?: string;
	password?: string;
	confirmPassword?: string;
}

export function RegisterPage() {
	const navigate = useNavigate();
	const { register, isLoading: authLoading } = useAuth();

	const [formData, setFormData] = useState({
		email: "",
		username: "",
		name: "",
		nickname: "",
		password: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const [generalError, setGeneralError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {};

		// Email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			newErrors.email = "Email inválido";
		}

		// Username
		const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
		if (!usernameRegex.test(formData.username)) {
			newErrors.username = "Username deve ter 3-30 caracteres (letras, números e _)";
		}

		// Name
		if (formData.name.length < 2 || formData.name.length > 100) {
			newErrors.name = "Nome deve ter entre 2 e 100 caracteres";
		}

		// Password
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
		if (!passwordRegex.test(formData.password)) {
			newErrors.password = "Senha deve ter mínimo 8 caracteres, 1 minúscula, 1 maiúscula e 1 número";
		}

		// Confirm password
		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "As senhas não coincidem";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setGeneralError(null);

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);

		try {
			await register({
				email: formData.email,
				username: formData.username,
				name: formData.name,
				nickname: formData.nickname || undefined,
				password: formData.password,
			});
			setSuccess(true);
		} catch (err) {
			setGeneralError(err instanceof Error ? err.message : "Erro ao criar conta");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (authLoading) {
		return (
			<div className="auth-page">
				<Loading />
			</div>
		);
	}

	if (success) {
		return (
			<div className="auth-page">
				<div className="auth-container">
					<div className="auth-header">
						<h1 className="auth-title">Conta criada!</h1>
						<p className="auth-subtitle">Sua conta foi criada com sucesso. Agora você pode fazer login.</p>
					</div>
					<button onClick={() => navigate("/login")} className="btn btn-primary auth-submit">
						Ir para Login
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="auth-page">
			<div className="auth-container">
				<div className="auth-header">
					<h1 className="auth-title">SBA</h1>
					<p className="auth-subtitle">Crie sua conta</p>
				</div>

				<form onSubmit={handleSubmit} className="auth-form">
					{generalError && <ErrorMessage message={generalError} />}

					<div className="form-group">
						<label htmlFor="email" className="form-label">
							Email *
						</label>
						<input
							type="email"
							id="email"
							className={`form-input ${errors.email ? "form-input-error" : ""}`}
							value={formData.email}
							onChange={(e) => setFormData({ ...formData, email: e.target.value })}
							placeholder="seu@email.com"
							required
							autoComplete="email"
							disabled={isSubmitting}
						/>
						{errors.email && <span className="form-error">{errors.email}</span>}
					</div>

					<div className="form-group">
						<label htmlFor="username" className="form-label">
							Username *
						</label>
						<input
							type="text"
							id="username"
							className={`form-input ${errors.username ? "form-input-error" : ""}`}
							value={formData.username}
							onChange={(e) => setFormData({ ...formData, username: e.target.value })}
							placeholder="seu_username"
							required
							autoComplete="username"
							disabled={isSubmitting}
						/>
						{errors.username && <span className="form-error">{errors.username}</span>}
					</div>

					<div className="form-group">
						<label htmlFor="name" className="form-label">
							Nome Completo *
						</label>
						<input
							type="text"
							id="name"
							className={`form-input ${errors.name ? "form-input-error" : ""}`}
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							placeholder="Seu nome completo"
							required
							autoComplete="name"
							disabled={isSubmitting}
						/>
						{errors.name && <span className="form-error">{errors.name}</span>}
					</div>

					<div className="form-group">
						<label htmlFor="nickname" className="form-label">
							Apelido (opcional)
						</label>
						<input
							type="text"
							id="nickname"
							className="form-input"
							value={formData.nickname}
							onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
							placeholder="Como gostaria de ser chamado"
							autoComplete="nickname"
							disabled={isSubmitting}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="password" className="form-label">
							Senha *
						</label>
						<input
							type="password"
							id="password"
							className={`form-input ${errors.password ? "form-input-error" : ""}`}
							value={formData.password}
							onChange={(e) => setFormData({ ...formData, password: e.target.value })}
							placeholder="••••••••"
							required
							autoComplete="new-password"
							disabled={isSubmitting}
						/>
						{errors.password && <span className="form-error">{errors.password}</span>}
					</div>

					<div className="form-group">
						<label htmlFor="confirmPassword" className="form-label">
							Confirmar Senha *
						</label>
						<input
							type="password"
							id="confirmPassword"
							className={`form-input ${errors.confirmPassword ? "form-input-error" : ""}`}
							value={formData.confirmPassword}
							onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
							placeholder="••••••••"
							required
							autoComplete="new-password"
							disabled={isSubmitting}
						/>
						{errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
					</div>

					<button type="submit" className="btn btn-primary auth-submit" disabled={isSubmitting}>
						{isSubmitting ? "Criando conta..." : "Criar Conta"}
					</button>
				</form>

				<div className="auth-footer">
					<p>
						Já tem uma conta?{" "}
						<Link to="/login" className="auth-link">
							Fazer login
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

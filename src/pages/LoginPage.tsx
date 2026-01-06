import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loading, ErrorMessage } from "../components";
import { IconEye, IconEyeOff } from "../components/ui/Icons";

export function LoginPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { login, isLoading: authLoading } = useAuth();

	const [formData, setFormData] = useState({
		login: "",
		password: "",
	});
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	// Preencher formulário com query params (para auditoria Shopee)
	useEffect(() => {
		const email = searchParams.get("email");
		const pass = searchParams.get("pass");
		if (email || pass) {
			setFormData({
				login: email || "",
				password: pass || "",
			});
		}
	}, [searchParams]);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsSubmitting(true);

		try {
			await login(formData);
			// Se for o auditor, vai direto para Shopee
			const isAuditor = formData.login === "auditor@sba.dev" || formData.login === "auditor";
			navigate(isAuditor ? "/shopee" : "/tarefas");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao fazer login");
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

	return (
		<div className="auth-page">
			<div className="auth-container">
				<div className="auth-header">
					<h1 className="auth-title">SBA</h1>
					<p className="auth-subtitle">Entre na sua conta</p>
				</div>

				<form onSubmit={handleSubmit} className="auth-form">
					{error && <ErrorMessage message={error} />}

					<div className="form-group">
						<label htmlFor="login" className="form-label">
							Email ou Nome de Usuário
						</label>
						<input
							type="text"
							id="login"
							className="form-input"
							value={formData.login}
							onChange={(e) => setFormData({ ...formData, login: e.target.value })}
							placeholder="seu@email.com ou nome de usuário"
							required
							autoComplete="username"
							disabled={isSubmitting}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="password" className="form-label">
							Senha
						</label>
						<div style={{ position: "relative" }}>
							<input
								type={showPassword ? "text" : "password"}
								id="password"
								className="form-input"
								value={formData.password}
								onChange={(e) => setFormData({ ...formData, password: e.target.value })}
								placeholder="••••••••"
								required
								autoComplete="current-password"
								disabled={isSubmitting}
								style={{ paddingRight: "2.5rem" }}
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								style={{
									position: "absolute",
									right: "0.5rem",
									top: "50%",
									transform: "translateY(-50%)",
									background: "none",
									border: "none",
									cursor: "pointer",
									padding: "0.25rem",
									display: "flex",
									alignItems: "center",
									color: "var(--text-secondary)",
								}}
								disabled={isSubmitting}
							>
								{showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
							</button>
						</div>
					</div>

					<button type="submit" className="btn btn-primary auth-submit" disabled={isSubmitting}>
						{isSubmitting ? "Entrando..." : "Entrar"}
					</button>
				</form>

				<p className="auth-footer">
					Não tem uma conta?{" "}
					<Link to="/register" className="auth-link">
						Criar conta
					</Link>
				</p>
			</div>
		</div>
	);
}

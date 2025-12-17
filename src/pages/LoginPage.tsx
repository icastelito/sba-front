import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loading, ErrorMessage } from "../components";

export function LoginPage() {
	const navigate = useNavigate();
	const { login, isLoading: authLoading } = useAuth();

	const [formData, setFormData] = useState({
		login: "",
		password: "",
	});
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsSubmitting(true);

		try {
			await login(formData);
			navigate("/tarefas");
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
							Email ou Username
						</label>
						<input
							type="text"
							id="login"
							className="form-input"
							value={formData.login}
							onChange={(e) => setFormData({ ...formData, login: e.target.value })}
							placeholder="seu@email.com ou username"
							required
							autoComplete="username"
							disabled={isSubmitting}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="password" className="form-label">
							Senha
						</label>
						<input
							type="password"
							id="password"
							className="form-input"
							value={formData.password}
							onChange={(e) => setFormData({ ...formData, password: e.target.value })}
							placeholder="••••••••"
							required
							autoComplete="current-password"
							disabled={isSubmitting}
						/>
					</div>

					<button type="submit" className="btn btn-primary auth-submit" disabled={isSubmitting}>
						{isSubmitting ? "Entrando..." : "Entrar"}
					</button>
				</form>

				<div className="auth-footer">
					<p>
						Não tem uma conta?{" "}
						<Link to="/register" className="auth-link">
							Criar conta
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

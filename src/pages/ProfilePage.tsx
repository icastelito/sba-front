import { useState, type FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { Loading, ErrorMessage, Modal } from "../components";

interface ProfileFormData {
	name: string;
	nickname: string;
	username: string;
}

interface PasswordFormData {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

export function ProfilePage() {
	const { user, isLoading, updateProfile, changePassword, logout, logoutAll } = useAuth();

	const [profileData, setProfileData] = useState<ProfileFormData>({
		name: user?.name || "",
		nickname: user?.nickname || "",
		username: user?.username || "",
	});

	const [passwordData, setPasswordData] = useState<PasswordFormData>({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const [profileError, setProfileError] = useState<string | null>(null);
	const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [showLogoutAllModal, setShowLogoutAllModal] = useState(false);

	const handleProfileSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setProfileError(null);
		setProfileSuccess(null);
		setIsUpdatingProfile(true);

		try {
			await updateProfile({
				name: profileData.name,
				nickname: profileData.nickname || undefined,
				username: profileData.username,
			});
			setProfileSuccess("Perfil atualizado com sucesso!");
		} catch (err) {
			setProfileError(err instanceof Error ? err.message : "Erro ao atualizar perfil");
		} finally {
			setIsUpdatingProfile(false);
		}
	};

	const handlePasswordSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setPasswordError(null);

		if (passwordData.newPassword !== passwordData.confirmPassword) {
			setPasswordError("As senhas não coincidem");
			return;
		}

		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
		if (!passwordRegex.test(passwordData.newPassword)) {
			setPasswordError("Nova senha deve ter mínimo 8 caracteres, 1 minúscula, 1 maiúscula e 1 número");
			return;
		}

		setIsChangingPassword(true);

		try {
			await changePassword({
				currentPassword: passwordData.currentPassword,
				newPassword: passwordData.newPassword,
			});
			// changePassword já limpa os tokens e redireciona para login
		} catch (err) {
			setPasswordError(err instanceof Error ? err.message : "Erro ao alterar senha");
			setIsChangingPassword(false);
		}
	};

	const handleLogoutAll = async () => {
		try {
			await logoutAll();
		} catch (err) {
			console.error("Erro ao fazer logout de todos dispositivos:", err);
		}
	};

	if (isLoading || !user) {
		return (
			<div className="page">
				<Loading />
			</div>
		);
	}

	return (
		<div className="page">
			<div className="page-header">
				<h1 className="page-title">Meu Perfil</h1>
				<button className="btn btn-secondary" onClick={logout}>
					Sair
				</button>
			</div>

			<div className="profile-grid">
				{/* Informações do Usuário */}
				<div className="card">
					<div className="card-header">
						<h2 className="card-title">Informações da Conta</h2>
					</div>
					<div className="card-body">
						<div className="profile-info">
							<div className="profile-info-item">
								<span className="profile-info-label">Email</span>
								<span className="profile-info-value">{user.email}</span>
							</div>
							<div className="profile-info-item">
								<span className="profile-info-label">Username</span>
								<span className="profile-info-value">@{user.username}</span>
							</div>
							<div className="profile-info-item">
								<span className="profile-info-label">Status</span>
								<span className={`badge ${user.isActive ? "badge-success" : "badge-danger"}`}>
									{user.isActive ? "Ativo" : "Inativo"}
								</span>
							</div>
							<div className="profile-info-item">
								<span className="profile-info-label">Email Verificado</span>
								<span className={`badge ${user.emailVerified ? "badge-success" : "badge-warning"}`}>
									{user.emailVerified ? "Sim" : "Não"}
								</span>
							</div>
							<div className="profile-info-item">
								<span className="profile-info-label">Membro desde</span>
								<span className="profile-info-value">
									{new Date(user.createdAt).toLocaleDateString("pt-BR")}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Editar Perfil */}
				<div className="card">
					<div className="card-header">
						<h2 className="card-title">Editar Perfil</h2>
					</div>
					<div className="card-body">
						<form onSubmit={handleProfileSubmit}>
							{profileError && <ErrorMessage message={profileError} />}
							{profileSuccess && <div className="alert alert-success">{profileSuccess}</div>}

							<div className="form-group">
								<label htmlFor="name" className="form-label">
									Nome Completo
								</label>
								<input
									type="text"
									id="name"
									className="form-input"
									value={profileData.name}
									onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
									required
									disabled={isUpdatingProfile}
								/>
							</div>

							<div className="form-group">
								<label htmlFor="nickname" className="form-label">
									Apelido
								</label>
								<input
									type="text"
									id="nickname"
									className="form-input"
									value={profileData.nickname}
									onChange={(e) => setProfileData({ ...profileData, nickname: e.target.value })}
									disabled={isUpdatingProfile}
								/>
							</div>

							<div className="form-group">
								<label htmlFor="username" className="form-label">
									Username
								</label>
								<input
									type="text"
									id="username"
									className="form-input"
									value={profileData.username}
									onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
									required
									disabled={isUpdatingProfile}
								/>
							</div>

							<button type="submit" className="btn btn-primary" disabled={isUpdatingProfile}>
								{isUpdatingProfile ? "Salvando..." : "Salvar Alterações"}
							</button>
						</form>
					</div>
				</div>

				{/* Alterar Senha */}
				<div className="card">
					<div className="card-header">
						<h2 className="card-title">Alterar Senha</h2>
					</div>
					<div className="card-body">
						<form onSubmit={handlePasswordSubmit}>
							{passwordError && <ErrorMessage message={passwordError} />}

							<div className="form-group">
								<label htmlFor="currentPassword" className="form-label">
									Senha Atual
								</label>
								<input
									type="password"
									id="currentPassword"
									className="form-input"
									value={passwordData.currentPassword}
									onChange={(e) =>
										setPasswordData({ ...passwordData, currentPassword: e.target.value })
									}
									required
									disabled={isChangingPassword}
								/>
							</div>

							<div className="form-group">
								<label htmlFor="newPassword" className="form-label">
									Nova Senha
								</label>
								<input
									type="password"
									id="newPassword"
									className="form-input"
									value={passwordData.newPassword}
									onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
									required
									disabled={isChangingPassword}
								/>
								<span className="form-hint">
									Mínimo 8 caracteres, 1 minúscula, 1 maiúscula e 1 número
								</span>
							</div>

							<div className="form-group">
								<label htmlFor="confirmNewPassword" className="form-label">
									Confirmar Nova Senha
								</label>
								<input
									type="password"
									id="confirmNewPassword"
									className="form-input"
									value={passwordData.confirmPassword}
									onChange={(e) =>
										setPasswordData({ ...passwordData, confirmPassword: e.target.value })
									}
									required
									disabled={isChangingPassword}
								/>
							</div>

							<button type="submit" className="btn btn-primary" disabled={isChangingPassword}>
								{isChangingPassword ? "Alterando..." : "Alterar Senha"}
							</button>
						</form>
					</div>
				</div>

				{/* Segurança */}
				<div className="card">
					<div className="card-header">
						<h2 className="card-title">Segurança</h2>
					</div>
					<div className="card-body">
						<p className="text-muted mb-4">
							Desconectar de todos os dispositivos invalidará todas as sessões ativas. Você precisará
							fazer login novamente.
						</p>
						<button className="btn btn-danger" onClick={() => setShowLogoutAllModal(true)}>
							Sair de Todos os Dispositivos
						</button>
					</div>
				</div>
			</div>

			<Modal
				isOpen={showLogoutAllModal}
				onClose={() => setShowLogoutAllModal(false)}
				title="Sair de Todos os Dispositivos"
			>
				<p>
					Tem certeza que deseja sair de todos os dispositivos? Você precisará fazer login novamente em todos
					os dispositivos.
				</p>
				<div className="modal-actions">
					<button className="btn btn-secondary" onClick={() => setShowLogoutAllModal(false)}>
						Cancelar
					</button>
					<button className="btn btn-danger" onClick={handleLogoutAll}>
						Confirmar
					</button>
				</div>
			</Modal>
		</div>
	);
}

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { LoginDto, RegisterDto, UpdateProfileDto, ChangePasswordDto, AuthState, User } from "../types";
import { authApi, getStoredTokens, clearTokens, storeTokens } from "../lib/auth";

// ==================== AUDITOR MOCK ====================
// Credenciais do usuário de auditoria da Shopee (100% mockado, sem backend)
const AUDITOR_CREDENTIALS = {
	email: "auditor@sba.dev",
	password: "Audit@123",
};

const AUDITOR_USER: User = {
	id: "auditor-shopee-001",
	email: "auditor@sba.dev",
	username: "auditor",
	name: "Auditor Shopee",
	nickname: "Auditor",
	isActive: true,
	emailVerified: true,
	createdAt: "2025-01-10T10:00:00Z",
	updatedAt: new Date().toISOString(),
};

const AUDITOR_TOKENS = {
	accessToken: "mock-auditor-access-token-shopee",
	refreshToken: "mock-auditor-refresh-token-shopee",
};

// Verifica se é login do auditor
function isAuditorLogin(data: LoginDto): boolean {
	return (
		(data.login === AUDITOR_CREDENTIALS.email || data.login === "auditor") &&
		data.password === AUDITOR_CREDENTIALS.password
	);
}

// Verifica se o token armazenado é do auditor
function isAuditorToken(): boolean {
	const { accessToken } = getStoredTokens();
	return accessToken === AUDITOR_TOKENS.accessToken;
}

interface AuthContextType extends AuthState {
	login: (data: LoginDto) => Promise<void>;
	register: (data: RegisterDto) => Promise<void>;
	logout: () => Promise<void>;
	logoutAll: () => Promise<void>;
	updateProfile: (data: UpdateProfileDto) => Promise<void>;
	changePassword: (data: ChangePasswordDto) => Promise<void>;
	refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [state, setState] = useState<AuthState>({
		user: null,
		accessToken: null,
		refreshToken: null,
		isAuthenticated: false,
		isLoading: true,
	});

	// Verificar autenticação ao carregar
	const checkAuth = useCallback(async () => {
		const tokens = getStoredTokens();

		if (!tokens.accessToken) {
			setState({
				user: null,
				accessToken: null,
				refreshToken: null,
				isAuthenticated: false,
				isLoading: false,
			});
			return;
		}

		// Se for token do auditor, usar dados mockados (sem chamar backend)
		if (isAuditorToken()) {
			setState({
				user: AUDITOR_USER,
				accessToken: AUDITOR_TOKENS.accessToken,
				refreshToken: AUDITOR_TOKENS.refreshToken,
				isAuthenticated: true,
				isLoading: false,
			});
			return;
		}

		try {
			const user = await authApi.getProfile();
			setState({
				user,
				accessToken: tokens.accessToken,
				refreshToken: tokens.refreshToken,
				isAuthenticated: true,
				isLoading: false,
			});
		} catch (error) {
			// Token pode estar expirado, tentar refresh
			if (tokens.refreshToken) {
				try {
					const newTokens = await authApi.refresh();
					const user = await authApi.getProfile();
					setState({
						user,
						accessToken: newTokens.accessToken,
						refreshToken: newTokens.refreshToken,
						isAuthenticated: true,
						isLoading: false,
					});
					return;
				} catch {
					// Refresh também falhou, limpar tokens
				}
			}

			clearTokens();
			setState({
				user: null,
				accessToken: null,
				refreshToken: null,
				isAuthenticated: false,
				isLoading: false,
			});
		}
	}, []);

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	const login = useCallback(async (data: LoginDto) => {
		// Se for login do auditor, usar dados mockados (sem chamar backend)
		if (isAuditorLogin(data)) {
			storeTokens(AUDITOR_TOKENS.accessToken, AUDITOR_TOKENS.refreshToken);
			setState({
				user: AUDITOR_USER,
				accessToken: AUDITOR_TOKENS.accessToken,
				refreshToken: AUDITOR_TOKENS.refreshToken,
				isAuthenticated: true,
				isLoading: false,
			});
			return;
		}

		// Login normal via API
		const tokens = await authApi.login(data);
		const user = await authApi.getProfile();
		setState({
			user,
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken,
			isAuthenticated: true,
			isLoading: false,
		});
	}, []);

	const register = useCallback(async (data: RegisterDto) => {
		await authApi.register(data);
	}, []);

	const logout = useCallback(async () => {
		// Se for auditor, apenas limpa tokens locais (sem chamar backend)
		if (isAuditorToken()) {
			clearTokens();
			setState({
				user: null,
				accessToken: null,
				refreshToken: null,
				isAuthenticated: false,
				isLoading: false,
			});
			return;
		}

		await authApi.logout();
		setState({
			user: null,
			accessToken: null,
			refreshToken: null,
			isAuthenticated: false,
			isLoading: false,
		});
	}, []);

	const logoutAll = useCallback(async () => {
		// Se for auditor, apenas limpa tokens locais (sem chamar backend)
		if (isAuditorToken()) {
			clearTokens();
			setState({
				user: null,
				accessToken: null,
				refreshToken: null,
				isAuthenticated: false,
				isLoading: false,
			});
			return;
		}

		await authApi.logoutAll();
		setState({
			user: null,
			accessToken: null,
			refreshToken: null,
			isAuthenticated: false,
			isLoading: false,
		});
	}, []);

	const updateProfile = useCallback(async (data: UpdateProfileDto) => {
		// Se for auditor, simula atualização (sem chamar backend)
		if (isAuditorToken()) {
			setState((prev) => ({
				...prev,
				user: prev.user ? { ...prev.user, ...data } : null,
			}));
			return;
		}

		const response = await authApi.updateProfile(data);
		setState((prev) => ({
			...prev,
			user: response.data,
		}));
	}, []);

	const changePassword = useCallback(async (data: ChangePasswordDto) => {
		// Se for auditor, simula mudança de senha (sem chamar backend)
		if (isAuditorToken()) {
			// Para o auditor, não faz logout após mudar senha (é mockado)
			return;
		}

		await authApi.changePassword(data);
		setState({
			user: null,
			accessToken: null,
			refreshToken: null,
			isAuthenticated: false,
			isLoading: false,
		});
	}, []);

	const refreshAuth = useCallback(async () => {
		// Se for auditor, apenas mantém os dados mockados
		if (isAuditorToken()) {
			setState({
				user: AUDITOR_USER,
				accessToken: AUDITOR_TOKENS.accessToken,
				refreshToken: AUDITOR_TOKENS.refreshToken,
				isAuthenticated: true,
				isLoading: false,
			});
			return;
		}

		const tokens = await authApi.refresh();
		const user = await authApi.getProfile();
		setState({
			user,
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken,
			isAuthenticated: true,
			isLoading: false,
		});
	}, []);

	return (
		<AuthContext.Provider
			value={{
				...state,
				login,
				register,
				logout,
				logoutAll,
				updateProfile,
				changePassword,
				refreshAuth,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth deve ser usado dentro de um AuthProvider");
	}
	return context;
}

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { LoginDto, RegisterDto, UpdateProfileDto, ChangePasswordDto, AuthState } from "../types";
import { authApi, getStoredTokens, clearTokens } from "../lib/auth";

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
		const response = await authApi.updateProfile(data);
		setState((prev) => ({
			...prev,
			user: response.data,
		}));
	}, []);

	const changePassword = useCallback(async (data: ChangePasswordDto) => {
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

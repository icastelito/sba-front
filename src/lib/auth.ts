import type {
	User,
	TokenResponse,
	RegisterDto,
	LoginDto,
	UpdateProfileDto,
	ChangePasswordDto,
	ApiResponse,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_PREFIX = "/api";

// ==================== TOKEN STORAGE ====================

const TOKEN_KEYS = {
	ACCESS_TOKEN: "accessToken",
	REFRESH_TOKEN: "refreshToken",
} as const;

export function getStoredTokens() {
	return {
		accessToken: localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN),
		refreshToken: localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN),
	};
}

export function storeTokens(accessToken: string, refreshToken: string) {
	localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
	localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
}

export function clearTokens() {
	localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
	localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
}

// ==================== AUTH API ====================

class AuthApi {
	private baseUrl: string;

	constructor() {
		this.baseUrl = `${API_BASE_URL}${API_PREFIX}/auth`;
	}

	private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
		const url = `${this.baseUrl}${endpoint}`;

		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			...(options.headers as Record<string, string>),
		};

		const response = await fetch(url, {
			...options,
			headers,
		});

		const data = await response.json().catch(() => ({}));

		if (!response.ok) {
			const message = Array.isArray(data.message)
				? data.message.join(", ")
				: data.message || `HTTP Error: ${response.status}`;
			throw new Error(message);
		}

		return data;
	}

	private async authenticatedRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
		const { accessToken } = getStoredTokens();

		if (!accessToken) {
			throw new Error("Não autorizado");
		}

		return this.request<T>(endpoint, {
			...options,
			headers: {
				...options.headers,
				Authorization: `Bearer ${accessToken}`,
			},
		});
	}

	// ==================== REGISTRO ====================

	async register(data: RegisterDto): Promise<ApiResponse<User>> {
		return this.request<ApiResponse<User>>("/register", {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	// ==================== LOGIN ====================

	async login(data: LoginDto): Promise<TokenResponse> {
		const response = await this.request<TokenResponse>("/login", {
			method: "POST",
			body: JSON.stringify(data),
		});

		storeTokens(response.accessToken, response.refreshToken);
		return response;
	}

	// ==================== REFRESH TOKEN ====================

	async refresh(): Promise<TokenResponse> {
		const { refreshToken } = getStoredTokens();

		if (!refreshToken) {
			throw new Error("Refresh token não encontrado");
		}

		const response = await this.request<TokenResponse>("/refresh", {
			method: "POST",
			body: JSON.stringify({ refreshToken }),
		});

		storeTokens(response.accessToken, response.refreshToken);
		return response;
	}

	// ==================== LOGOUT ====================

	async logout(): Promise<void> {
		const { refreshToken } = getStoredTokens();

		if (refreshToken) {
			try {
				await this.request("/logout", {
					method: "POST",
					body: JSON.stringify({ refreshToken }),
				});
			} catch {
				// Ignora erros de logout
			}
		}

		clearTokens();
	}

	async logoutAll(): Promise<void> {
		await this.authenticatedRequest("/logout-all", {
			method: "POST",
		});
		clearTokens();
	}

	// ==================== PERFIL ====================

	async getProfile(): Promise<User> {
		return this.authenticatedRequest<User>("/me");
	}

	async updateProfile(data: UpdateProfileDto): Promise<ApiResponse<User>> {
		return this.authenticatedRequest<ApiResponse<User>>("/profile", {
			method: "PUT",
			body: JSON.stringify(data),
		});
	}

	async changePassword(data: ChangePasswordDto): Promise<{ message: string }> {
		const response = await this.authenticatedRequest<{ message: string }>("/password", {
			method: "PUT",
			body: JSON.stringify(data),
		});
		clearTokens();
		return response;
	}

	// ==================== VERIFICAÇÃO DE EMAIL ====================

	async verifyEmail(token: string): Promise<ApiResponse<User>> {
		return this.request<ApiResponse<User>>(`/verify-email?token=${token}`);
	}
}

export const authApi = new AuthApi();

import { getStoredTokens, storeTokens, clearTokens } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_PREFIX = "/api";

type RequestOptions = {
	method?: string;
	headers?: Record<string, string>;
	body?: string | FormData;
};

class ApiClient {
	private baseUrl: string;
	private isRefreshing = false;
	private refreshPromise: Promise<boolean> | null = null;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	private async refreshToken(): Promise<boolean> {
		const { refreshToken } = getStoredTokens();
		if (!refreshToken) return false;

		try {
			const response = await fetch(`${this.baseUrl}${API_PREFIX}/auth/refresh`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ refreshToken }),
			});

			if (!response.ok) {
				clearTokens();
				return false;
			}

			const data = await response.json();
			storeTokens(data.accessToken, data.refreshToken);
			return true;
		} catch {
			clearTokens();
			return false;
		}
	}

	private async request<T>(endpoint: string, options: RequestOptions = {}, retry = true): Promise<T> {
		const url = `${this.baseUrl}${API_PREFIX}${endpoint}`;
		const { accessToken } = getStoredTokens();

		const headers: Record<string, string> = {
			...options.headers,
		};

		// Adiciona token de autenticação se existir
		if (accessToken) {
			headers["Authorization"] = `Bearer ${accessToken}`;
		}

		// Não definir Content-Type se for FormData (o browser define automaticamente com boundary)
		if (!(options.body instanceof FormData)) {
			headers["Content-Type"] = "application/json";
		}

		const response = await fetch(url, {
			method: options.method || "GET",
			headers,
			body: options.body,
		});

		// Token expirado - tentar refresh
		if (response.status === 401 && retry) {
			const errorData = await response.json().catch(() => ({}));

			if (errorData.message === "Token expirado" || errorData.message === "Não autorizado") {
				// Evita múltiplos refreshes simultâneos
				if (!this.isRefreshing) {
					this.isRefreshing = true;
					this.refreshPromise = this.refreshToken();
				}

				const refreshed = await this.refreshPromise;
				this.isRefreshing = false;
				this.refreshPromise = null;

				if (refreshed) {
					// Repetir requisição com novo token
					return this.request<T>(endpoint, options, false);
				} else {
					// Refresh falhou - redirecionar para login
					window.location.href = "/login";
					throw new Error("Sessão expirada. Faça login novamente.");
				}
			}
		}

		if (!response.ok) {
			const error = await response.json().catch(() => ({ message: "Erro desconhecido" }));
			throw new Error(error.message || `HTTP Error: ${response.status}`);
		}

		return response.json();
	}

	async get<T>(endpoint: string): Promise<T> {
		return this.request<T>(endpoint);
	}

	async post<T>(endpoint: string, data?: unknown): Promise<T> {
		return this.request<T>(endpoint, {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	async postFormData<T>(endpoint: string, data: FormData): Promise<T> {
		return this.request<T>(endpoint, {
			method: "POST",
			body: data,
		});
	}

	async put<T>(endpoint: string, data: unknown): Promise<T> {
		return this.request<T>(endpoint, {
			method: "PUT",
			body: JSON.stringify(data),
		});
	}

	async patch<T>(endpoint: string, data?: unknown): Promise<T> {
		return this.request<T>(endpoint, {
			method: "PATCH",
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	async patchFormData<T>(endpoint: string, data: FormData): Promise<T> {
		return this.request<T>(endpoint, {
			method: "PATCH",
			body: data,
		});
	}

	async delete<T>(endpoint: string, data?: unknown): Promise<T> {
		return this.request<T>(endpoint, {
			method: "DELETE",
			body: data ? JSON.stringify(data) : undefined,
		});
	}
}

// API com prefixo /api
export const api = new ApiClient(API_BASE_URL);

export { API_BASE_URL };

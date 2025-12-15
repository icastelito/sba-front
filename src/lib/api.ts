const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_PREFIX = "/api";

type RequestOptions = {
	method?: string;
	headers?: Record<string, string>;
	body?: string | FormData;
};

class ApiClient {
	private baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
		const url = `${this.baseUrl}${API_PREFIX}${endpoint}`;

		const headers: Record<string, string> = {
			...options.headers,
		};

		// Não definir Content-Type se for FormData (o browser define automaticamente com boundary)
		if (!(options.body instanceof FormData)) {
			headers["Content-Type"] = "application/json";
		}

		const response = await fetch(url, {
			method: options.method || "GET",
			headers,
			body: options.body,
		});

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

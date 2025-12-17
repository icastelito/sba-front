import { api } from "./api";
import type {
	ShopeeConnectResponse,
	ShopeeStoresResponse,
	ShopeeConnectedResponse,
	ShopeeStore,
	ShopeeStoreStatusResponse,
	ApiResponse,
} from "../types";

class ShopeeApi {
	// Iniciar conexão OAuth
	async connect(): Promise<ShopeeConnectResponse> {
		return api.get<ShopeeConnectResponse>("/shopee/connect");
	}

	// Listar lojas conectadas
	async getStores(): Promise<ShopeeStoresResponse> {
		return api.get<ShopeeStoresResponse>("/shopee/stores");
	}

	// Verificar se há lojas conectadas
	async checkConnected(): Promise<ShopeeConnectedResponse> {
		return api.get<ShopeeConnectedResponse>("/shopee/connected");
	}

	// Detalhes de uma loja
	async getStore(shopId: string): Promise<ApiResponse<ShopeeStore>> {
		return api.get<ApiResponse<ShopeeStore>>(`/shopee/stores/${shopId}`);
	}

	// Status de uma loja
	async getStoreStatus(shopId: string): Promise<ShopeeStoreStatusResponse> {
		return api.get<ShopeeStoreStatusResponse>(`/shopee/stores/${shopId}/status`);
	}

	// Desconectar loja
	async disconnectStore(shopId: string): Promise<{ success: boolean; message: string }> {
		return api.delete<{ success: boolean; message: string }>(`/shopee/stores/${shopId}`);
	}

	// Renovar token da loja
	async refreshStoreToken(shopId: string): Promise<ApiResponse<{ status: string; tokenExpiresAt: string }>> {
		return api.post<ApiResponse<{ status: string; tokenExpiresAt: string }>>(`/shopee/stores/${shopId}/refresh`);
	}
}

export const shopeeApi = new ShopeeApi();

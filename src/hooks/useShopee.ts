import { useState, useEffect, useCallback } from "react";
import { shopeeApi } from "../lib/shopee";
import { useAuth } from "./useAuth";
import type { ShopeeStore, ShopeeConnectedResponse, ShopeeSyncProductsResult } from "../types";

// Email do usuário de auditoria da Shopee
const AUDITOR_EMAIL = "auditor@sba.dev";

// Loja de demonstração para auditoria da Shopee
const DEMO_STORE: ShopeeStore = {
	id: "demo-001",
	shopId: "SHOPEE-BR-DEMO",
	shopName: "Loja Teste SBA",
	region: "BR",
	status: "ACTIVE",
	tokenExpiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 180 dias no futuro
	lastSyncAt: new Date().toISOString(),
	errorMessage: null,
	createdAt: "2025-01-10T10:00:00Z",
	updatedAt: new Date().toISOString(),
};

const DEMO_CONNECTION_STATUS: ShopeeConnectedResponse["data"] = {
	totalStores: 1,
	activeStores: 1,
	stores: [
		{
			shopId: DEMO_STORE.shopId,
			shopName: DEMO_STORE.shopName || "Loja Teste SBA",
			status: DEMO_STORE.status,
			isActive: true,
		},
	],
};

interface UseShopeeReturn {
	stores: ShopeeStore[];
	connectionStatus: ShopeeConnectedResponse["data"] | null;
	isLoading: boolean;
	error: string | null;
	isDemo: boolean;
	connectStore: () => Promise<void>;
	disconnectStore: (shopId: string) => Promise<void>;
	refreshStoreToken: (shopId: string) => Promise<void>;
	refreshStores: () => Promise<void>;
	checkConnection: () => Promise<void>;
	syncProducts: (shopId: string) => Promise<ShopeeSyncProductsResult>;
}

export function useShopee(): UseShopeeReturn {
	const { user } = useAuth();
	const [stores, setStores] = useState<ShopeeStore[]>([]);
	const [connectionStatus, setConnectionStatus] = useState<ShopeeConnectedResponse["data"] | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Modo demo só ativa para o usuário de auditoria
	const isAuditor = user?.email === AUDITOR_EMAIL;
	const isDemo = isAuditor;

	// Carregar lojas conectadas
	const loadStores = useCallback(async () => {
		// Se for auditor, sempre mostra loja demo
		if (isAuditor) {
			setStores([DEMO_STORE]);
			setConnectionStatus(DEMO_CONNECTION_STATUS);
			setError(null);
			return;
		}

		try {
			const response = await shopeeApi.getStores();
			if (response.success) {
				setStores(response.data);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao carregar lojas");
		}
	}, [isAuditor]);

	// Verificar status de conexão
	const checkConnection = useCallback(async () => {
		// Se for auditor, usa status demo
		if (isAuditor) {
			setConnectionStatus(DEMO_CONNECTION_STATUS);
			return;
		}

		try {
			const response = await shopeeApi.checkConnected();
			if (response.success) {
				setConnectionStatus(response.data);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao verificar conexão");
		}
	}, [isAuditor]);

	// Carregar dados iniciais
	const loadData = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			await Promise.all([loadStores(), checkConnection()]);
		} finally {
			setIsLoading(false);
		}
	}, [loadStores, checkConnection]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	// Iniciar conexão OAuth
	const connectStore = useCallback(async () => {
		setError(null);
		try {
			const response = await shopeeApi.connect();
			if (response.success && response.data.authUrl) {
				// Redireciona na mesma janela para OAuth (mais confiável)
				window.location.href = response.data.authUrl;
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao conectar loja");
			throw err;
		}
	}, []);

	// Desconectar loja
	const disconnectStore = useCallback(
		async (shopId: string) => {
			setError(null);
			// Em modo demo, apenas simula a desconexão
			if (isDemo && shopId === DEMO_STORE.shopId) {
				// Não faz nada - mantém a loja demo visível para auditoria
				return;
			}
			try {
				const response = await shopeeApi.disconnectStore(shopId);
				if (response.success) {
					await loadData();
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Erro ao desconectar loja");
				throw err;
			}
		},
		[loadData, isDemo]
	);

	// Renovar token
	const refreshStoreToken = useCallback(
		async (shopId: string) => {
			setError(null);
			// Em modo demo, apenas simula a renovação
			if (isDemo && shopId === DEMO_STORE.shopId) {
				// Simula sucesso
				return;
			}
			try {
				const response = await shopeeApi.refreshStoreToken(shopId);
				if (response.success) {
					await loadStores();
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Erro ao renovar token");
				throw err;
			}
		},
		[loadStores, isDemo]
	);

	// Sincronizar produtos da loja
	const syncProducts = useCallback(
		async (shopId: string): Promise<ShopeeSyncProductsResult> => {
			setError(null);
			// Em modo demo, retorna resultado simulado
			if (isDemo && shopId === DEMO_STORE.shopId) {
				// Simula uma sincronização bem-sucedida
				await new Promise((resolve) => setTimeout(resolve, 1500)); // Delay para feedback visual
				return {
					created: 5,
					updated: 12,
					deactivated: 0,
					errors: [],
				};
			}
			try {
				const response = await shopeeApi.syncProducts(shopId);
				if (response.success) {
					await loadStores(); // Atualiza lastSyncAt
					return response.data;
				}
				throw new Error(response.message || "Erro ao sincronizar produtos");
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : "Erro ao sincronizar produtos";
				setError(errorMessage);
				throw err;
			}
		},
		[loadStores, isDemo]
	);

	return {
		stores,
		connectionStatus,
		isLoading,
		error,
		isDemo,
		connectStore,
		disconnectStore,
		refreshStoreToken,
		refreshStores: loadData,
		checkConnection,
		syncProducts,
	};
}

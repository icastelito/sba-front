import { useState, useEffect, useCallback } from "react";
import { shopeeApi } from "../lib/shopee";
import type { ShopeeStore, ShopeeConnectedResponse } from "../types";

interface UseShopeeReturn {
	stores: ShopeeStore[];
	connectionStatus: ShopeeConnectedResponse["data"] | null;
	isLoading: boolean;
	error: string | null;
	connectStore: () => Promise<void>;
	disconnectStore: (shopId: string) => Promise<void>;
	refreshStoreToken: (shopId: string) => Promise<void>;
	refreshStores: () => Promise<void>;
	checkConnection: () => Promise<void>;
}

export function useShopee(): UseShopeeReturn {
	const [stores, setStores] = useState<ShopeeStore[]>([]);
	const [connectionStatus, setConnectionStatus] = useState<ShopeeConnectedResponse["data"] | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Carregar lojas conectadas
	const loadStores = useCallback(async () => {
		try {
			const response = await shopeeApi.getStores();
			if (response.success) {
				setStores(response.data);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao carregar lojas");
		}
	}, []);

	// Verificar status de conexão
	const checkConnection = useCallback(async () => {
		try {
			const response = await shopeeApi.checkConnected();
			if (response.success) {
				setConnectionStatus(response.data);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao verificar conexão");
		}
	}, []);

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
		[loadData]
	);

	// Renovar token
	const refreshStoreToken = useCallback(
		async (shopId: string) => {
			setError(null);
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
		[loadStores]
	);

	return {
		stores,
		connectionStatus,
		isLoading,
		error,
		connectStore,
		disconnectStore,
		refreshStoreToken,
		refreshStores: loadData,
		checkConnection,
	};
}

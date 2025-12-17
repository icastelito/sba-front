import { useState } from "react";
import { useShopee } from "../hooks/useShopee";
import { Loading, ErrorMessage, ConfirmDialog } from "../components";
import { IconShopee, IconRefresh, IconTrash, IconPlus, IconCheck, IconWarning, IconError } from "../components/ui";
import type { ShopeeStore, ShopeeStoreStatus } from "../types";

const statusConfig: Record<ShopeeStoreStatus, { label: string; color: string; icon: React.ReactNode }> = {
	ACTIVE: { label: "Ativa", color: "badge-success", icon: <IconCheck size={14} /> },
	TOKEN_EXPIRED: { label: "Token Expirado", color: "badge-warning", icon: <IconWarning size={14} /> },
	DISCONNECTED: { label: "Desconectada", color: "badge-secondary", icon: null },
	ERROR: { label: "Erro", color: "badge-danger", icon: <IconError size={14} /> },
};

function StoreCard({
	store,
	onDisconnect,
	onRefreshToken,
}: {
	store: ShopeeStore;
	onDisconnect: (shopId: string) => void;
	onRefreshToken: (shopId: string) => void;
}) {
	const status = statusConfig[store.status] || statusConfig.ERROR;
	const isExpired = store.status === "TOKEN_EXPIRED";
	const tokenExpiry = new Date(store.tokenExpiresAt);
	const isExpiringSoon = tokenExpiry.getTime() - Date.now() < 24 * 60 * 60 * 1000; // 24h

	return (
		<div className="card shopee-store-card">
			<div className="card-body">
				<div className="shopee-store-header">
					<div className="shopee-store-info">
						<IconShopee size={32} className="shopee-icon" />
						<div>
							<h3 className="shopee-store-name">{store.shopName || `Loja ${store.shopId}`}</h3>
							<span className="shopee-store-id">ID: {store.shopId}</span>
						</div>
					</div>
					<span className={`badge ${status.color}`}>
						{status.icon}
						{status.label}
					</span>
				</div>

				<div className="shopee-store-details">
					<div className="shopee-store-detail">
						<span className="detail-label">Região</span>
						<span className="detail-value">{store.region}</span>
					</div>
					<div className="shopee-store-detail">
						<span className="detail-label">Token expira em</span>
						<span className={`detail-value ${isExpiringSoon ? "text-warning" : ""}`}>
							{tokenExpiry.toLocaleDateString("pt-BR")} às{" "}
							{tokenExpiry.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
						</span>
					</div>
					{store.lastSyncAt && (
						<div className="shopee-store-detail">
							<span className="detail-label">Última sincronização</span>
							<span className="detail-value">{new Date(store.lastSyncAt).toLocaleString("pt-BR")}</span>
						</div>
					)}
					{store.errorMessage && (
						<div className="shopee-store-detail error">
							<span className="detail-label">Erro</span>
							<span className="detail-value text-danger">{store.errorMessage}</span>
						</div>
					)}
				</div>

				<div className="shopee-store-actions">
					{(isExpired || isExpiringSoon) && (
						<button className="btn btn-sm btn-primary" onClick={() => onRefreshToken(store.shopId)}>
							<IconRefresh size={16} />
							Renovar Token
						</button>
					)}
					<button className="btn btn-sm btn-danger-outline" onClick={() => onDisconnect(store.shopId)}>
						<IconTrash size={16} />
						Desconectar
					</button>
				</div>
			</div>
		</div>
	);
}

export function ShopeePage() {
	const {
		stores,
		connectionStatus,
		isLoading,
		error,
		connectStore,
		disconnectStore,
		refreshStoreToken,
		refreshStores,
	} = useShopee();
	const [isConnecting, setIsConnecting] = useState(false);
	const [storeToDisconnect, setStoreToDisconnect] = useState<string | null>(null);
	const [actionError, setActionError] = useState<string | null>(null);

	const handleConnect = async () => {
		setIsConnecting(true);
		setActionError(null);
		try {
			await connectStore();
		} catch (err) {
			setActionError(err instanceof Error ? err.message : "Erro ao conectar");
		} finally {
			setIsConnecting(false);
		}
	};

	const handleDisconnect = async () => {
		if (!storeToDisconnect) return;
		setActionError(null);
		try {
			await disconnectStore(storeToDisconnect);
		} catch (err) {
			setActionError(err instanceof Error ? err.message : "Erro ao desconectar");
		} finally {
			setStoreToDisconnect(null);
		}
	};

	const handleRefreshToken = async (shopId: string) => {
		setActionError(null);
		try {
			await refreshStoreToken(shopId);
		} catch (err) {
			setActionError(err instanceof Error ? err.message : "Erro ao renovar token");
		}
	};

	if (isLoading) {
		return (
			<div className="page">
				<Loading />
			</div>
		);
	}

	return (
		<div className="page">
			<div className="page-header">
				<div>
					<h1 className="page-title">
						<IconShopee size={28} className="shopee-icon" />
						Lojas Shopee
					</h1>
					<p className="page-subtitle">Gerencie suas lojas Shopee conectadas</p>
				</div>
				<div className="page-actions">
					<button className="btn btn-secondary" onClick={refreshStores}>
						<IconRefresh size={18} />
						Atualizar
					</button>
					<button className="btn btn-primary" onClick={handleConnect} disabled={isConnecting}>
						<IconPlus size={18} />
						{isConnecting ? "Conectando..." : "Conectar Loja"}
					</button>
				</div>
			</div>

			{(error || actionError) && <ErrorMessage message={error || actionError || ""} />}

			{/* Stats */}
			{connectionStatus && (
				<div className="shopee-stats">
					<div className="stat-card">
						<span className="stat-value">{connectionStatus.totalStores}</span>
						<span className="stat-label">Total de Lojas</span>
					</div>
					<div className="stat-card">
						<span className="stat-value stat-success">{connectionStatus.activeStores}</span>
						<span className="stat-label">Lojas Ativas</span>
					</div>
					<div className="stat-card">
						<span className="stat-value stat-warning">
							{connectionStatus.totalStores - connectionStatus.activeStores}
						</span>
						<span className="stat-label">Lojas com Problemas</span>
					</div>
				</div>
			)}

			{/* Lista de Lojas */}
			{stores.length === 0 ? (
				<div className="empty-state">
					<IconShopee size={64} className="empty-icon shopee-icon" />
					<h3>Nenhuma loja conectada</h3>
					<p>Conecte sua primeira loja Shopee para começar a gerenciar seus pedidos.</p>
					<button className="btn btn-primary btn-lg" onClick={handleConnect} disabled={isConnecting}>
						<IconPlus size={20} />
						{isConnecting ? "Conectando..." : "Conectar Loja Shopee"}
					</button>
				</div>
			) : (
				<div className="shopee-stores-grid">
					{stores.map((store) => (
						<StoreCard
							key={store.id}
							store={store}
							onDisconnect={setStoreToDisconnect}
							onRefreshToken={handleRefreshToken}
						/>
					))}
				</div>
			)}

			{/* Modal de Confirmação de Desconexão */}
			<ConfirmDialog
				isOpen={!!storeToDisconnect}
				onClose={() => setStoreToDisconnect(null)}
				onConfirm={handleDisconnect}
				title="Desconectar Loja"
				message="Tem certeza que deseja desconectar esta loja? Você precisará reconectar para sincronizar pedidos novamente."
				confirmText="Desconectar"
				cancelText="Cancelar"
				isDestructive
			/>
		</div>
	);
}

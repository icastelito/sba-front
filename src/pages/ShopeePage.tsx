import { useState } from "react";
import { useShopee } from "../hooks/useShopee";
import { Loading, ErrorMessage, ConfirmDialog } from "../components";
import {
	IconShopee,
	IconRefresh,
	IconTrash,
	IconPlus,
	IconCheck,
	IconWarning,
	IconError,
	IconPackage,
	IconClock,
	IconCalendar,
	IconMapPin,
} from "../components/ui";
import type { ShopeeStore, ShopeeStoreStatus, ShopeeSyncProductsResult } from "../types";

const statusConfig: Record<
	ShopeeStoreStatus,
	{ label: string; color: string; icon: React.ReactNode; bgClass: string }
> = {
	ACTIVE: { label: "Conectada", color: "badge-success", icon: <IconCheck size={14} />, bgClass: "status-active" },
	TOKEN_EXPIRED: {
		label: "Token Expirado",
		color: "badge-warning",
		icon: <IconWarning size={14} />,
		bgClass: "status-warning",
	},
	DISCONNECTED: {
		label: "Desconectada",
		color: "badge-secondary",
		icon: <IconError size={14} />,
		bgClass: "status-disconnected",
	},
	ERROR: { label: "Erro", color: "badge-danger", icon: <IconError size={14} />, bgClass: "status-error" },
};

// Função para calcular tempo relativo
function getRelativeTime(date: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 1) return "Agora mesmo";
	if (diffMins < 60) return `Há ${diffMins} min`;
	if (diffHours < 24) return `Há ${diffHours}h`;
	if (diffDays === 1) return "Ontem";
	if (diffDays < 7) return `Há ${diffDays} dias`;
	return date.toLocaleDateString("pt-BR");
}

// Função para calcular dias restantes
function getDaysUntil(date: Date): { days: number; label: string; isUrgent: boolean; isWarning: boolean } {
	const now = new Date();
	const diffMs = date.getTime() - now.getTime();
	const days = Math.ceil(diffMs / 86400000);

	if (days < 0) return { days: 0, label: "Expirado", isUrgent: true, isWarning: false };
	if (days === 0) return { days: 0, label: "Expira hoje", isUrgent: true, isWarning: false };
	if (days === 1) return { days: 1, label: "Expira amanhã", isUrgent: false, isWarning: true };
	if (days <= 3) return { days, label: `${days} dias restantes`, isUrgent: false, isWarning: true };
	if (days <= 7) return { days, label: `${days} dias restantes`, isUrgent: false, isWarning: false };
	return { days, label: `${days} dias restantes`, isUrgent: false, isWarning: false };
}

function StoreCard({
	store,
	onDisconnect,
	onRefreshToken,
	onSyncProducts,
	isSyncing,
}: {
	store: ShopeeStore;
	onDisconnect: (shopId: string) => void;
	onRefreshToken: (shopId: string) => void;
	onSyncProducts: (shopId: string) => void;
	isSyncing: boolean;
}) {
	const status = statusConfig[store.status] || statusConfig.ERROR;
	const isExpired = store.status === "TOKEN_EXPIRED";
	const isActive = store.status === "ACTIVE";
	const tokenExpiry = new Date(store.tokenExpiresAt);
	const tokenInfo = getDaysUntil(tokenExpiry);
	const lastSync = store.lastSyncAt ? new Date(store.lastSyncAt) : null;

	return (
		<div className={`shopee-card ${status.bgClass}`}>
			{/* Header com gradiente laranja */}
			<div className="shopee-card-header">
				<div className="shopee-card-logo">
					<IconShopee size={28} />
				</div>
				<div className="shopee-card-title">
					<h3>{store.shopName || `Loja ${store.shopId}`}</h3>
					<span className="shopee-card-id">ID: {store.shopId}</span>
				</div>
				<div className={`shopee-card-status ${status.bgClass}`}>
					<span className="status-dot"></span>
					{status.label}
				</div>
			</div>

			{/* Corpo do card */}
			<div className="shopee-card-body">
				{/* Métricas principais */}
				<div className="shopee-card-metrics">
					<div className="shopee-metric">
						<div className="shopee-metric-icon">
							<IconMapPin size={16} />
						</div>
						<div className="shopee-metric-content">
							<span className="shopee-metric-label">Região</span>
							<span className="shopee-metric-value">{store.region || "BR"}</span>
						</div>
					</div>

					<div
						className={`shopee-metric ${
							tokenInfo.isUrgent ? "urgent" : tokenInfo.isWarning ? "warning" : ""
						}`}
					>
						<div className="shopee-metric-icon">
							<IconCalendar size={16} />
						</div>
						<div className="shopee-metric-content">
							<span className="shopee-metric-label">Token</span>
							<span className="shopee-metric-value">{tokenInfo.label}</span>
						</div>
					</div>

					<div className="shopee-metric">
						<div className="shopee-metric-icon">
							<IconClock size={16} />
						</div>
						<div className="shopee-metric-content">
							<span className="shopee-metric-label">Última Sincronização</span>
							<span className="shopee-metric-value">
								{lastSync ? getRelativeTime(lastSync) : "Nunca"}
							</span>
						</div>
					</div>
				</div>

				{/* Mensagem de erro se houver */}
				{store.errorMessage && (
					<div className="shopee-card-error">
						<IconError size={16} />
						<span>{store.errorMessage}</span>
					</div>
				)}

				{/* Barra de progresso do token */}
				<div className="shopee-token-progress">
					<div className="shopee-token-bar">
						<div
							className={`shopee-token-fill ${
								tokenInfo.isUrgent ? "urgent" : tokenInfo.isWarning ? "warning" : ""
							}`}
							style={{ width: `${Math.min(100, Math.max(0, (tokenInfo.days / 30) * 100))}%` }}
						></div>
					</div>
					<span className="shopee-token-expiry">
						Expira em {tokenExpiry.toLocaleDateString("pt-BR")} às{" "}
						{tokenExpiry.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
					</span>
				</div>
			</div>

			{/* Ações */}
			<div className="shopee-card-actions">
				{isActive && (
					<button
						className="shopee-action-btn primary"
						onClick={() => onSyncProducts(store.shopId)}
						disabled={isSyncing}
					>
						{isSyncing ? (
							<>
								<IconRefresh size={18} className="spinning" />
								<span>Sincronizando...</span>
							</>
						) : (
							<>
								<IconPackage size={18} />
								<span>Sincronizar</span>
							</>
						)}
					</button>
				)}
				{(isExpired || tokenInfo.isWarning || tokenInfo.isUrgent) && (
					<button className="shopee-action-btn warning" onClick={() => onRefreshToken(store.shopId)}>
						<IconRefresh size={18} />
						<span>Renovar Token</span>
					</button>
				)}
				<button className="shopee-action-btn danger" onClick={() => onDisconnect(store.shopId)}>
					<IconTrash size={18} />
				</button>
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
		syncProducts,
	} = useShopee();
	const [isConnecting, setIsConnecting] = useState(false);
	const [storeToDisconnect, setStoreToDisconnect] = useState<string | null>(null);
	const [actionError, setActionError] = useState<string | null>(null);
	const [syncingStoreId, setSyncingStoreId] = useState<string | null>(null);
	const [syncResult, setSyncResult] = useState<ShopeeSyncProductsResult | null>(null);

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

	const handleSyncProducts = async (shopId: string) => {
		setSyncingStoreId(shopId);
		setActionError(null);
		setSyncResult(null);
		try {
			const result = await syncProducts(shopId);
			setSyncResult(result);
		} catch (err) {
			setActionError(err instanceof Error ? err.message : "Erro ao sincronizar produtos");
		} finally {
			setSyncingStoreId(null);
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

			{/* Resultado da Sincronização */}
			{syncResult && (
				<div className="alert alert-success">
					<IconCheck size={20} />
					<div>
						<strong>Sincronização concluída!</strong>
						<p>
							{syncResult.created} produtos criados, {syncResult.updated} atualizados,{" "}
							{syncResult.deactivated} desativados
						</p>
						{syncResult.errors.length > 0 && (
							<details>
								<summary>{syncResult.errors.length} erro(s) encontrado(s)</summary>
								<ul>
									{syncResult.errors.map((err, i) => (
										<li key={i}>{err}</li>
									))}
								</ul>
							</details>
						)}
					</div>
					<button className="btn btn-ghost btn-sm" onClick={() => setSyncResult(null)}>
						✕
					</button>
				</div>
			)}

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
							onSyncProducts={handleSyncProducts}
							isSyncing={syncingStoreId === store.shopId}
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

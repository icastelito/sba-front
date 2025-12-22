import { useState, useEffect } from "react";
import { useShopee } from "../../hooks/useShopee";
import { IconShopee, IconCheck, IconClose, IconPackage, IconRefresh } from "../ui";
import type { ShopeeSyncProductsResult } from "../../types";

interface SyncShopeeModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSyncComplete?: () => void;
}

export function SyncShopeeModal({ isOpen, onClose, onSyncComplete }: SyncShopeeModalProps) {
	const { stores, isLoading: loadingStores, syncProducts, refreshStores } = useShopee();
	const [selectedStores, setSelectedStores] = useState<string[]>([]);
	const [isSyncing, setIsSyncing] = useState(false);
	const [currentSyncingStore, setCurrentSyncingStore] = useState<string | null>(null);
	const [results, setResults] = useState<Map<string, ShopeeSyncProductsResult>>(new Map());
	const [errors, setErrors] = useState<Map<string, string>>(new Map());
	const [syncCompleted, setSyncCompleted] = useState(false);

	// Filtrar apenas lojas ativas
	const activeStores = stores.filter((s) => s.status === "ACTIVE");

	// Auto-sync se houver apenas uma loja
	useEffect(() => {
		if (isOpen && !loadingStores && activeStores.length === 1 && !isSyncing && !syncCompleted) {
			handleSync([activeStores[0].shopId]);
		}
	}, [isOpen, loadingStores, activeStores.length]);

	// Reset ao abrir
	useEffect(() => {
		if (isOpen) {
			setSelectedStores([]);
			setResults(new Map());
			setErrors(new Map());
			setSyncCompleted(false);
			refreshStores();
		}
	}, [isOpen]);

	const handleToggleStore = (shopId: string) => {
		setSelectedStores((prev) => (prev.includes(shopId) ? prev.filter((id) => id !== shopId) : [...prev, shopId]));
	};

	const handleSelectAll = () => {
		if (selectedStores.length === activeStores.length) {
			setSelectedStores([]);
		} else {
			setSelectedStores(activeStores.map((s) => s.shopId));
		}
	};

	const handleSync = async (storeIds?: string[]) => {
		const toSync = storeIds || selectedStores;
		if (toSync.length === 0) return;

		setIsSyncing(true);
		setResults(new Map());
		setErrors(new Map());

		for (const shopId of toSync) {
			setCurrentSyncingStore(shopId);
			try {
				const result = await syncProducts(shopId);
				setResults((prev) => new Map(prev).set(shopId, result));
			} catch (err) {
				setErrors((prev) =>
					new Map(prev).set(shopId, err instanceof Error ? err.message : "Erro desconhecido")
				);
			}
		}

		setCurrentSyncingStore(null);
		setIsSyncing(false);
		setSyncCompleted(true);
		onSyncComplete?.();
	};

	const getTotalResults = () => {
		let created = 0,
			updated = 0,
			deactivated = 0;
		results.forEach((r) => {
			created += r.created;
			updated += r.updated;
			deactivated += r.deactivated;
		});
		return { created, updated, deactivated };
	};

	if (!isOpen) return null;

	// Loading inicial
	if (loadingStores) {
		return (
			<div className="modal-overlay" onClick={onClose}>
				<div className="modal modal-md" onClick={(e) => e.stopPropagation()}>
					<div className="modal-header">
						<h2 className="modal-title">
							<IconShopee size={20} />
							Sincronizar Produtos
						</h2>
						<button onClick={onClose} className="btn btn-ghost btn-icon">
							<IconClose size={20} />
						</button>
					</div>
					<div className="modal-body" style={{ textAlign: "center", padding: "3rem" }}>
						<IconRefresh size={32} className="spinning" />
						<p>Carregando lojas...</p>
					</div>
				</div>
			</div>
		);
	}

	// Nenhuma loja conectada
	if (activeStores.length === 0) {
		return (
			<div className="modal-overlay" onClick={onClose}>
				<div className="modal modal-md" onClick={(e) => e.stopPropagation()}>
					<div className="modal-header">
						<h2 className="modal-title">
							<IconShopee size={20} />
							Sincronizar Produtos
						</h2>
						<button onClick={onClose} className="btn btn-ghost btn-icon">
							<IconClose size={20} />
						</button>
					</div>
					<div className="modal-body" style={{ textAlign: "center", padding: "2rem" }}>
						<IconShopee size={48} style={{ opacity: 0.5, marginBottom: "1rem" }} />
						<p>Nenhuma loja Shopee conectada.</p>
						<p className="text-secondary">Conecte uma loja na página de integrações Shopee.</p>
					</div>
					<div className="modal-footer">
						<button onClick={onClose} className="btn btn-secondary">
							Fechar
						</button>
					</div>
				</div>
			</div>
		);
	}

	// Sincronização em progresso ou concluída (auto-sync de 1 loja)
	if (activeStores.length === 1 && (isSyncing || syncCompleted)) {
		const store = activeStores[0];
		const result = results.get(store.shopId);
		const error = errors.get(store.shopId);

		return (
			<div className="modal-overlay" onClick={isSyncing ? undefined : onClose}>
				<div className="modal modal-md" onClick={(e) => e.stopPropagation()}>
					<div className="modal-header">
						<h2 className="modal-title">
							<IconShopee size={20} />
							Sincronizar Produtos
						</h2>
						{!isSyncing && (
							<button onClick={onClose} className="btn btn-ghost btn-icon">
								<IconClose size={20} />
							</button>
						)}
					</div>
					<div className="modal-body" style={{ textAlign: "center", padding: "2rem" }}>
						{isSyncing ? (
							<>
								<IconRefresh size={48} className="spinning" style={{ color: "var(--primary-500)" }} />
								<p style={{ marginTop: "1rem" }}>
									Sincronizando produtos de {store.shopName || store.shopId}...
								</p>
							</>
						) : error ? (
							<>
								<div className="alert alert-danger">
									<strong>Erro na sincronização:</strong>
									<p>{error}</p>
								</div>
							</>
						) : result ? (
							<>
								<IconCheck size={48} style={{ color: "var(--success-500)" }} />
								<h3 style={{ marginTop: "1rem" }}>Sincronização concluída!</h3>
								<div className="sync-results-summary">
									<div className="sync-stat">
										<span className="sync-stat-value">{result.created}</span>
										<span className="sync-stat-label">Criados</span>
									</div>
									<div className="sync-stat">
										<span className="sync-stat-value">{result.updated}</span>
										<span className="sync-stat-label">Atualizados</span>
									</div>
									<div className="sync-stat">
										<span className="sync-stat-value">{result.deactivated}</span>
										<span className="sync-stat-label">Desativados</span>
									</div>
								</div>
							</>
						) : null}
					</div>
					{!isSyncing && (
						<div className="modal-footer">
							<button onClick={onClose} className="btn btn-primary">
								Fechar
							</button>
						</div>
					)}
				</div>
			</div>
		);
	}

	// Múltiplas lojas - seleção
	return (
		<div className="modal-overlay" onClick={isSyncing ? undefined : onClose}>
			<div className="modal modal-md" onClick={(e) => e.stopPropagation()}>
				<div className="modal-header">
					<h2 className="modal-title">
						<IconShopee size={20} />
						Sincronizar Produtos
					</h2>
					{!isSyncing && (
						<button onClick={onClose} className="btn btn-ghost btn-icon">
							<IconClose size={20} />
						</button>
					)}
				</div>

				<div className="modal-body">
					{!syncCompleted ? (
						<>
							<p className="text-secondary" style={{ marginBottom: "1rem" }}>
								Selecione as lojas que deseja sincronizar:
							</p>

							<div className="sync-store-list">
								<label className="sync-store-item sync-store-all">
									<input
										type="checkbox"
										checked={selectedStores.length === activeStores.length}
										onChange={handleSelectAll}
										disabled={isSyncing}
									/>
									<span>Selecionar todas ({activeStores.length})</span>
								</label>

								{activeStores.map((store) => (
									<label
										key={store.shopId}
										className={`sync-store-item ${
											currentSyncingStore === store.shopId ? "syncing" : ""
										} ${results.has(store.shopId) ? "completed" : ""} ${
											errors.has(store.shopId) ? "error" : ""
										}`}
									>
										<input
											type="checkbox"
											checked={selectedStores.includes(store.shopId)}
											onChange={() => handleToggleStore(store.shopId)}
											disabled={isSyncing}
										/>
										<IconShopee size={20} />
										<span className="sync-store-name">
											{store.shopName || `Loja ${store.shopId}`}
										</span>
										{currentSyncingStore === store.shopId && (
											<IconRefresh size={16} className="spinning" />
										)}
										{results.has(store.shopId) && <IconCheck size={16} className="text-success" />}
									</label>
								))}
							</div>
						</>
					) : (
						<>
							<div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
								<IconCheck size={48} style={{ color: "var(--success-500)" }} />
								<h3 style={{ marginTop: "1rem" }}>Sincronização concluída!</h3>
							</div>

							<div className="sync-results-summary">
								{(() => {
									const totals = getTotalResults();
									return (
										<>
											<div className="sync-stat">
												<span className="sync-stat-value">{totals.created}</span>
												<span className="sync-stat-label">Criados</span>
											</div>
											<div className="sync-stat">
												<span className="sync-stat-value">{totals.updated}</span>
												<span className="sync-stat-label">Atualizados</span>
											</div>
											<div className="sync-stat">
												<span className="sync-stat-value">{totals.deactivated}</span>
												<span className="sync-stat-label">Desativados</span>
											</div>
										</>
									);
								})()}
							</div>

							{errors.size > 0 && (
								<div className="alert alert-warning" style={{ marginTop: "1rem" }}>
									<strong>{errors.size} loja(s) com erro:</strong>
									<ul style={{ margin: "0.5rem 0 0 1rem", padding: 0 }}>
										{Array.from(errors.entries()).map(([shopId, err]) => (
											<li key={shopId}>
												{activeStores.find((s) => s.shopId === shopId)?.shopName || shopId}:{" "}
												{err}
											</li>
										))}
									</ul>
								</div>
							)}
						</>
					)}
				</div>

				<div className="modal-footer">
					{!syncCompleted ? (
						<>
							<button onClick={onClose} className="btn btn-secondary" disabled={isSyncing}>
								Cancelar
							</button>
							<button
								onClick={() => handleSync()}
								className="btn btn-success"
								disabled={selectedStores.length === 0 || isSyncing}
							>
								<IconPackage size={16} />
								{isSyncing ? "Sincronizando..." : `Sincronizar (${selectedStores.length})`}
							</button>
						</>
					) : (
						<button onClick={onClose} className="btn btn-primary">
							Fechar
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

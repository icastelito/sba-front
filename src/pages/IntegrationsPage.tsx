import { IconShopee, IconCheck, IconClock } from "../components/ui";

// Ícones simples para outras plataformas
function IconMercadoLivre({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
			<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
		</svg>
	);
}

function IconAmazon({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
			<path d="M18.42 14.58c-.51-.51-1.34-.51-1.85 0l-1.57 1.57-1.57-1.57c-.51-.51-1.34-.51-1.85 0s-.51 1.34 0 1.85l1.57 1.57-1.57 1.57c-.51.51-.51 1.34 0 1.85.26.26.59.38.93.38s.67-.13.93-.38l1.57-1.57 1.57 1.57c.26.26.59.38.93.38s.67-.13.93-.38c.51-.51.51-1.34 0-1.85L17.28 18l1.57-1.57c.51-.51.51-1.34-.43-1.85zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
		</svg>
	);
}

function IconMagalu({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
			<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l4.59-4.58L18 11l-6 6z" />
		</svg>
	);
}

function IconShein({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
			<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
		</svg>
	);
}

interface Integration {
	id: string;
	name: string;
	icon: React.ReactNode;
	status: "active" | "coming_soon";
	description: string;
	connectedAt?: string;
	color: string;
}

const integrations: Integration[] = [
	{
		id: "shopee",
		name: "Shopee",
		icon: <IconShopee size={32} />,
		status: "active",
		description: "Marketplace líder no Brasil e Sudeste Asiático",
		connectedAt: "10/01/2025",
		color: "#EE4D2D",
	},
	{
		id: "mercadolivre",
		name: "Mercado Livre",
		icon: <IconMercadoLivre size={32} />,
		status: "active",
		description: "Maior marketplace da América Latina",
		connectedAt: "05/01/2025",
		color: "#FFE600",
	},
	{
		id: "amazon",
		name: "Amazon",
		icon: <IconAmazon size={32} />,
		status: "coming_soon",
		description: "Marketplace global de e-commerce",
		color: "#FF9900",
	},
	{
		id: "magalu",
		name: "Magazine Luiza",
		icon: <IconMagalu size={32} />,
		status: "coming_soon",
		description: "Um dos maiores varejistas do Brasil",
		color: "#0086FF",
	},
	{
		id: "shein",
		name: "Shein",
		icon: <IconShein size={32} />,
		status: "coming_soon",
		description: "Plataforma global de moda",
		color: "#000000",
	},
];

function IntegrationCard({ integration }: { integration: Integration }) {
	const isActive = integration.status === "active";

	return (
		<div className={`integration-card ${isActive ? "active" : "coming-soon"}`}>
			<div className="integration-card-header" style={{ borderColor: integration.color }}>
				<div className="integration-icon" style={{ color: integration.color }}>
					{integration.icon}
				</div>
				<div className="integration-info">
					<h3>{integration.name}</h3>
					<p>{integration.description}</p>
				</div>
				<div className={`integration-status ${isActive ? "status-active" : "status-pending"}`}>
					{isActive ? (
						<>
							<IconCheck size={16} />
							<span>Ativa</span>
						</>
					) : (
						<>
							<IconClock size={16} />
							<span>Em breve</span>
						</>
					)}
				</div>
			</div>
			{isActive && integration.connectedAt && (
				<div className="integration-card-footer">
					<span>Conectado em: {integration.connectedAt}</span>
				</div>
			)}
		</div>
	);
}

export function IntegrationsPage() {
	const activeCount = integrations.filter((i) => i.status === "active").length;
	const totalCount = integrations.length;

	return (
		<div className="page">
			<div className="page-header">
				<div>
					<h1 className="page-title">Integrações</h1>
					<p className="page-subtitle">Gerencie suas conexões com marketplaces e plataformas de e-commerce</p>
				</div>
			</div>

			{/* Stats */}
			<div className="integrations-stats">
				<div className="stat-card">
					<span className="stat-value stat-success">{activeCount}</span>
					<span className="stat-label">Integrações Ativas</span>
				</div>
				<div className="stat-card">
					<span className="stat-value">{totalCount - activeCount}</span>
					<span className="stat-label">Em Desenvolvimento</span>
				</div>
				<div className="stat-card">
					<span className="stat-value">{totalCount}</span>
					<span className="stat-label">Total de Plataformas</span>
				</div>
			</div>

			{/* Lista de Integrações */}
			<div className="integrations-section">
				<h2>Integrações Ativas</h2>
				<div className="integrations-grid">
					{integrations
						.filter((i) => i.status === "active")
						.map((integration) => (
							<IntegrationCard key={integration.id} integration={integration} />
						))}
				</div>
			</div>

			<div className="integrations-section">
				<h2>Em Breve</h2>
				<div className="integrations-grid">
					{integrations
						.filter((i) => i.status === "coming_soon")
						.map((integration) => (
							<IntegrationCard key={integration.id} integration={integration} />
						))}
				</div>
			</div>
		</div>
	);
}

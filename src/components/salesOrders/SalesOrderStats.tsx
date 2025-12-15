import type { SalesOrderStats } from "../../types";
import { formatCurrency } from "../../lib/utils";
import { IconTotal, IconPending, IconCompleted, IconWarning, IconCurrency, IconCalendar } from "../ui";

interface SalesOrderStatsProps {
	stats: SalesOrderStats;
}

export function SalesOrderStatsComponent({ stats }: SalesOrderStatsProps) {
	return (
		<div className="stats-grid">
			<div className="stat-card stat-card-primary">
				<div className="stat-icon">
					<IconTotal size={20} />
				</div>
				<div className="stat-content">
					<div className="stat-value">{stats.totalOrders}</div>
					<div className="stat-label">Total de Pedidos</div>
				</div>
			</div>

			<div className="stat-card stat-card-warning">
				<div className="stat-icon">
					<IconPending size={20} />
				</div>
				<div className="stat-content">
					<div className="stat-value">{stats.pendingOrders}</div>
					<div className="stat-label">Pendentes</div>
				</div>
			</div>

			<div className="stat-card stat-card-success">
				<div className="stat-icon">
					<IconCompleted size={20} />
				</div>
				<div className="stat-content">
					<div className="stat-value">{stats.paidOrders}</div>
					<div className="stat-label">Pagos</div>
				</div>
			</div>

			<div className="stat-card stat-card-danger">
				<div className="stat-icon">
					<IconWarning size={20} />
				</div>
				<div className="stat-content">
					<div className="stat-value">{stats.canceledOrders}</div>
					<div className="stat-label">Cancelados</div>
				</div>
			</div>

			<div className="stat-card stat-card-info">
				<div className="stat-icon">
					<IconCurrency size={20} />
				</div>
				<div className="stat-content">
					<div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
					<div className="stat-label">Receita Total</div>
				</div>
			</div>

			<div className="stat-card stat-card-alert">
				<div className="stat-icon">
					<IconCalendar size={20} />
				</div>
				<div className="stat-content">
					<div className="stat-value">{stats.todayOrders}</div>
					<div className="stat-label">Pedidos Hoje</div>
				</div>
			</div>
		</div>
	);
}

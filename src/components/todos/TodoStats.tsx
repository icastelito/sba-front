import { useEffect, useState, useCallback } from "react";
import type { TodoStats } from "../../types";
import { useTodos } from "../../hooks";
import { IconCompleted, IconWarning, IconClock } from "../ui";

interface TodoStatsProps {
	assignedTo?: string;
}

export function TodoStatsBar({ assignedTo }: TodoStatsProps) {
	const { getStats } = useTodos();
	const [stats, setStats] = useState<TodoStats | null>(null);
	const [loading, setLoading] = useState(true);

	const loadStats = useCallback(async () => {
		setLoading(true);
		try {
			const data = await getStats(assignedTo);
			setStats(data);
		} catch (err) {
			console.error("Erro ao carregar estatísticas:", err);
		} finally {
			setLoading(false);
		}
	}, [getStats, assignedTo]);

	useEffect(() => {
		loadStats();
	}, [loadStats]);

	if (loading || !stats) {
		return null;
	}

	return (
		<div className="stats-grid">
			<div className="stat-card stat-card-primary">
				<div className="stat-icon">
					<IconCompleted size={20} />
				</div>
				<div className="stat-content">
					<div className="stat-value">{stats.total}</div>
					<div className="stat-label">Total</div>
				</div>
			</div>
			<div className="stat-card stat-card-warning">
				<div className="stat-icon">
					<IconClock size={20} />
				</div>
				<div className="stat-content">
					<div className="stat-value">{stats.pending}</div>
					<div className="stat-label">Pendentes</div>
				</div>
			</div>
			<div className="stat-card stat-card-success">
				<div className="stat-icon">
					<IconCompleted size={20} />
				</div>
				<div className="stat-content">
					<div className="stat-value">{stats.completed}</div>
					<div className="stat-label">Concluídas</div>
				</div>
			</div>
			<div className="stat-card stat-card-danger">
				<div className="stat-icon">
					<IconWarning size={20} />
				</div>
				<div className="stat-content">
					<div className="stat-value">{stats.overdue}</div>
					<div className="stat-label">Atrasadas</div>
				</div>
			</div>
			<div className="stat-card stat-card-alert">
				<div className="stat-icon">
					<IconClock size={20} />
				</div>
				<div className="stat-content">
					<div className="stat-value">{stats.dueToday}</div>
					<div className="stat-label">Vence hoje</div>
				</div>
			</div>
			<div className="stat-card stat-card-info">
				<div className="stat-icon">
					<IconCompleted size={20} />
				</div>
				<div className="stat-content">
					<div className="stat-value">{stats.completionRate}%</div>
					<div className="stat-label">Conclusão</div>
				</div>
			</div>
		</div>
	);
}

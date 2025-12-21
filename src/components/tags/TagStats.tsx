import type { TagStats } from "../../types";
import { IconTag, IconCheck, IconClose } from "../ui";

interface TagStatsBarProps {
	stats: TagStats | null;
}

export function TagStatsBar({ stats }: TagStatsBarProps) {
	if (!stats) return null;

	return (
		<div className="stats-grid stats-grid-4">
			<div className="stat-card">
				<div className="stat-icon stat-icon-primary">
					<IconTag size={20} />
				</div>
				<div className="stat-content">
					<span className="stat-value">{stats.total}</span>
					<span className="stat-label">Total de Tags</span>
				</div>
			</div>

			<div className="stat-card">
				<div className="stat-icon stat-icon-success">
					<IconCheck size={20} />
				</div>
				<div className="stat-content">
					<span className="stat-value">{stats.active}</span>
					<span className="stat-label">Ativas</span>
				</div>
			</div>

			<div className="stat-card">
				<div className="stat-icon stat-icon-secondary">
					<IconClose size={20} />
				</div>
				<div className="stat-content">
					<span className="stat-value">{stats.inactive}</span>
					<span className="stat-label">Inativas</span>
				</div>
			</div>

			{stats.mostUsed.length > 0 && (
				<div className="stat-card stat-card-wide">
					<div className="stat-content">
						<span className="stat-label">Mais usadas</span>
						<div className="stat-tags">
							{stats.mostUsed.slice(0, 3).map((tag) => (
								<span key={tag.name} className="stat-tag-item">
									<span className="tag">{tag.name}</span>
									<span className="stat-tag-count">{tag.usageCount}x</span>
								</span>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

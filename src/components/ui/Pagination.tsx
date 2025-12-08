import type { PaginationMeta } from "../../types";
import { IconChevronLeft, IconChevronRight } from "./Icons";

interface PaginationProps {
	meta: PaginationMeta | null;
	onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
	if (!meta || meta.totalPages <= 1) return null;

	const { page, totalPages, hasMore, total } = meta;

	// Derivar hasPrev da página atual
	const hasPrev = page > 1;
	// hasMore da API indica se há mais páginas
	const hasNext = hasMore;

	const getPageNumbers = () => {
		const pages: (number | string)[] = [];
		const showEllipsis = totalPages > 7;

		if (!showEllipsis) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			pages.push(1);

			if (page > 3) {
				pages.push("...");
			}

			const start = Math.max(2, page - 1);
			const end = Math.min(totalPages - 1, page + 1);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (page < totalPages - 2) {
				pages.push("...");
			}

			pages.push(totalPages);
		}

		return pages;
	};

	return (
		<div className="pagination">
			<span className="pagination-info">Total: {total} itens</span>

			<div className="pagination-controls">
				<button
					onClick={() => onPageChange(page - 1)}
					disabled={!hasPrev}
					className="btn btn-secondary btn-sm pagination-btn"
				>
					<IconChevronLeft size={16} />
					<span>Anterior</span>
				</button>

				<div className="pagination-pages">
					{getPageNumbers().map((pageNum, index) => (
						<button
							key={index}
							onClick={() => typeof pageNum === "number" && onPageChange(pageNum)}
							disabled={pageNum === "..." || pageNum === page}
							className={`pagination-page ${pageNum === page ? "pagination-page-active" : ""}`}
						>
							{pageNum}
						</button>
					))}
				</div>

				<button
					onClick={() => onPageChange(page + 1)}
					disabled={!hasNext}
					className="btn btn-secondary btn-sm pagination-btn"
				>
					<span>Próxima</span>
					<IconChevronRight size={16} />
				</button>
			</div>
		</div>
	);
}

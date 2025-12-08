import type { PaginationMeta } from "../../types";
import { IconChevronLeft, IconChevronRight } from "../ui";

interface PaginationProps {
	pagination: PaginationMeta;
	onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
	const { page, totalPages, hasNext, hasPrev, total } = pagination;

	// Gerar números das páginas visíveis
	const getPageNumbers = () => {
		const pages: (number | string)[] = [];
		const maxVisible = 5;

		if (totalPages <= maxVisible) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			if (page <= 3) {
				for (let i = 1; i <= 4; i++) {
					pages.push(i);
				}
				pages.push("...");
				pages.push(totalPages);
			} else if (page >= totalPages - 2) {
				pages.push(1);
				pages.push("...");
				for (let i = totalPages - 3; i <= totalPages; i++) {
					pages.push(i);
				}
			} else {
				pages.push(1);
				pages.push("...");
				pages.push(page - 1);
				pages.push(page);
				pages.push(page + 1);
				pages.push("...");
				pages.push(totalPages);
			}
		}

		return pages;
	};

	if (totalPages <= 1) return null;

	return (
		<div className="pagination">
			<span className="pagination-info">
				{total} {total === 1 ? "produto" : "produtos"}
			</span>

			<div className="pagination-controls">
				<button onClick={() => onPageChange(page - 1)} disabled={!hasPrev} className="btn btn-outline btn-sm">
					<IconChevronLeft size={16} />
					Anterior
				</button>

				{getPageNumbers().map((pageNum, idx) =>
					pageNum === "..." ? (
						<span key={`ellipsis-${idx}`} className="pagination-ellipsis">
							...
						</span>
					) : (
						<button
							key={pageNum}
							onClick={() => onPageChange(pageNum as number)}
							className={`btn btn-sm ${page === pageNum ? "btn-primary" : "btn-outline"}`}
						>
							{pageNum}
						</button>
					)
				)}

				<button onClick={() => onPageChange(page + 1)} disabled={!hasNext} className="btn btn-outline btn-sm">
					Próxima
					<IconChevronRight size={16} />
				</button>
			</div>
		</div>
	);
}

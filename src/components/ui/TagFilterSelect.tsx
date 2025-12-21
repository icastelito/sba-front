import { useState, useEffect, useRef } from "react";
import { useTags } from "../../hooks";
import { IconChevronDown, IconClose } from "./Icons";

interface TagFilterSelectProps {
	value: string | undefined;
	onChange: (tag: string | undefined) => void;
	placeholder?: string;
}

export function TagFilterSelect({ value, onChange, placeholder = "Filtrar por tag..." }: TagFilterSelectProps) {
	const { activeTags, fetchActiveTags } = useTags();
	const [isOpen, setIsOpen] = useState(false);
	const [search, setSearch] = useState("");
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		fetchActiveTags();
	}, [fetchActiveTags]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
				setSearch("");
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const selectTag = (tagName: string | undefined) => {
		onChange(tagName);
		setIsOpen(false);
		setSearch("");
	};

	const filteredTags = activeTags.filter((tag) => tag.name.toLowerCase().includes(search.toLowerCase()));

	const selectedTag = activeTags.find((t) => t.name === value);

	return (
		<div className="tag-filter-select-wrapper" ref={containerRef}>
			<div
				className={`tag-filter-select-trigger ${isOpen ? "tag-filter-select-trigger-open" : ""}`}
				onClick={() => setIsOpen(!isOpen)}
			>
				{value ? (
					<div className="tag-filter-select-value">
						<span
							className="tag-filter-select-color"
							style={{ backgroundColor: selectedTag?.color || "#a855f7" }}
						/>
						<span className="tag-filter-select-name">{value}</span>
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								selectTag(undefined);
							}}
							className="tag-filter-select-clear"
							aria-label="Limpar"
						>
							<IconClose size={12} />
						</button>
					</div>
				) : (
					<span className="tag-filter-select-placeholder">{placeholder}</span>
				)}
				<IconChevronDown
					size={16}
					className={`tag-filter-select-icon ${isOpen ? "tag-filter-select-icon-open" : ""}`}
				/>
			</div>

			{isOpen && (
				<div className="tag-filter-select-dropdown">
					<div className="tag-filter-select-search">
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Buscar tag..."
							className="tag-filter-select-search-input"
							autoFocus
						/>
					</div>
					<div className="tag-filter-select-options">
						<div
							className={`tag-filter-select-option ${!value ? "tag-filter-select-option-selected" : ""}`}
							onClick={() => selectTag(undefined)}
						>
							<span className="tag-filter-select-option-name">Todas as tags</span>
						</div>
						{filteredTags.length === 0 ? (
							<div className="tag-filter-select-empty">
								{activeTags.length === 0 ? "Nenhuma tag cadastrada" : "Nenhuma tag encontrada"}
							</div>
						) : (
							filteredTags.map((tag) => (
								<div
									key={tag.id}
									className={`tag-filter-select-option ${
										value === tag.name ? "tag-filter-select-option-selected" : ""
									}`}
									onClick={() => selectTag(tag.name)}
								>
									<span
										className="tag-filter-select-option-color"
										style={{ backgroundColor: tag.color || "#a855f7" }}
									/>
									<span className="tag-filter-select-option-name">{tag.name}</span>
								</div>
							))
						)}
					</div>
				</div>
			)}
		</div>
	);
}

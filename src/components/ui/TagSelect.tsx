import { useState, useEffect, useRef } from "react";
import { useTags } from "../../hooks";
import type { TagSimple } from "../../types";
import { IconClose, IconChevronDown, IconCheck } from "./Icons";

interface TagSelectProps {
	value: string[];
	onChange: (tags: string[]) => void;
	placeholder?: string;
}

export function TagSelect({ value, onChange, placeholder = "Selecionar tags..." }: TagSelectProps) {
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

	const toggleTag = (tagName: string) => {
		if (value.includes(tagName)) {
			onChange(value.filter((t) => t !== tagName));
		} else {
			onChange([...value, tagName]);
		}
	};

	const removeTag = (tagName: string, e: React.MouseEvent) => {
		e.stopPropagation();
		onChange(value.filter((t) => t !== tagName));
	};

	const filteredTags = activeTags.filter((tag) => tag.name.toLowerCase().includes(search.toLowerCase()));

	const getTagByName = (name: string): TagSimple | undefined => {
		return activeTags.find((t) => t.name === name);
	};

	return (
		<div className="tag-select-wrapper" ref={containerRef}>
			<div
				className={`tag-select-trigger ${isOpen ? "tag-select-trigger-open" : ""}`}
				onClick={() => setIsOpen(!isOpen)}
			>
				<div className="tag-select-values">
					{value.length === 0 ? (
						<span className="tag-select-placeholder">{placeholder}</span>
					) : (
						value.map((tagName) => {
							const tag = getTagByName(tagName);
							return (
								<span
									key={tagName}
									className="tag-select-tag"
									style={{ backgroundColor: tag?.color || "#a855f7" }}
								>
									{tagName}
									<button
										type="button"
										onClick={(e) => removeTag(tagName, e)}
										className="tag-select-tag-remove"
										aria-label={`Remover ${tagName}`}
									>
										<IconClose size={10} />
									</button>
								</span>
							);
						})
					)}
				</div>
				<IconChevronDown size={16} className={`tag-select-icon ${isOpen ? "tag-select-icon-open" : ""}`} />
			</div>

			{isOpen && (
				<div className="tag-select-dropdown">
					<div className="tag-select-search">
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Buscar tag..."
							className="tag-select-search-input"
							autoFocus
						/>
					</div>
					<div className="tag-select-options">
						{filteredTags.length === 0 ? (
							<div className="tag-select-empty">
								{activeTags.length === 0 ? "Nenhuma tag cadastrada" : "Nenhuma tag encontrada"}
							</div>
						) : (
							filteredTags.map((tag) => {
								const isSelected = value.includes(tag.name);
								return (
									<div
										key={tag.id}
										className={`tag-select-option ${
											isSelected ? "tag-select-option-selected" : ""
										}`}
										onClick={() => toggleTag(tag.name)}
									>
										<span
											className="tag-select-option-color"
											style={{ backgroundColor: tag.color || "#a855f7" }}
										/>
										<span className="tag-select-option-name">{tag.name}</span>
										{isSelected && <IconCheck size={14} className="tag-select-option-check" />}
									</div>
								);
							})
						)}
					</div>
				</div>
			)}
		</div>
	);
}

import { useState } from "react";
import { IconClose } from "./Icons";

interface TagInputProps {
	value: string[];
	onChange: (tags: string[]) => void;
	placeholder?: string;
}

export function TagInput({ value, onChange, placeholder = "Adicionar tag..." }: TagInputProps) {
	const [inputValue, setInputValue] = useState("");

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();
			addTag();
		}
	};

	const addTag = () => {
		const tag = inputValue.trim().toLowerCase();
		if (tag && !value.includes(tag)) {
			onChange([...value, tag]);
		}
		setInputValue("");
	};

	const removeTag = (tagToRemove: string) => {
		onChange(value.filter((tag) => tag !== tagToRemove));
	};

	return (
		<div className="tag-input-wrapper">
			<div className="tag-input-container">
				{value.map((tag) => (
					<span key={tag} className="tag">
						{tag}
						<button
							type="button"
							onClick={() => removeTag(tag)}
							className="tag-remove"
							aria-label={`Remover ${tag}`}
						>
							<IconClose size={12} />
						</button>
					</span>
				))}
				<input
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={handleKeyDown}
					onBlur={addTag}
					placeholder={value.length === 0 ? placeholder : ""}
					className="tag-input"
				/>
			</div>
		</div>
	);
}

import { useState, useEffect, useCallback } from "react";
import { debounce } from "../../lib/utils";
import { IconSearch, IconClose } from "./Icons";

interface SearchInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	debounceMs?: number;
}

export function SearchInput({ value, onChange, placeholder = "Buscar...", debounceMs = 300 }: SearchInputProps) {
	const [localValue, setLocalValue] = useState(value);

	// Sincroniza valor externo
	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedOnChange = useCallback(
		debounce((val: string) => {
			onChange(val);
		}, debounceMs),
		[onChange, debounceMs]
	);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setLocalValue(newValue);
		debouncedOnChange(newValue);
	};

	const handleClear = () => {
		setLocalValue("");
		onChange("");
	};

	return (
		<div className="search-input-wrapper">
			<IconSearch size={18} className="search-input-icon" />
			<input
				type="text"
				value={localValue}
				onChange={handleChange}
				placeholder={placeholder}
				className="search-input"
			/>
			{localValue && (
				<button onClick={handleClear} className="search-input-clear" aria-label="Limpar busca">
					<IconClose size={16} />
				</button>
			)}
		</div>
	);
}

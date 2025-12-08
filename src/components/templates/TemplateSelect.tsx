import { useEffect, useState, useCallback } from "react";
import { useTemplates } from "../../hooks";
import type { Template } from "../../types";
import { IconTemplate, IconChevronDown, IconCalendar, IconTag } from "../ui";

interface TemplateSelectProps {
	value: string | null;
	onChange: (template: Template | null) => void;
	placeholder?: string;
}

export function TemplateSelect({ value, onChange, placeholder = "Selecione um template..." }: TemplateSelectProps) {
	const { templates, loading, fetchTemplates } = useTemplates();
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		fetchTemplates({ limit: 100 });
	}, [fetchTemplates]);

	const handleSelect = useCallback(
		(template: Template | null) => {
			onChange(template);
			setIsOpen(false);
		},
		[onChange]
	);

	const selectedTemplate = templates.find((t) => t.id === value);

	return (
		<div className="select-wrapper">
			<button type="button" onClick={() => setIsOpen(!isOpen)} className="select-trigger">
				<span className={selectedTemplate ? "select-value" : "select-placeholder"}>
					{selectedTemplate ? (
						<>
							<IconTemplate size={14} />
							{selectedTemplate.title}
						</>
					) : (
						placeholder
					)}
				</span>
				<IconChevronDown size={16} className={`select-arrow ${isOpen ? "select-arrow-open" : ""}`} />
			</button>

			{isOpen && (
				<div className="select-dropdown">
					<button
						type="button"
						onClick={() => handleSelect(null)}
						className={`select-option ${value === null ? "select-option-selected" : ""}`}
					>
						Sem template
					</button>

					{loading ? (
						<div className="select-loading">Carregando...</div>
					) : templates.length === 0 ? (
						<div className="select-empty">Nenhum template cadastrado</div>
					) : (
						templates.map((template) => (
							<button
								key={template.id}
								type="button"
								onClick={() => handleSelect(template)}
								className={`select-option ${value === template.id ? "select-option-selected" : ""}`}
							>
								<div className="select-option-title">{template.title}</div>
								{template.description && (
									<div className="select-option-description">
										{template.description.substring(0, 60)}...
									</div>
								)}
								<div className="select-option-meta">
									{template.defaultDueDays && (
										<span>
											<IconCalendar size={10} />
											{template.defaultDueDays} dias
										</span>
									)}
									{template.tags.length > 0 && (
										<span>
											<IconTag size={10} />
											{template.tags.join(", ")}
										</span>
									)}
								</div>
							</button>
						))
					)}
				</div>
			)}
		</div>
	);
}

interface LoadingProps {
	text?: string;
}

export function Loading({ text = "Carregando..." }: LoadingProps) {
	return (
		<div className="loading">
			<div className="loading-spinner" />
			<span className="loading-text">{text}</span>
		</div>
	);
}

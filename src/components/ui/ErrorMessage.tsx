import { IconWarning, IconRefresh } from "./Icons";

interface ErrorMessageProps {
	message: string;
	onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
	return (
		<div className="error-message">
			<div className="error-message-content">
				<IconWarning size={20} />
				<p className="error-message-text">{message}</p>
			</div>
			{onRetry && (
				<button onClick={onRetry} className="btn btn-danger btn-sm">
					<IconRefresh size={16} />
					<span>Tentar novamente</span>
				</button>
			)}
		</div>
	);
}

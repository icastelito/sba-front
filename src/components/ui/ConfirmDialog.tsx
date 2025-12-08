import { IconWarning } from "./Icons";

interface ConfirmDialogProps {
	isOpen: boolean;
	onClose?: () => void;
	onCancel?: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmText?: string;
	confirmLabel?: string;
	cancelText?: string;
	isDestructive?: boolean;
}

export function ConfirmDialog({
	isOpen,
	onClose,
	onCancel,
	onConfirm,
	title,
	message,
	confirmText,
	confirmLabel,
	cancelText = "Cancelar",
	isDestructive = false,
}: ConfirmDialogProps) {
	if (!isOpen) return null;

	const handleClose = () => {
		if (onCancel) {
			onCancel();
		} else if (onClose) {
			onClose();
		}
	};

	const handleConfirm = () => {
		onConfirm();
		handleClose();
	};

	const finalConfirmText = confirmText || confirmLabel || "Confirmar";

	return (
		<div className="modal-overlay" onClick={handleClose}>
			<div className="modal confirm-dialog" onClick={(e) => e.stopPropagation()}>
				<div className="confirm-dialog-content">
					{isDestructive && (
						<div className="confirm-dialog-icon confirm-dialog-icon-destructive">
							<IconWarning size={24} />
						</div>
					)}
					<h3 className="confirm-dialog-title">{title}</h3>
					<p className="confirm-dialog-message">{message}</p>
				</div>
				<div className="confirm-dialog-actions">
					<button onClick={handleClose} className="btn btn-secondary">
						{cancelText}
					</button>
					<button onClick={handleConfirm} className={`btn ${isDestructive ? "btn-danger" : "btn-primary"}`}>
						{finalConfirmText}
					</button>
				</div>
			</div>
		</div>
	);
}

import { useEffect, useCallback } from "react";
import { IconClose } from "./Icons";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	width?: string;
	size?: "small" | "medium" | "large";
}

const sizeMap = {
	small: "400px",
	medium: "560px",
	large: "720px",
};

export function Modal({ isOpen, onClose, title, children, width, size = "medium" }: ModalProps) {
	const modalWidth = width || sizeMap[size];

	const handleEscape = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		},
		[onClose]
	);

	useEffect(() => {
		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "";
		};
	}, [isOpen, handleEscape]);

	if (!isOpen) return null;

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal" style={{ width: modalWidth, maxWidth: "90vw" }} onClick={(e) => e.stopPropagation()}>
				<div className="modal-header">
					<h2 className="modal-title">{title}</h2>
					<button onClick={onClose} className="btn btn-ghost btn-icon" aria-label="Fechar">
						<IconClose size={20} />
					</button>
				</div>
				<div className="modal-body">{children}</div>
			</div>
		</div>
	);
}

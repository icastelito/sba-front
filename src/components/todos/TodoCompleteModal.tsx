import { useState } from "react";
import { toDatetimeLocal } from "../../lib/utils";
import { IconClose, IconCheck, IconCalendar, IconTasks } from "../ui";

interface TodoCompleteModalProps {
	isOpen: boolean;
	todoTitle: string;
	onClose: () => void;
	onConfirm: (completedAt?: string) => void;
}

export function TodoCompleteModal({ isOpen, todoTitle, onClose, onConfirm }: TodoCompleteModalProps) {
	const [dateOption, setDateOption] = useState<"now" | "custom">("now");
	const [customDate, setCustomDate] = useState(toDatetimeLocal(new Date()));

	if (!isOpen) return null;

	const handleConfirm = () => {
		if (dateOption === "now") {
			onConfirm();
		} else {
			onConfirm(new Date(customDate).toISOString());
		}
	};

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
				<div className="modal-header">
					<h2 className="modal-title">
						<IconCheck size={20} />
						Concluir Tarefa
					</h2>
					<button onClick={onClose} className="btn btn-ghost btn-icon" aria-label="Fechar">
						<IconClose size={20} />
					</button>
				</div>

				<div className="modal-body">
					<p className="text-secondary">Deseja marcar esta tarefa como concluída?</p>

					<p className="complete-modal-task">
						<IconTasks size={16} />"{todoTitle}"
					</p>

					<div className="form-group">
						<label className="form-label">
							<IconCalendar size={14} />
							Data de conclusão
						</label>

						<div className="radio-group">
							<label className="radio-option">
								<input
									type="radio"
									name="dateOption"
									checked={dateOption === "now"}
									onChange={() => setDateOption("now")}
								/>
								<span>Agora ({new Date().toLocaleString("pt-BR")})</span>
							</label>

							<label className="radio-option">
								<input
									type="radio"
									name="dateOption"
									checked={dateOption === "custom"}
									onChange={() => setDateOption("custom")}
								/>
								<span>Data específica</span>
							</label>

							{dateOption === "custom" && (
								<input
									type="datetime-local"
									value={customDate}
									onChange={(e) => setCustomDate(e.target.value)}
									className="form-input complete-modal-date"
								/>
							)}
						</div>
					</div>
				</div>

				<div className="modal-footer">
					<button onClick={onClose} className="btn btn-secondary">
						Cancelar
					</button>
					<button onClick={handleConfirm} className="btn btn-success">
						<IconCheck size={16} />
						Confirmar
					</button>
				</div>
			</div>
		</div>
	);
}

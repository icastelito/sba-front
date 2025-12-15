import { useState, useEffect } from "react";
import type { Client, CreateClientDto, UpdateClientDto } from "../../types";
import { IconCheck, IconClose, IconSearch } from "../ui";

interface ClientFormProps {
	client?: Client | null;
	onSubmit: (data: CreateClientDto | UpdateClientDto) => Promise<void>;
	onCancel: () => void;
	loading?: boolean;
}

interface ViaCepResponse {
	cep: string;
	logradouro: string;
	complemento: string;
	bairro: string;
	localidade: string;
	uf: string;
	erro?: boolean;
}

const BRAZILIAN_STATES = [
	"AC",
	"AL",
	"AP",
	"AM",
	"BA",
	"CE",
	"DF",
	"ES",
	"GO",
	"MA",
	"MT",
	"MS",
	"MG",
	"PA",
	"PB",
	"PR",
	"PE",
	"PI",
	"RJ",
	"RN",
	"RS",
	"RO",
	"RR",
	"SC",
	"SP",
	"SE",
	"TO",
];

export function ClientForm({ client, onSubmit, onCancel, loading }: ClientFormProps) {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		document: "",
		address: "",
		city: "",
		state: "",
		zipCode: "",
		notes: "",
		isActive: true,
	});
	const [cepLoading, setCepLoading] = useState(false);

	useEffect(() => {
		if (client) {
			setFormData({
				name: client.name,
				email: client.email || "",
				phone: client.phone || "",
				document: client.document || "",
				address: client.address || "",
				city: client.city || "",
				state: client.state || "",
				zipCode: client.zipCode || "",
				notes: client.notes || "",
				isActive: client.isActive,
			});
		}
	}, [client]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const data: CreateClientDto | UpdateClientDto = {
			name: formData.name,
			email: formData.email || undefined,
			phone: formData.phone || undefined,
			document: formData.document || undefined,
			address: formData.address || undefined,
			city: formData.city || undefined,
			state: formData.state || undefined,
			zipCode: formData.zipCode || undefined,
			notes: formData.notes || undefined,
			isActive: formData.isActive,
		};

		await onSubmit(data);
	};

	const formatPhone = (value: string) => {
		const numbers = value.replace(/\D/g, "");
		if (numbers.length <= 10) {
			return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
		}
		return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
	};

	const formatDocument = (value: string) => {
		const numbers = value.replace(/\D/g, "");
		if (numbers.length <= 11) {
			// CPF
			return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
		}
		// CNPJ
		return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
	};

	const formatZipCode = (value: string) => {
		const numbers = value.replace(/\D/g, "");
		return numbers.replace(/(\d{5})(\d{3})/, "$1-$2");
	};

	const fetchAddressByCep = async (cep: string) => {
		const numbers = cep.replace(/\D/g, "");
		if (numbers.length !== 8) return;

		setCepLoading(true);
		try {
			const response = await fetch(`https://viacep.com.br/ws/${numbers}/json/`);
			const data: ViaCepResponse = await response.json();

			if (!data.erro) {
				setFormData((prev) => ({
					...prev,
					address: data.logradouro
						? `${data.logradouro}${data.bairro ? `, ${data.bairro}` : ""}`
						: prev.address,
					city: data.localidade || prev.city,
					state: data.uf || prev.state,
				}));
			}
		} catch {
			// Silently fail - user can fill manually
		} finally {
			setCepLoading(false);
		}
	};

	const handleZipCodeChange = (value: string) => {
		const formatted = formatZipCode(value);
		setFormData({ ...formData, zipCode: formatted });

		// Auto-fetch when CEP is complete (8 digits)
		const numbers = value.replace(/\D/g, "");
		if (numbers.length === 8) {
			fetchAddressByCep(numbers);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="form">
			<div className="form-fields">
				{/* Nome */}
				<div className="form-group">
					<label className="form-label">
						Nome <span className="required">*</span>
					</label>
					<input
						type="text"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						className="form-input"
						placeholder="Nome do cliente"
						required
					/>
				</div>

				{/* Email e Telefone */}
				<div className="form-row">
					<div className="form-group">
						<label className="form-label">Email</label>
						<input
							type="email"
							value={formData.email}
							onChange={(e) => setFormData({ ...formData, email: e.target.value })}
							className="form-input"
							placeholder="email@exemplo.com"
						/>
					</div>
					<div className="form-group">
						<label className="form-label">Telefone</label>
						<input
							type="tel"
							value={formData.phone}
							onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
							className="form-input"
							placeholder="(11) 99999-9999"
							maxLength={15}
						/>
					</div>
				</div>

				{/* Documento */}
				<div className="form-group">
					<label className="form-label">CPF/CNPJ</label>
					<input
						type="text"
						value={formData.document}
						onChange={(e) => setFormData({ ...formData, document: formatDocument(e.target.value) })}
						className="form-input"
						placeholder="000.000.000-00 ou 00.000.000/0000-00"
						maxLength={18}
					/>
				</div>

				{/* Endereço */}
				<div className="form-group">
					<label className="form-label">Endereço</label>
					<input
						type="text"
						value={formData.address}
						onChange={(e) => setFormData({ ...formData, address: e.target.value })}
						className="form-input"
						placeholder="Rua, número, complemento"
					/>
				</div>

				{/* Cidade, Estado e CEP */}
				<div className="form-row form-row-3">
					<div className="form-group">
						<label className="form-label">Cidade</label>
						<input
							type="text"
							value={formData.city}
							onChange={(e) => setFormData({ ...formData, city: e.target.value })}
							className="form-input"
							placeholder="Cidade"
						/>
					</div>
					<div className="form-group">
						<label className="form-label">Estado</label>
						<select
							value={formData.state}
							onChange={(e) => setFormData({ ...formData, state: e.target.value })}
							className="form-select"
						>
							<option value="">Selecione</option>
							{BRAZILIAN_STATES.map((state) => (
								<option key={state} value={state}>
									{state}
								</option>
							))}
						</select>
					</div>
					<div className="form-group">
						<label className="form-label">CEP</label>
						<div className="form-input-with-icon">
							<input
								type="text"
								value={formData.zipCode}
								onChange={(e) => handleZipCodeChange(e.target.value)}
								className="form-input"
								placeholder="00000-000"
								maxLength={9}
							/>
							{cepLoading && <span className="input-icon-loading">...</span>}
						</div>
					</div>
				</div>

				{/* Notas */}
				<div className="form-group">
					<label className="form-label">Observações</label>
					<textarea
						value={formData.notes}
						onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
						className="form-textarea"
						placeholder="Observações sobre o cliente"
						rows={3}
					/>
				</div>

				{/* Status */}
				<div className="form-group">
					<label className="form-checkbox">
						<input
							type="checkbox"
							checked={formData.isActive}
							onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
						/>
						<span>Cliente ativo</span>
					</label>
				</div>
			</div>

			{/* Ações */}
			<div className="form-actions">
				<button type="button" onClick={onCancel} className="btn btn-ghost" disabled={loading}>
					<IconClose size={18} />
					Cancelar
				</button>
				<button type="submit" className="btn btn-primary" disabled={loading}>
					<IconCheck size={18} />
					{loading ? "Salvando..." : client ? "Atualizar" : "Criar"}
				</button>
			</div>
		</form>
	);
}

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useClients } from "../hooks";
import type { Client, CreateClientDto, UpdateClientDto } from "../types";
import { Loading, ErrorMessage, IconArrowLeft } from "../components/ui";

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
		return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
	}
	return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
};

const formatZipCode = (value: string) => {
	const numbers = value.replace(/\D/g, "");
	return numbers.replace(/(\d{5})(\d{3})/, "$1-$2");
};

export function ClientCreatePage() {
	const navigate = useNavigate();
	const { createClient } = useClients();

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
	const [submitting, setSubmitting] = useState(false);

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
			// Silently fail
		} finally {
			setCepLoading(false);
		}
	};

	const handleZipCodeChange = (value: string) => {
		const formatted = formatZipCode(value);
		setFormData({ ...formData, zipCode: formatted });
		const numbers = value.replace(/\D/g, "");
		if (numbers.length === 8) {
			fetchAddressByCep(numbers);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			const data: CreateClientDto = {
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
			await createClient(data);
			navigate("/clientes");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erro ao criar cliente";
			alert(message);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="page">
			<div className="page-header">
				<div className="page-header-content">
					<button onClick={() => navigate("/clientes")} className="btn btn-ghost btn-sm">
						<IconArrowLeft size={16} />
						Voltar
					</button>
					<h1 className="page-title">Novo Cliente</h1>
				</div>
			</div>

			<div className="page-content">
				<div className="form-page-container">
					<form onSubmit={handleSubmit} className="form">
						<div className="form-group">
							<label className="form-label">
								Nome <span className="form-required">*</span>
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

						<div className="form-group">
							<label className="form-checkbox-label">
								<input
									type="checkbox"
									checked={formData.isActive}
									onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
								/>
								<span>Cliente ativo</span>
							</label>
						</div>

						<div className="form-actions">
							<button
								type="button"
								onClick={() => navigate("/clientes")}
								disabled={submitting}
								className="btn btn-secondary"
							>
								Cancelar
							</button>
							<button type="submit" disabled={submitting} className="btn btn-primary">
								{submitting ? "Criando..." : "Criar Cliente"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export function ClientEditPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { getClient, updateClient } = useClients();

	const [client, setClient] = useState<Client | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
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
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const loadClient = async () => {
			if (!id) return;
			setLoading(true);
			try {
				const data = await getClient(id);
				setClient(data);
				setFormData({
					name: data.name,
					email: data.email || "",
					phone: data.phone || "",
					document: data.document || "",
					address: data.address || "",
					city: data.city || "",
					state: data.state || "",
					zipCode: data.zipCode || "",
					notes: data.notes || "",
					isActive: data.isActive,
				});
			} catch (err) {
				setError(err instanceof Error ? err.message : "Erro ao carregar cliente");
			} finally {
				setLoading(false);
			}
		};
		loadClient();
	}, [id, getClient]);

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
			// Silently fail
		} finally {
			setCepLoading(false);
		}
	};

	const handleZipCodeChange = (value: string) => {
		const formatted = formatZipCode(value);
		setFormData({ ...formData, zipCode: formatted });
		const numbers = value.replace(/\D/g, "");
		if (numbers.length === 8) {
			fetchAddressByCep(numbers);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!client) return;

		setSubmitting(true);
		try {
			const data: UpdateClientDto = {
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
			await updateClient(client.id, data);
			navigate("/clientes");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erro ao atualizar cliente";
			alert(message);
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) return <Loading />;
	if (error) return <ErrorMessage message={error} />;
	if (!client) return <ErrorMessage message="Cliente não encontrado" />;

	return (
		<div className="page">
			<div className="page-header">
				<div className="page-header-content">
					<button onClick={() => navigate("/clientes")} className="btn btn-ghost btn-sm">
						<IconArrowLeft size={16} />
						Voltar
					</button>
					<h1 className="page-title">Editar Cliente</h1>
				</div>
			</div>

			<div className="page-content">
				<div className="form-page-container">
					<form onSubmit={handleSubmit} className="form">
						<div className="form-group">
							<label className="form-label">
								Nome <span className="form-required">*</span>
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

						<div className="form-group">
							<label className="form-checkbox-label">
								<input
									type="checkbox"
									checked={formData.isActive}
									onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
								/>
								<span>Cliente ativo</span>
							</label>
						</div>

						<div className="form-actions">
							<button
								type="button"
								onClick={() => navigate("/clientes")}
								disabled={submitting}
								className="btn btn-secondary"
							>
								Cancelar
							</button>
							<button type="submit" disabled={submitting} className="btn btn-primary">
								{submitting ? "Salvando..." : "Salvar Alterações"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

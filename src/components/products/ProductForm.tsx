import { useState, useEffect } from "react";
import type { Product, CreateProductDto, UpdateProductDto } from "../../types";
import { ImageUpload } from "./ImageUpload";
import { IconCheck, IconClose, IconPlus } from "../ui";

interface ProductFormProps {
	product?: Product | null;
	categories: string[];
	badges: string[];
	onSubmit: (data: CreateProductDto | UpdateProductDto, imageFile?: File) => Promise<void>;
	onCancel: () => void;
	loading?: boolean;
}

export function ProductForm({ product, categories, badges, onSubmit, onCancel, loading }: ProductFormProps) {
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		price: "",
		link: "",
		badge: "",
		sku: "",
		category: "",
		imageUrl: "",
	});
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [removeImage, setRemoveImage] = useState(false);
	const [newCategory, setNewCategory] = useState("");
	const [newBadge, setNewBadge] = useState("");
	const [showNewCategory, setShowNewCategory] = useState(false);
	const [showNewBadge, setShowNewBadge] = useState(false);

	useEffect(() => {
		if (product) {
			setFormData({
				name: product.name,
				description: product.description || "",
				price: String(product.price),
				link: product.link || "",
				badge: product.badge || "",
				sku: product.sku || "",
				category: product.category || "",
				imageUrl: "",
			});
		}
	}, [product]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const data: CreateProductDto | UpdateProductDto = {
			name: formData.name,
			description: formData.description || undefined,
			price: parseFloat(formData.price),
			link: formData.link || undefined,
			badge: showNewBadge ? newBadge : formData.badge || undefined,
			sku: formData.sku || undefined,
			category: showNewCategory ? newCategory : formData.category || undefined,
			imageUrl: formData.imageUrl || undefined,
		};

		if (product && removeImage) {
			(data as UpdateProductDto).removeImage = true;
		}

		await onSubmit(data, imageFile || undefined);
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
						placeholder="Nome do produto"
						required
					/>
				</div>

				{/* Descrição */}
				<div className="form-group">
					<label className="form-label">Descrição</label>
					<textarea
						value={formData.description}
						onChange={(e) => setFormData({ ...formData, description: e.target.value })}
						className="form-textarea"
						placeholder="Descrição do produto"
					/>
				</div>

				{/* Preço e SKU */}
				<div className="form-row">
					<div className="form-group">
						<label className="form-label">
							Preço <span className="required">*</span>
						</label>
						<input
							type="number"
							value={formData.price}
							onChange={(e) => setFormData({ ...formData, price: e.target.value })}
							className="form-input"
							placeholder="0.00"
							min="0"
							step="0.01"
							required
						/>
					</div>
					<div className="form-group">
						<label className="form-label">SKU</label>
						<input
							type="text"
							value={formData.sku}
							onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
							className="form-input"
							placeholder="Código do produto"
						/>
					</div>
				</div>

				{/* Categoria */}
				<div className="form-group">
					<label className="form-label">Categoria</label>
					{!showNewCategory ? (
						<div className="form-input-group">
							<select
								value={formData.category}
								onChange={(e) => setFormData({ ...formData, category: e.target.value })}
								className="form-select flex-1"
							>
								<option value="">Selecione uma categoria</option>
								{categories.map((cat) => (
									<option key={cat} value={cat}>
										{cat}
									</option>
								))}
							</select>
							<button
								type="button"
								onClick={() => setShowNewCategory(true)}
								className="btn btn-outline btn-success btn-sm"
							>
								<IconPlus size={16} />
								Nova
							</button>
						</div>
					) : (
						<div className="form-input-group">
							<input
								type="text"
								value={newCategory}
								onChange={(e) => setNewCategory(e.target.value)}
								className="form-input flex-1"
								placeholder="Nome da nova categoria"
								autoFocus
							/>
							<button
								type="button"
								onClick={() => {
									setShowNewCategory(false);
									setNewCategory("");
								}}
								className="btn btn-ghost btn-sm"
							>
								<IconClose size={16} />
								Cancelar
							</button>
						</div>
					)}
				</div>

				{/* Badge */}
				<div className="form-group">
					<label className="form-label">Badge</label>
					{!showNewBadge ? (
						<div className="form-input-group">
							<select
								value={formData.badge}
								onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
								className="form-select flex-1"
							>
								<option value="">Selecione um badge</option>
								{badges.map((badge) => (
									<option key={badge} value={badge}>
										{badge}
									</option>
								))}
							</select>
							<button
								type="button"
								onClick={() => setShowNewBadge(true)}
								className="btn btn-outline btn-success btn-sm"
							>
								<IconPlus size={16} />
								Novo
							</button>
						</div>
					) : (
						<div className="form-input-group">
							<input
								type="text"
								value={newBadge}
								onChange={(e) => setNewBadge(e.target.value)}
								className="form-input flex-1"
								placeholder="Nome do novo badge"
								autoFocus
							/>
							<button
								type="button"
								onClick={() => {
									setShowNewBadge(false);
									setNewBadge("");
								}}
								className="btn btn-ghost btn-sm"
							>
								<IconClose size={16} />
								Cancelar
							</button>
						</div>
					)}
				</div>

				{/* Link */}
				<div className="form-group">
					<label className="form-label">Link externo</label>
					<input
						type="url"
						value={formData.link}
						onChange={(e) => setFormData({ ...formData, link: e.target.value })}
						className="form-input"
						placeholder="https://loja.com/produto"
					/>
				</div>

				{/* Imagem */}
				<ImageUpload
					currentImage={product?.image}
					imageType={product?.imageType}
					onFileSelect={(file) => {
						setImageFile(file);
						setRemoveImage(false);
					}}
					onUrlChange={(url) => {
						setFormData({ ...formData, imageUrl: url });
						setRemoveImage(false);
					}}
					onRemove={() => {
						setImageFile(null);
						setFormData({ ...formData, imageUrl: "" });
						setRemoveImage(true);
					}}
				/>
			</div>

			{/* Botões */}
			<div className="form-actions">
				<button type="button" onClick={onCancel} disabled={loading} className="btn btn-ghost">
					<IconClose size={18} />
					Cancelar
				</button>
				<button
					type="submit"
					disabled={loading || !formData.name || !formData.price}
					className="btn btn-primary"
				>
					<IconCheck size={18} />
					{loading ? "Salvando..." : product ? "Atualizar" : "Criar Produto"}
				</button>
			</div>
		</form>
	);
}

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../hooks";
import type { Product, CreateProductDto, UpdateProductDto } from "../types";
import { ImageUpload } from "../components/products/ImageUpload";
import { Loading, ErrorMessage, IconClose, IconPlus, IconArrowLeft } from "../components/ui";

export function ProductCreatePage() {
	const navigate = useNavigate();
	const { createProduct, fetchCategories, fetchBadges } = useProducts();

	const [categories, setCategories] = useState<string[]>([]);
	const [badges, setBadges] = useState<string[]>([]);
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
	const [newCategory, setNewCategory] = useState("");
	const [newBadge, setNewBadge] = useState("");
	const [showNewCategory, setShowNewCategory] = useState(false);
	const [showNewBadge, setShowNewBadge] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const loadOptions = async () => {
			try {
				const [cats, bdgs] = await Promise.all([fetchCategories(), fetchBadges()]);
				setCategories(cats);
				setBadges(bdgs);
			} catch (err) {
				console.error("Erro ao carregar opções:", err);
			}
		};
		loadOptions();
	}, [fetchCategories, fetchBadges]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			const data: CreateProductDto = {
				name: formData.name,
				description: formData.description || undefined,
				price: parseFloat(formData.price),
				link: formData.link || undefined,
				badge: showNewBadge ? newBadge : formData.badge || undefined,
				sku: formData.sku || undefined,
				category: showNewCategory ? newCategory : formData.category || undefined,
				imageUrl: formData.imageUrl || undefined,
			};
			await createProduct(data, imageFile || undefined);
			navigate("/produtos");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erro ao criar produto";
			alert(message);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="page">
			<div className="page-header">
				<div className="page-header-content">
					<button onClick={() => navigate("/produtos")} className="btn btn-ghost btn-sm">
						<IconArrowLeft size={16} />
						Voltar
					</button>
					<h1 className="page-title">Novo Produto</h1>
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
								placeholder="Nome do produto"
								required
							/>
						</div>

						<div className="form-group">
							<label className="form-label">Descrição</label>
							<textarea
								value={formData.description}
								onChange={(e) => setFormData({ ...formData, description: e.target.value })}
								className="form-textarea"
								placeholder="Descrição do produto"
							/>
						</div>

						<div className="form-row">
							<div className="form-group">
								<label className="form-label">
									Preço <span className="form-required">*</span>
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
										className="btn btn-outline btn-sm"
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
										className="btn btn-outline btn-sm"
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

						<ImageUpload
							onFileSelect={(file) => setImageFile(file)}
							onUrlChange={(url) => setFormData({ ...formData, imageUrl: url })}
							onRemove={() => {
								setImageFile(null);
								setFormData({ ...formData, imageUrl: "" });
							}}
						/>

						<div className="form-actions">
							<button
								type="button"
								onClick={() => navigate("/produtos")}
								disabled={submitting}
								className="btn btn-secondary"
							>
								Cancelar
							</button>
							<button
								type="submit"
								disabled={submitting || !formData.name || !formData.price}
								className="btn btn-primary"
							>
								{submitting ? "Criando..." : "Criar Produto"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export function ProductEditPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { getProduct, updateProduct, fetchCategories, fetchBadges } = useProducts();

	const [product, setProduct] = useState<Product | null>(null);
	const [categories, setCategories] = useState<string[]>([]);
	const [badges, setBadges] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
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
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const loadData = async () => {
			if (!id) return;
			setLoading(true);
			try {
				const [productData, cats, bdgs] = await Promise.all([getProduct(id), fetchCategories(), fetchBadges()]);
				setProduct(productData);
				setCategories(cats);
				setBadges(bdgs);
				setFormData({
					name: productData.name,
					description: productData.description || "",
					price: String(productData.price),
					link: productData.link || "",
					badge: productData.badge || "",
					sku: productData.sku || "",
					category: productData.category || "",
					imageUrl: "",
				});
			} catch (err) {
				setError(err instanceof Error ? err.message : "Erro ao carregar produto");
			} finally {
				setLoading(false);
			}
		};
		loadData();
	}, [id, getProduct, fetchCategories, fetchBadges]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!product) return;

		setSubmitting(true);
		try {
			const data: UpdateProductDto = {
				name: formData.name,
				description: formData.description || undefined,
				price: parseFloat(formData.price),
				link: formData.link || undefined,
				badge: showNewBadge ? newBadge : formData.badge || undefined,
				sku: formData.sku || undefined,
				category: showNewCategory ? newCategory : formData.category || undefined,
				imageUrl: formData.imageUrl || undefined,
				removeImage: removeImage,
			};
			await updateProduct(product.id, data, imageFile || undefined);
			navigate("/produtos");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erro ao atualizar produto";
			alert(message);
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) return <Loading />;
	if (error) return <ErrorMessage message={error} />;
	if (!product) return <ErrorMessage message="Produto não encontrado" />;

	return (
		<div className="page">
			<div className="page-header">
				<div className="page-header-content">
					<button onClick={() => navigate("/produtos")} className="btn btn-ghost btn-sm">
						<IconArrowLeft size={16} />
						Voltar
					</button>
					<h1 className="page-title">Editar Produto</h1>
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
								placeholder="Nome do produto"
								required
							/>
						</div>

						<div className="form-group">
							<label className="form-label">Descrição</label>
							<textarea
								value={formData.description}
								onChange={(e) => setFormData({ ...formData, description: e.target.value })}
								className="form-textarea"
								placeholder="Descrição do produto"
							/>
						</div>

						<div className="form-row">
							<div className="form-group">
								<label className="form-label">
									Preço <span className="form-required">*</span>
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
										className="btn btn-outline btn-sm"
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
										className="btn btn-outline btn-sm"
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

						<ImageUpload
							currentImage={product.image}
							imageType={product.imageType}
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

						<div className="form-actions">
							<button
								type="button"
								onClick={() => navigate("/produtos")}
								disabled={submitting}
								className="btn btn-secondary"
							>
								Cancelar
							</button>
							<button
								type="submit"
								disabled={submitting || !formData.name || !formData.price}
								className="btn btn-primary"
							>
								{submitting ? "Salvando..." : "Salvar Alterações"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

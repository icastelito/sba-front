import type { Product } from "../../types";
import { formatCurrency } from "../../lib/utils";
import { API_BASE_URL } from "../../lib/api";
import { IconEdit, IconTrash, IconProducts, IconLink, IconEye, IconEyeOff } from "../ui";

interface ProductCardProps {
	product: Product;
	onEdit: (product: Product) => void;
	onToggleActive: (id: string) => void;
	onTogglePublic: (id: string) => void;
	onDelete: (id: string) => void;
}

export function ProductCard({ product, onEdit, onToggleActive, onTogglePublic, onDelete }: ProductCardProps) {
	const getImageUrl = () => {
		if (!product.image) return null;
		if (product.imageType === "external") return product.image;
		return `${API_BASE_URL}${product.image}`;
	};

	const imageUrl = getImageUrl();

	return (
		<div className={`card product-card ${!product.isActive ? "inactive" : ""}`}>
			{/* Imagem */}
			<div className="product-card-image">
				{imageUrl ? (
					<img src={imageUrl} alt={product.name} />
				) : (
					<div className="product-card-placeholder">
						<IconProducts size={48} />
					</div>
				)}

				{/* Badge */}
				{product.badge && <span className="product-card-badge">{product.badge}</span>}

				{/* Status inativo */}
				{!product.isActive && <span className="product-card-status">Inativo</span>}

				{/* Status público */}
				{product.isPublic && <span className="product-card-public">Público</span>}
			</div>

			{/* Conteúdo */}
			<div className="product-card-content">
				<h3 className="product-card-title">{product.name}</h3>

				{product.description && <p className="product-card-description">{product.description}</p>}

				{/* Preço */}
				<div className="product-card-price">{formatCurrency(product.price)}</div>

				{/* Meta */}
				<div className="product-card-meta">
					{product.category && <span className="badge badge-category">{product.category}</span>}

					{product.sku && <span className="badge badge-sku">SKU: {product.sku}</span>}
				</div>

				{/* Link externo */}
				{product.link && (
					<a href={product.link} target="_blank" rel="noopener noreferrer" className="product-card-link">
						<IconLink size={16} />
						Ver na loja
					</a>
				)}

				{/* Ações */}
				<div className="product-card-actions">
					<button onClick={() => onEdit(product)} className="btn btn-outline btn-sm">
						<IconEdit size={16} />
						Editar
					</button>
					<button
						onClick={() => onTogglePublic(product.id)}
						className="btn btn-ghost btn-sm"
						title={product.isPublic ? "Tornar privado" : "Tornar público"}
					>
						{product.isPublic ? <IconEyeOff size={16} /> : <IconEye size={16} />}
					</button>
					<button onClick={() => onToggleActive(product.id)} className="btn btn-ghost btn-sm">
						{product.isActive ? "Desativar" : "Ativar"}
					</button>
					<button
						onClick={() => onDelete(product.id)}
						className="btn btn-danger btn-icon btn-sm"
						title="Excluir"
					>
						<IconTrash size={16} />
					</button>
				</div>
			</div>
		</div>
	);
}

import type { Product } from "../../types";
import { formatCurrency } from "../../lib/utils";
import { API_BASE_URL } from "../../lib/api";
import { IconEdit, IconTrash, IconProducts, IconEye, IconEyeOff } from "../ui";

interface ProductListViewProps {
	products: Product[];
	onEdit: (product: Product) => void;
	onToggleActive: (id: string) => void;
	onTogglePublic: (id: string) => void;
	onDelete: (id: string) => void;
}

export function ProductListView({ products, onEdit, onToggleActive, onTogglePublic, onDelete }: ProductListViewProps) {
	const getImageUrl = (product: Product) => {
		if (!product.image) return null;
		if (product.imageType === "external") return product.image;
		return `${API_BASE_URL}${product.image}`;
	};

	return (
		<div className="list-view">
			<table className="list-table">
				<thead>
					<tr>
						<th style={{ width: "60px" }}></th>
						<th>Produto</th>
						<th style={{ width: "120px" }}>Categoria</th>
						<th style={{ width: "120px" }}>Preço</th>
						<th style={{ width: "100px" }}>Status</th>
						<th style={{ width: "160px" }}>Ações</th>
					</tr>
				</thead>
				<tbody>
					{products.map((product) => {
						const imageUrl = getImageUrl(product);
						return (
							<tr key={product.id} className={!product.isActive ? "row-inactive" : ""}>
								<td>
									<div className="list-image">
										{imageUrl ? (
											<img src={imageUrl} alt={product.name} />
										) : (
											<div className="list-image-placeholder">
												<IconProducts size={20} />
											</div>
										)}
									</div>
								</td>
								<td>
									<div className="list-title-cell">
										<span className="list-title">
											{product.name}
											{product.badge && (
												<span className="badge badge-sm badge-info ml-2">{product.badge}</span>
											)}
										</span>
										{product.sku && <span className="list-subtitle">SKU: {product.sku}</span>}
									</div>
								</td>
								<td>
									{product.category && (
										<span className="badge badge-secondary badge-sm">{product.category}</span>
									)}
								</td>
								<td>
									<span className="list-price">{formatCurrency(product.price)}</span>
								</td>
								<td>
									<div className="list-status-badges">
										<span
											className={`badge badge-sm ${
												product.isActive ? "badge-success" : "badge-secondary"
											}`}
										>
											{product.isActive ? "Ativo" : "Inativo"}
										</span>
										{product.isPublic && <span className="badge badge-sm badge-info">Público</span>}
									</div>
								</td>
								<td>
									<div className="list-actions">
										<button
											onClick={() => onEdit(product)}
											className="btn btn-ghost btn-icon btn-sm"
											aria-label="Editar"
										>
											<IconEdit size={16} />
										</button>
										<button
											onClick={() => onTogglePublic(product.id)}
											className="btn btn-ghost btn-icon btn-sm"
											title={product.isPublic ? "Tornar privado" : "Tornar público"}
										>
											{product.isPublic ? <IconEyeOff size={16} /> : <IconEye size={16} />}
										</button>
										<button
											onClick={() => onToggleActive(product.id)}
											className="btn btn-ghost btn-sm"
										>
											{product.isActive ? "Desativar" : "Ativar"}
										</button>
										<button
											onClick={() => onDelete(product.id)}
											className="btn btn-ghost btn-icon btn-icon-danger btn-sm"
											aria-label="Excluir"
										>
											<IconTrash size={16} />
										</button>
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

# 📦 Guia de Implementação - Produtos

Este documento serve como guia para implementar a interface do módulo de Produtos no frontend.

## 📑 Índice

-   [Visão Geral](#visão-geral)
-   [Endpoints da API](#endpoints-da-api)
-   [Tipos TypeScript](#tipos-typescript)
-   [Hooks Sugeridos](#hooks-sugeridos)
-   [Componentes](#componentes)
-   [Exemplos de Uso](#exemplos-de-uso)
-   [Boas Práticas](#boas-práticas)

---

## Visão Geral

O módulo de Produtos permite:

-   📦 Catálogo completo de produtos
-   🖼️ Upload de imagens (local ou URL externa)
-   💰 Preços e categorização
-   🏷️ Badges e SKUs
-   🔍 Filtros avançados por preço, categoria, etc.

---

## Endpoints da API

### Produtos (Products)

| Método   | Endpoint                      | Descrição                                     |
| -------- | ----------------------------- | --------------------------------------------- |
| `POST`   | `/products`                   | Criar produto (multipart/form-data)           |
| `GET`    | `/products`                   | Listar produtos com filtros                   |
| `GET`    | `/products/categories`        | Listar categorias existentes                  |
| `GET`    | `/products/badges`            | Listar badges existentes                      |
| `GET`    | `/products/:id`               | Buscar produto por ID                         |
| `PUT`    | `/products/:id`               | Atualizar produto                             |
| `PATCH`  | `/products/:id`               | Atualização parcial                           |
| `PATCH`  | `/products/:id/toggle-active` | Ativar/Desativar produto                      |
| `DELETE` | `/products/:id`               | Deletar produto                               |
| `DELETE` | `/products`                   | Deletar múltiplos (body: `{ ids: string[] }`) |

---

## Tipos TypeScript

### Enums

```typescript
export enum SortOrder {
	ASC = "asc",
	DESC = "desc",
}
```

### Tipos de Produto

```typescript
// types/product.ts
export interface Product {
	id: string;
	name: string;
	description: string | null;
	price: number;
	image: string | null;
	imageType: "local" | "external" | null;
	link: string | null;
	badge: string | null;
	sku: string | null;
	category: string | null;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateProductDto {
	name: string;
	description?: string;
	price: number;
	imageUrl?: string; // URL externa (se não enviar arquivo)
	link?: string;
	badge?: string;
	sku?: string;
	category?: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
	isActive?: boolean;
	removeImage?: boolean; // Para remover imagem existente
}

export interface ProductFilters {
	search?: string;
	category?: string;
	badge?: string;
	isActive?: boolean;
	priceMin?: number;
	priceMax?: number;
	hasImage?: boolean;
	page?: number;
	limit?: number;
	sortBy?: "name" | "price" | "createdAt" | "updatedAt" | "category";
	sortOrder?: SortOrder;
}
```

### Tipos Comuns

```typescript
// types/pagination.ts
export interface PaginationMeta {
	total: number;
	page: number;
	limit: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
}

export interface PaginatedResponse<T> {
	success: boolean;
	data: T[];
	meta: PaginationMeta;
}

export interface ApiResponse<T> {
	success: boolean;
	message?: string;
	data: T;
}
```

---

## Hooks Sugeridos

### useProducts.ts

```typescript
import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import {
	Product,
	CreateProductDto,
	UpdateProductDto,
	ProductFilters,
	PaginatedResponse,
	PaginationMeta,
} from "@/types";

export function useProducts() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState<PaginationMeta | null>(null);

	const fetchProducts = useCallback(async (filters: ProductFilters = {}) => {
		setLoading(true);
		try {
			const params = new URLSearchParams();
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined && value !== "") {
					params.append(key, String(value));
				}
			});

			const response = await api.get<PaginatedResponse<Product>>(`/products?${params}`);
			setProducts(response.data.data);
			setPagination(response.data.meta);
			return response.data;
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchCategories = useCallback(async () => {
		const response = await api.get<{ data: string[] }>("/products/categories");
		return response.data.data;
	}, []);

	const fetchBadges = useCallback(async () => {
		const response = await api.get<{ data: string[] }>("/products/badges");
		return response.data.data;
	}, []);

	// Criar produto com upload de imagem
	const createProduct = useCallback(async (data: CreateProductDto, imageFile?: File) => {
		const formData = new FormData();

		// Adicionar campos do DTO
		formData.append("name", data.name);
		formData.append("price", String(data.price));
		if (data.description) formData.append("description", data.description);
		if (data.imageUrl) formData.append("imageUrl", data.imageUrl);
		if (data.link) formData.append("link", data.link);
		if (data.badge) formData.append("badge", data.badge);
		if (data.sku) formData.append("sku", data.sku);
		if (data.category) formData.append("category", data.category);

		// Adicionar arquivo de imagem se fornecido
		if (imageFile) {
			formData.append("image", imageFile);
		}

		const response = await api.post<{ data: Product }>("/products", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return response.data.data;
	}, []);

	// Atualizar produto com upload de imagem
	const updateProduct = useCallback(async (id: string, data: UpdateProductDto, imageFile?: File) => {
		const formData = new FormData();

		// Adicionar campos do DTO
		if (data.name) formData.append("name", data.name);
		if (data.price !== undefined) formData.append("price", String(data.price));
		if (data.description !== undefined) formData.append("description", data.description);
		if (data.imageUrl) formData.append("imageUrl", data.imageUrl);
		if (data.link !== undefined) formData.append("link", data.link);
		if (data.badge !== undefined) formData.append("badge", data.badge);
		if (data.sku !== undefined) formData.append("sku", data.sku);
		if (data.category !== undefined) formData.append("category", data.category);
		if (data.isActive !== undefined) formData.append("isActive", String(data.isActive));
		if (data.removeImage) formData.append("removeImage", "true");

		// Adicionar arquivo de imagem se fornecido
		if (imageFile) {
			formData.append("image", imageFile);
		}

		const response = await api.patch<{ data: Product }>(`/products/${id}`, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return response.data.data;
	}, []);

	const toggleActive = useCallback(async (id: string) => {
		const response = await api.patch<{ data: Product }>(`/products/${id}/toggle-active`);
		return response.data.data;
	}, []);

	const deleteProduct = useCallback(async (id: string) => {
		await api.delete(`/products/${id}`);
	}, []);

	const deleteProducts = useCallback(async (ids: string[]) => {
		await api.delete("/products", { data: { ids } });
	}, []);

	return {
		products,
		loading,
		pagination,
		fetchProducts,
		fetchCategories,
		fetchBadges,
		createProduct,
		updateProduct,
		toggleActive,
		deleteProduct,
		deleteProducts,
	};
}
```

---

## Componentes

### Estrutura Sugerida

```
src/
├── components/
│   ├── products/
│   │   ├── ProductList.tsx        # Lista/grid de produtos
│   │   ├── ProductCard.tsx        # Card de produto
│   │   ├── ProductForm.tsx        # Formulário criar/editar
│   │   ├── ProductFilters.tsx     # Barra de filtros
│   │   ├── ImageUpload.tsx        # Componente de upload de imagem
│   │   └── CategorySelect.tsx     # Dropdown de categorias
│   └── ui/
│       ├── Pagination.tsx
│       ├── SearchInput.tsx
│       └── PriceInput.tsx
└── hooks/
    └── useProducts.ts
```

### ProductCard.tsx (Exemplo)

```tsx
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
	product: Product;
	onEdit: (product: Product) => void;
	onToggleActive: (id: string) => void;
	onDelete: (id: string) => void;
}

export function ProductCard({ product, onEdit, onToggleActive, onDelete }: ProductCardProps) {
	// Montar URL da imagem
	const imageUrl = product.image
		? product.imageType === "external"
			? product.image
			: `${process.env.NEXT_PUBLIC_API_URL}${product.image}`
		: "/placeholder-product.png";

	return (
		<div className={`product-card ${!product.isActive ? "opacity-50" : ""}`}>
			<div className="product-card__image">
				<img src={imageUrl} alt={product.name} />
				{product.badge && <span className="product-card__badge">{product.badge}</span>}
			</div>

			<div className="product-card__content">
				<h3 className="product-card__name">{product.name}</h3>

				{product.description && <p className="product-card__description">{product.description}</p>}

				<div className="product-card__meta">
					<span className="product-card__price">{formatCurrency(product.price)}</span>

					{product.category && <span className="product-card__category">{product.category}</span>}

					{product.sku && <span className="product-card__sku">SKU: {product.sku}</span>}
				</div>

				{product.link && (
					<a href={product.link} target="_blank" rel="noopener noreferrer" className="product-card__link">
						🔗 Ver na loja
					</a>
				)}
			</div>

			<div className="product-card__actions">
				<button onClick={() => onEdit(product)}>Editar</button>
				<button onClick={() => onToggleActive(product.id)}>{product.isActive ? "Desativar" : "Ativar"}</button>
				<button onClick={() => onDelete(product.id)} className="text-red-500">
					Excluir
				</button>
			</div>
		</div>
	);
}
```

### ImageUpload.tsx (Exemplo)

```tsx
import { useState, useRef } from "react";

interface ImageUploadProps {
	currentImage?: string | null;
	imageType?: "local" | "external" | null;
	onFileSelect: (file: File | null) => void;
	onUrlChange: (url: string) => void;
	onRemove: () => void;
}

export function ImageUpload({ currentImage, imageType, onFileSelect, onUrlChange, onRemove }: ImageUploadProps) {
	const [mode, setMode] = useState<"upload" | "url">("upload");
	const [preview, setPreview] = useState<string | null>(null);
	const [externalUrl, setExternalUrl] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Validar tipo
			const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
			if (!validTypes.includes(file.type)) {
				alert("Formato de imagem inválido. Use: JPG, PNG, GIF ou WebP");
				return;
			}

			// Validar tamanho (5MB)
			if (file.size > 5 * 1024 * 1024) {
				alert("Imagem muito grande. Máximo: 5MB");
				return;
			}

			setPreview(URL.createObjectURL(file));
			onFileSelect(file);
		}
	};

	const handleUrlSubmit = () => {
		if (externalUrl) {
			onUrlChange(externalUrl);
			setPreview(externalUrl);
		}
	};

	const handleRemove = () => {
		setPreview(null);
		setExternalUrl("");
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
		onFileSelect(null);
		onRemove();
	};

	// Imagem atual
	const displayImage =
		preview ||
		(currentImage
			? imageType === "external"
				? currentImage
				: `${process.env.NEXT_PUBLIC_API_URL}${currentImage}`
			: null);

	return (
		<div className="image-upload">
			{/* Tabs de modo */}
			<div className="image-upload__tabs">
				<button type="button" className={mode === "upload" ? "active" : ""} onClick={() => setMode("upload")}>
					📤 Upload
				</button>
				<button type="button" className={mode === "url" ? "active" : ""} onClick={() => setMode("url")}>
					🔗 URL Externa
				</button>
			</div>

			{/* Preview */}
			{displayImage && (
				<div className="image-upload__preview">
					<img src={displayImage} alt="Preview" />
					<button type="button" onClick={handleRemove} className="remove-btn">
						✕ Remover
					</button>
				</div>
			)}

			{/* Upload de arquivo */}
			{mode === "upload" && !displayImage && (
				<div className="image-upload__dropzone">
					<input
						ref={fileInputRef}
						type="file"
						accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
						onChange={handleFileChange}
					/>
					<p>Arraste uma imagem ou clique para selecionar</p>
					<small>JPG, PNG, GIF ou WebP • Máximo 5MB</small>
				</div>
			)}

			{/* URL externa */}
			{mode === "url" && !displayImage && (
				<div className="image-upload__url">
					<input
						type="url"
						placeholder="https://exemplo.com/imagem.jpg"
						value={externalUrl}
						onChange={(e) => setExternalUrl(e.target.value)}
					/>
					<button type="button" onClick={handleUrlSubmit}>
						Usar URL
					</button>
				</div>
			)}
		</div>
	);
}
```

---

## Exemplos de Uso

### Criando um produto com imagem

```typescript
// Com upload de arquivo
const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
const imageFile = fileInput.files?.[0];

const product = await createProduct(
	{
		name: "Chaveiro Acrílico BTS",
		description: "Chaveiro personalizado em acrílico 5cm",
		price: 15.9,
		category: "Chaveiros",
		badge: "Mais Vendido",
		sku: "CHV-BTS-001",
		link: "https://shopee.com.br/produto/123",
	},
	imageFile
);

// Com URL externa
const product2 = await createProduct({
	name: "Chaveiro K-Pop",
	price: 12.9,
	imageUrl: "https://exemplo.com/imagem.jpg",
});
```

### Filtrando produtos

```typescript
// Produtos ativos com preço até R$50
const { data } = await fetchProducts({
	isActive: true,
	priceMax: 50,
	sortBy: "price",
	sortOrder: "asc",
});

// Produtos de uma categoria
const { data: chaveiros } = await fetchProducts({
	category: "Chaveiros",
	hasImage: true,
});

// Busca por nome
const { data: results } = await fetchProducts({
	search: "BTS",
});
```

---

## Boas Práticas

### 1. Debounce na busca

```typescript
import { useDebouncedCallback } from "use-debounce";

const debouncedSearch = useDebouncedCallback((value: string) => {
	setFilters((prev) => ({ ...prev, search: value, page: 1 }));
}, 300);
```

### 2. Cache com React Query

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function useProducts(filters: ProductFilters) {
	const queryClient = useQueryClient();

	const { data, isLoading, error } = useQuery({
		queryKey: ["products", filters],
		queryFn: () => fetchProducts(filters),
	});

	const createMutation = useMutation({
		mutationFn: ({ data, file }: { data: CreateProductDto; file?: File }) => createProduct(data, file),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
	});

	return {
		products: data?.data || [],
		pagination: data?.meta,
		isLoading,
		error,
		createProduct: createMutation.mutate,
	};
}
```

### 3. Formatação de valores

```typescript
// lib/utils.ts
export function formatCurrency(value: number): string {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value);
}
```

---

## Wireframes Sugeridos

### Catálogo de Produtos

```
┌─────────────────────────────────────────────────────────────────┐
│  📦 Produtos                                    [+ Novo Produto] │
├─────────────────────────────────────────────────────────────────┤
│  🔍 Buscar...  │ Categoria ▼ │ Badge ▼ │ Preço: R$ ___ a ___ │  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  [Imagem]   │  │  [Imagem]   │  │  [Imagem]   │             │
│  │  ⭐ Destaque │  │             │  │  🔥 Mais    │             │
│  │             │  │             │  │     Vendido │             │
│  │ Chaveiro    │  │ Pulseira    │  │ Kit Sticker │             │
│  │ BTS         │  │ Kpop        │  │ BTS         │             │
│  │             │  │             │  │             │             │
│  │ R$ 15,90    │  │ R$ 12,90    │  │ R$ 25,90    │             │
│  │ [Chaveiros] │  │ [Acessórios]│  │ [Stickers]  │             │
│  │             │  │             │  │             │             │
│  │ [Editar]    │  │ [Editar]    │  │ [Editar]    │             │
│  │ [Excluir]   │  │ [Excluir]   │  │ [Excluir]   │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ◀ Anterior │ Página 1 de 3 │ Próxima ▶                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Configuração de Imagens

### URLs das Imagens

As imagens de produtos podem ser de dois tipos:

1. **Local** (`imageType: "local"`): Armazenada no servidor

    - URL: `{API_BASE_URL}/uploads/products/{filename}`
    - Exemplo: `http://localhost:3000/uploads/products/abc123.jpg`

2. **Externa** (`imageType: "external"`): URL externa
    - URL: O próprio campo `image` contém a URL completa
    - Exemplo: `https://shopee.com/images/produto.jpg`

### Componente de Imagem

```tsx
function ProductImage({ product }: { product: Product }) {
	if (!product.image) {
		return <img src="/placeholder.png" alt="Sem imagem" />;
	}

	const src = product.imageType === "external" ? product.image : `${process.env.NEXT_PUBLIC_API_URL}${product.image}`;

	return <img src={src} alt={product.name} />;
}
```

---

## Conclusão

Este guia fornece uma base sólida para implementar a interface do módulo de Produtos.

### Recursos principais:

-   ✅ CRUD completo com upload de imagens
-   ✅ Suporte a imagens locais e URLs externas
-   ✅ Limpeza automática de imagens ao editar/deletar
-   ✅ Filtros por categoria, badge, preço, etc.
-   ✅ Listagem de categorias e badges existentes
-   ✅ Paginação eficiente

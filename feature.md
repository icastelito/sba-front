# API de Clientes e Pedidos

Documentação das rotas para gerenciamento de clientes e pedidos de venda.

## Base URL

```
http://localhost:3000
```

---

## 📋 Clientes (`/clients`)

### Criar Cliente

```http
POST /clients
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "(11) 99999-9999",
  "document": "123.456.789-00",
  "address": "Rua das Flores, 123",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01234-567",
  "notes": "Cliente VIP",
  "isActive": true
}
```

**Resposta (201):**

```json
{
	"success": true,
	"message": "Cliente criado com sucesso",
	"data": {
		"id": "clxyz123",
		"name": "João Silva",
		"email": "joao@email.com",
		"phone": "(11) 99999-9999",
		"document": "123.456.789-00",
		"address": "Rua das Flores, 123",
		"city": "São Paulo",
		"state": "SP",
		"zipCode": "01234-567",
		"notes": "Cliente VIP",
		"isActive": true,
		"createdAt": "2024-12-14T10:00:00.000Z",
		"updatedAt": "2024-12-14T10:00:00.000Z"
	}
}
```

### Listar Clientes

```http
GET /clients?search=joao&city=São Paulo&state=SP&isActive=true&page=1&limit=20&sortBy=name&sortOrder=asc
```

**Parâmetros de Query:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `search` | string | Busca por nome, email, documento ou telefone |
| `city` | string | Filtrar por cidade |
| `state` | string | Filtrar por estado (UF) |
| `isActive` | boolean | Filtrar por status ativo |
| `page` | number | Página (padrão: 1) |
| `limit` | number | Itens por página (padrão: 20, máx: 100) |
| `sortBy` | string | Campo de ordenação: `name`, `email`, `createdAt`, `updatedAt` |
| `sortOrder` | string | Ordem: `asc` ou `desc` |

**Resposta (200):**

```json
{
	"success": true,
	"data": [
		{
			"id": "clxyz123",
			"name": "João Silva",
			"email": "joao@email.com",
			"phone": "(11) 99999-9999",
			"document": "123.456.789-00",
			"isActive": true,
			"ordersCount": 5,
			"createdAt": "2024-12-14T10:00:00.000Z"
		}
	],
	"pagination": {
		"page": 1,
		"limit": 20,
		"total": 50,
		"totalPages": 3
	}
}
```

### Buscar Cliente por ID

```http
GET /clients/:id
```

**Resposta (200):**

```json
{
	"success": true,
	"data": {
		"id": "clxyz123",
		"name": "João Silva",
		"email": "joao@email.com",
		"phone": "(11) 99999-9999",
		"document": "123.456.789-00",
		"address": "Rua das Flores, 123",
		"city": "São Paulo",
		"state": "SP",
		"zipCode": "01234-567",
		"notes": "Cliente VIP",
		"isActive": true,
		"ordersCount": 5,
		"recentOrders": [
			{
				"id": "order123",
				"orderNumber": 1001,
				"status": "DELIVERED",
				"total": 299.9,
				"createdAt": "2024-12-10T10:00:00.000Z"
			}
		],
		"createdAt": "2024-12-14T10:00:00.000Z",
		"updatedAt": "2024-12-14T10:00:00.000Z"
	}
}
```

### Atualizar Cliente

```http
PUT /clients/:id
Content-Type: application/json

{
  "name": "João Silva Santos",
  "phone": "(11) 98888-8888"
}
```

### Excluir Cliente

```http
DELETE /clients/:id
```

> ⚠️ Só é possível excluir clientes sem pedidos vinculados.

### Listar Cidades

```http
GET /clients/cities
```

### Listar Estados

```http
GET /clients/states
```

---

## 🛒 Pedidos de Venda (`/sales-orders`)

### Status Disponíveis

| Status       | Descrição          |
| ------------ | ------------------ |
| `PENDING`    | Pendente (inicial) |
| `CONFIRMED`  | Confirmado         |
| `PAID`       | Pago               |
| `PROCESSING` | Em processamento   |
| `SHIPPED`    | Enviado            |
| `DELIVERED`  | Entregue           |
| `CANCELED`   | Cancelado          |
| `REFUNDED`   | Reembolsado        |

### Fluxo de Status

```
PENDING → CONFIRMED → PAID → PROCESSING → SHIPPED → DELIVERED
    ↓         ↓        ↓         ↓           ↓
 CANCELED  CANCELED  REFUNDED  REFUNDED   REFUNDED
```

### Criar Pedido

```http
POST /sales-orders
Content-Type: application/json

{
  "clientId": "clxyz123",
  "items": [
    {
      "productId": "prod001",
      "quantity": 2,
      "discount": 10.00,
      "unitPrice": 99.90
    },
    {
      "productId": "prod002",
      "quantity": 1
    }
  ],
  "discount": 20.00,
  "shipping": 15.00,
  "notes": "Entregar no período da manhã",
  "paymentMethod": "PIX"
}
```

**Campos dos Itens:**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `productId` | string | ✅ | ID do produto |
| `quantity` | number | ✅ | Quantidade (mínimo: 1) |
| `unitPrice` | number | ❌ | Preço unitário (usa preço do produto se não informado) |
| `discount` | number | ❌ | Desconto no item (padrão: 0) |

**Resposta (201):**

```json
{
	"success": true,
	"message": "Pedido criado com sucesso",
	"data": {
		"id": "order123",
		"orderNumber": 1001,
		"status": "PENDING",
		"subtotal": 189.8,
		"discount": 20.0,
		"shipping": 15.0,
		"total": 184.8,
		"notes": "Entregar no período da manhã",
		"paymentMethod": "PIX",
		"client": {
			"id": "clxyz123",
			"name": "João Silva",
			"email": "joao@email.com",
			"phone": "(11) 99999-9999"
		},
		"items": [
			{
				"id": "item001",
				"productId": "prod001",
				"productName": "Camiseta Básica",
				"productSku": "CAM-001",
				"quantity": 2,
				"unitPrice": 99.9,
				"discount": 10.0,
				"total": 189.8,
				"product": {
					"id": "prod001",
					"name": "Camiseta Básica",
					"image": "/uploads/products/camiseta.jpg",
					"imageType": "local"
				}
			}
		],
		"createdAt": "2024-12-14T10:00:00.000Z",
		"updatedAt": "2024-12-14T10:00:00.000Z"
	}
}
```

### Listar Pedidos

```http
GET /sales-orders?clientId=clxyz123&status=PENDING&dateFrom=2024-12-01&dateTo=2024-12-31&page=1&limit=20
```

**Parâmetros de Query:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `search` | string | Busca por número do pedido ou nome do cliente |
| `clientId` | string | Filtrar por cliente |
| `status` | string | Filtrar por status |
| `dateFrom` | string | Data inicial (ISO 8601) |
| `dateTo` | string | Data final (ISO 8601) |
| `totalMin` | number | Valor mínimo do pedido |
| `totalMax` | number | Valor máximo do pedido |
| `page` | number | Página (padrão: 1) |
| `limit` | number | Itens por página (padrão: 20, máx: 100) |
| `sortBy` | string | Campo: `orderNumber`, `total`, `status`, `createdAt`, `updatedAt` |
| `sortOrder` | string | Ordem: `asc` ou `desc` |

### Buscar Pedido por ID

```http
GET /sales-orders/:id
```

### Buscar Pedido por Número

```http
GET /sales-orders/by-number/:orderNumber
```

### Atualizar Pedido

```http
PUT /sales-orders/:id
Content-Type: application/json

{
  "discount": 30.00,
  "shipping": 0,
  "notes": "Frete grátis aplicado",
  "items": [
    {
      "productId": "prod001",
      "quantity": 3
    }
  ]
}
```

> ⚠️ Pedidos com status `SHIPPED`, `DELIVERED`, `CANCELED` ou `REFUNDED` não podem ser editados.

### Atualizar Status do Pedido

```http
PATCH /sales-orders/:id/status
Content-Type: application/json

{
  "status": "PAID",
  "reason": "Pagamento confirmado via PIX"
}
```

**Transições Válidas:**

-   `PENDING` → `CONFIRMED`, `PAID`, `CANCELED`
-   `CONFIRMED` → `PAID`, `CANCELED`
-   `PAID` → `PROCESSING`, `SHIPPED`, `REFUNDED`
-   `PROCESSING` → `SHIPPED`, `REFUNDED`
-   `SHIPPED` → `DELIVERED`, `REFUNDED`
-   `DELIVERED` → `REFUNDED`

### Excluir Pedido

```http
DELETE /sales-orders/:id
```

> ⚠️ Apenas pedidos `PENDING` ou `CANCELED` podem ser excluídos.

### Estatísticas de Pedidos

```http
GET /sales-orders/stats
```

**Resposta (200):**

```json
{
	"success": true,
	"data": {
		"totalOrders": 150,
		"pendingOrders": 12,
		"paidOrders": 120,
		"canceledOrders": 18,
		"totalRevenue": 45890.5,
		"todayOrders": 5
	}
}
```

---

## 🔧 Exemplos de Uso no Frontend (React/TypeScript)

### Tipos

```typescript
interface Client {
	id: string;
	name: string;
	email?: string;
	phone?: string;
	document?: string;
	address?: string;
	city?: string;
	state?: string;
	zipCode?: string;
	notes?: string;
	isActive: boolean;
	ordersCount?: number;
	createdAt: string;
	updatedAt: string;
}

interface SalesOrderItem {
	id: string;
	productId: string;
	productName: string;
	productSku?: string;
	quantity: number;
	unitPrice: number;
	discount: number;
	total: number;
	product?: {
		id: string;
		name: string;
		image?: string;
		imageType?: string;
	};
}

interface SalesOrder {
	id: string;
	orderNumber: number;
	status: "PENDING" | "CONFIRMED" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELED" | "REFUNDED";
	subtotal: number;
	discount: number;
	shipping: number;
	total: number;
	notes?: string;
	paymentMethod?: string;
	paidAt?: string;
	shippedAt?: string;
	deliveredAt?: string;
	canceledAt?: string;
	client: Client;
	items: SalesOrderItem[];
	createdAt: string;
	updatedAt: string;
}
```

### Serviço de API

```typescript
const API_URL = "http://localhost:3000";

// Clientes
export const clientsApi = {
	list: (params?: Record<string, any>) =>
		fetch(`${API_URL}/clients?${new URLSearchParams(params)}`).then((r) => r.json()),

	getById: (id: string) => fetch(`${API_URL}/clients/${id}`).then((r) => r.json()),

	create: (data: Partial<Client>) =>
		fetch(`${API_URL}/clients`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		}).then((r) => r.json()),

	update: (id: string, data: Partial<Client>) =>
		fetch(`${API_URL}/clients/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		}).then((r) => r.json()),

	delete: (id: string) => fetch(`${API_URL}/clients/${id}`, { method: "DELETE" }).then((r) => r.json()),
};

// Pedidos
export const ordersApi = {
	list: (params?: Record<string, any>) =>
		fetch(`${API_URL}/sales-orders?${new URLSearchParams(params)}`).then((r) => r.json()),

	getById: (id: string) => fetch(`${API_URL}/sales-orders/${id}`).then((r) => r.json()),

	getByNumber: (orderNumber: number) =>
		fetch(`${API_URL}/sales-orders/by-number/${orderNumber}`).then((r) => r.json()),

	create: (data: {
		clientId: string;
		items: any[];
		discount?: number;
		shipping?: number;
		notes?: string;
		paymentMethod?: string;
	}) =>
		fetch(`${API_URL}/sales-orders`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		}).then((r) => r.json()),

	update: (id: string, data: Partial<SalesOrder>) =>
		fetch(`${API_URL}/sales-orders/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		}).then((r) => r.json()),

	updateStatus: (id: string, status: string, reason?: string) =>
		fetch(`${API_URL}/sales-orders/${id}/status`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ status, reason }),
		}).then((r) => r.json()),

	delete: (id: string) => fetch(`${API_URL}/sales-orders/${id}`, { method: "DELETE" }).then((r) => r.json()),

	getStats: () => fetch(`${API_URL}/sales-orders/stats`).then((r) => r.json()),
};
```

### Exemplo de Uso com React Query

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Hook para listar pedidos
export function useOrders(filters?: Record<string, any>) {
	return useQuery({
		queryKey: ["orders", filters],
		queryFn: () => ordersApi.list(filters),
	});
}

// Hook para criar pedido
export function useCreateOrder() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ordersApi.create,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
	});
}

// Hook para atualizar status
export function useUpdateOrderStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, status, reason }: { id: string; status: string; reason?: string }) =>
			ordersApi.updateStatus(id, status, reason),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
	});
}
```

---

## ❌ Códigos de Erro

| Código | Descrição                                                              |
| ------ | ---------------------------------------------------------------------- |
| 400    | Bad Request - Dados inválidos ou transição de status inválida          |
| 404    | Not Found - Cliente, pedido ou produto não encontrado                  |
| 409    | Conflict - Email/documento já existe ou cliente tem pedidos vinculados |

**Exemplo de erro:**

```json
{
	"statusCode": 400,
	"message": "Transição de status inválida: DELIVERED -> PENDING",
	"error": "Bad Request"
}
```

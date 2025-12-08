# 📚 API Routes Guide - SBA API

> **Base URL:** `http://localhost:3000/api`

---

## 🏥 Health Check

| Método | Rota      | Descrição                            |
| ------ | --------- | ------------------------------------ |
| GET    | `/health` | Status da aplicação e banco de dados |

---

## 🔐 Auth (Shopee)

| Método | Rota                     | Descrição                   |
| ------ | ------------------------ | --------------------------- |
| GET    | `/auth/shopee/authorize` | Iniciar fluxo OAuth Shopee  |
| GET    | `/auth/shopee/callback`  | Callback do OAuth Shopee    |
| GET    | `/auth/shopee/debug`     | Debug de configuração OAuth |

---

## 📦 Webhooks

| Método | Rota               | Descrição                  |
| ------ | ------------------ | -------------------------- |
| POST   | `/webhooks/shopee` | Receber webhooks da Shopee |

---

## ✅ Todos (Tarefas)

| Método | Rota                  | Descrição                            |
| ------ | --------------------- | ------------------------------------ |
| POST   | `/todos`              | Criar tarefa                         |
| GET    | `/todos`              | Listar tarefas (com filtros)         |
| GET    | `/todos/stats`        | Estatísticas das tarefas             |
| GET    | `/todos/:id`          | Buscar tarefa por ID                 |
| PUT    | `/todos/:id`          | Atualizar tarefa (completo)          |
| PATCH  | `/todos/:id`          | Atualizar tarefa (parcial)           |
| PATCH  | `/todos/:id/complete` | Marcar como concluída/reabrir        |
| DELETE | `/todos/:id`          | Remover tarefa                       |
| DELETE | `/todos`              | Remover várias tarefas (body: ids[]) |

### Query Parameters (GET /todos)

| Parâmetro     | Tipo     | Descrição                                                        |
| ------------- | -------- | ---------------------------------------------------------------- |
| `search`      | string   | Busca por título/descrição                                       |
| `completed`   | boolean  | Filtrar por status                                               |
| `requesterId` | number   | Filtrar por demandante                                           |
| `tag`         | string   | Filtrar por tag                                                  |
| `dueDateFrom` | ISO date | Data de vencimento inicial                                       |
| `dueDateTo`   | ISO date | Data de vencimento final                                         |
| `overdue`     | boolean  | Apenas tarefas vencidas                                          |
| `page`        | number   | Página (default: 1)                                              |
| `limit`       | number   | Itens por página (default: 20, max: 100)                         |
| `sortBy`      | enum     | Campo de ordenação: `title`, `dueDate`, `createdAt`, `updatedAt` |
| `sortOrder`   | enum     | Direção: `asc`, `desc`                                           |

### Request Body (POST /todos)

```json
{
	"title": "string (obrigatório, max 200)",
	"description": "string (opcional, max 2000)",
	"dueDate": "ISO date (opcional)",
	"requesterId": "number (opcional)",
	"assignedTo": "string (opcional)",
	"tags": ["string"]
}
```

---

## 👤 Requesters (Demandantes)

| Método | Rota                            | Descrição            |
| ------ | ------------------------------- | -------------------- |
| POST   | `/requesters`                   | Criar demandante     |
| GET    | `/requesters`                   | Listar demandantes   |
| GET    | `/requesters/:id`               | Buscar por ID        |
| PUT    | `/requesters/:id`               | Atualizar (completo) |
| PATCH  | `/requesters/:id`               | Atualizar (parcial)  |
| PATCH  | `/requesters/:id/toggle-active` | Ativar/desativar     |
| DELETE | `/requesters/:id`               | Remover demandante   |

### Query Parameters (GET /requesters)

| Parâmetro    | Tipo    | Descrição                      |
| ------------ | ------- | ------------------------------ |
| `search`     | string  | Busca por nome/email           |
| `isActive`   | boolean | Filtrar por status ativo       |
| `department` | string  | Filtrar por departamento       |
| `page`       | number  | Página (default: 1)            |
| `limit`      | number  | Itens por página (default: 20) |

### Request Body (POST /requesters)

```json
{
	"name": "string (obrigatório)",
	"email": "string (opcional, único)",
	"phone": "string (opcional)",
	"department": "string (opcional)"
}
```

---

## 📋 Templates (Task Templates)

| Método | Rota                         | Descrição                         |
| ------ | ---------------------------- | --------------------------------- |
| POST   | `/templates`                 | Criar template                    |
| GET    | `/templates`                 | Listar templates                  |
| GET    | `/templates/tags`            | Listar todas as tags              |
| GET    | `/templates/stats`           | Estatísticas de uso               |
| GET    | `/templates/:id`             | Buscar por ID                     |
| PATCH  | `/templates/:id`             | Atualizar template                |
| DELETE | `/templates/:id`             | Remover template                  |
| POST   | `/templates/:id/create-task` | Criar tarefa a partir do template |

### Query Parameters (GET /templates)

| Parâmetro   | Tipo   | Descrição                         |
| ----------- | ------ | --------------------------------- |
| `search`    | string | Busca por título/descrição        |
| `tag`       | string | Filtrar por tag                   |
| `page`      | number | Página (default: 1)               |
| `limit`     | number | Itens por página (default: 20)    |
| `sortBy`    | enum   | `title`, `createdAt`, `updatedAt` |
| `sortOrder` | enum   | `asc`, `desc`                     |

### Request Body (POST /templates)

```json
{
	"title": "string (obrigatório, max 200)",
	"description": "string (opcional, max 2000)",
	"defaultDueDays": "number (opcional, min 1)",
	"tags": ["string"]
}
```

### Request Body (POST /templates/:id/create-task)

```json
{
	"title": "string (opcional - usa do template se não informado)",
	"description": "string (opcional)",
	"dueDate": "ISO date (opcional - calculado se template tem defaultDueDays)",
	"assignedTo": "string (opcional)",
	"requesterId": "number (opcional)"
}
```

---

## 🛒 Products (Produtos)

| Método | Rota                          | Descrição                                |
| ------ | ----------------------------- | ---------------------------------------- |
| POST   | `/products`                   | Criar produto (multipart/form-data)      |
| GET    | `/products`                   | Listar produtos                          |
| GET    | `/products/categories`        | Listar categorias                        |
| GET    | `/products/badges`            | Listar badges                            |
| GET    | `/products/public`            | Listar produtos públicos (para externos) |
| GET    | `/products/:id`               | Buscar por ID                            |
| PUT    | `/products/:id`               | Atualizar (completo, multipart)          |
| PATCH  | `/products/:id`               | Atualizar (parcial, multipart)           |
| PATCH  | `/products/:id/toggle-active` | Ativar/desativar                         |
| PATCH  | `/products/:id/toggle-public` | Alternar visibilidade pública            |
| DELETE | `/products/:id`               | Remover produto                          |
| DELETE | `/products`                   | Remover vários (body: ids[])             |

### Query Parameters (GET /products)

| Parâmetro   | Tipo    | Descrição                                 |
| ----------- | ------- | ----------------------------------------- |
| `search`    | string  | Busca por nome/descrição/SKU              |
| `category`  | string  | Filtrar por categoria                     |
| `badge`     | string  | Filtrar por badge                         |
| `isActive`  | boolean | Filtrar por status ativo                  |
| `isPublic`  | boolean | Filtrar por visibilidade pública          |
| `minPrice`  | number  | Preço mínimo                              |
| `maxPrice`  | number  | Preço máximo                              |
| `page`      | number  | Página (default: 1)                       |
| `limit`     | number  | Itens por página (default: 20)            |
| `sortBy`    | enum    | `name`, `price`, `createdAt`, `updatedAt` |
| `sortOrder` | enum    | `asc`, `desc`                             |

### Request Body (POST /products - multipart/form-data)

| Campo         | Tipo    | Descrição                            |
| ------------- | ------- | ------------------------------------ |
| `name`        | string  | Nome do produto (obrigatório)        |
| `description` | string  | Descrição (opcional)                 |
| `price`       | number  | Preço (obrigatório)                  |
| `sku`         | string  | SKU único (opcional)                 |
| `category`    | string  | Categoria (opcional)                 |
| `badge`       | string  | Badge/etiqueta (opcional)            |
| `link`        | string  | Link externo (opcional)              |
| `image`       | file    | Arquivo de imagem (opcional)         |
| `imageUrl`    | string  | URL externa de imagem (opcional)     |
| `removeImage` | boolean | Remover imagem atual (opcional)      |
| `isPublic`    | boolean | Exibir externamente (default: false) |

> **Nota:** Se enviar `image` (arquivo), o sistema salva localmente. Se enviar `imageUrl`, usa a URL externa. Se enviar `removeImage: true`, remove a imagem atual.

---

## 📁 Static Files

| Rota                  | Descrição                                    |
| --------------------- | -------------------------------------------- |
| `/uploads/products/*` | Imagens de produtos (servidas estaticamente) |

---

## 🔄 Response Format

### Sucesso (Lista com paginação)

```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "hasMore": true
  }
}
```

### Sucesso (Item único)

```json
{
  "id": "...",
  "title": "...",
  ...
}
```

### Erro

```json
{
	"statusCode": 400,
	"message": "Mensagem de erro",
	"error": "Bad Request"
}
```

---

## 📝 Notas

-   Todos os endpoints (exceto `/uploads/*`) usam o prefixo `/api`
-   IDs de `Requester` e `Product` são **inteiros** (autoincrement)
-   IDs de `TodoTask` e `TaskTemplate` são **UUIDs**
-   Datas devem ser enviadas em formato **ISO 8601** (ex: `2025-12-31T23:59:59.000Z`)
-   Validação automática em todos os endpoints (400 Bad Request se inválido)
-   CORS habilitado para todas as origens (configurável via `APP_ORIGIN`)

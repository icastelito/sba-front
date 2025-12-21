# API de Tags - Documentação para Frontend

## Visão Geral

O sistema de Tags permite categorizar templates de tarefas e outros recursos. As tags são gerenciadas de forma centralizada e validadas antes de serem utilizadas em outros módulos.

---

## Endpoints

### Base URL

```
/tags
```

---

## 1. Criar Tag

**POST** `/tags`

Cria uma nova tag no sistema.

### Request Body

```json
{
  "name": "urgente",
  "color": "#FF5733",
  "description": "Tarefas que precisam de atenção imediata",
  "isActive": true
}
```

### Campos

| Campo         | Tipo    | Obrigatório | Descrição                                                         |
| ------------- | ------- | ----------- | ----------------------------------------------------------------- |
| `name`        | string  | ✅          | Nome único da tag (max: 50 chars). Será convertido para lowercase |
| `color`       | string  | ❌          | Código hex da cor (ex: #FF5733)                                   |
| `description` | string  | ❌          | Descrição da tag (max: 200 chars)                                 |
| `isActive`    | boolean | ❌          | Se a tag está ativa (default: true)                               |

### Response (201 Created)

```json
{
  "id": "uuid-da-tag",
  "name": "urgente",
  "color": "#FF5733",
  "description": "Tarefas que precisam de atenção imediata",
  "isActive": true,
  "createdAt": "2024-12-21T00:00:00.000Z",
  "updatedAt": "2024-12-21T00:00:00.000Z"
}
```

### Erros Possíveis

- `409 Conflict`: Tag com este nome já existe

---

## 2. Criar Múltiplas Tags (Batch)

**POST** `/tags/batch`

Cria várias tags de uma vez.

### Request Body

```json
[
  { "name": "urgente", "color": "#FF0000" },
  { "name": "baixa-prioridade", "color": "#00FF00" },
  { "name": "em-revisao", "color": "#0000FF" }
]
```

### Response (201 Created)

```json
{
  "created": [
    { "id": "uuid-1", "name": "urgente", "color": "#FF0000", ... },
    { "id": "uuid-2", "name": "baixa-prioridade", "color": "#00FF00", ... }
  ],
  "errors": [
    { "name": "em-revisao", "error": "Tag \"em-revisao\" já existe" }
  ],
  "summary": {
    "total": 3,
    "success": 2,
    "failed": 1
  }
}
```

---

## 3. Listar Tags

**GET** `/tags`

Lista todas as tags com filtros e paginação.

### Query Parameters

| Parâmetro   | Tipo    | Default | Descrição                       |
| ----------- | ------- | ------- | ------------------------------- |
| `search`    | string  | -       | Busca por nome ou descrição     |
| `isActive`  | boolean | -       | Filtrar por status (true/false) |
| `page`      | number  | 1       | Página atual                    |
| `limit`     | number  | 50      | Itens por página                |
| `sortBy`    | string  | name    | Campo para ordenação            |
| `sortOrder` | string  | asc     | Ordem (asc/desc)                |

### Exemplos

```
GET /tags
GET /tags?search=urgente
GET /tags?isActive=true&sortBy=createdAt&sortOrder=desc
GET /tags?page=2&limit=10
```

### Response (200 OK)

```json
{
  "data": [
    {
      "id": "uuid-1",
      "name": "urgente",
      "color": "#FF5733",
      "description": "Tarefas urgentes",
      "isActive": true,
      "createdAt": "2024-12-21T00:00:00.000Z",
      "updatedAt": "2024-12-21T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 50,
    "totalPages": 1,
    "hasMore": false
  }
}
```

---

## 4. Listar Tags Ativas (para Select/Dropdown)

**GET** `/tags/active`

Retorna apenas tags ativas em formato simplificado para uso em componentes de seleção.

### Response (200 OK)

```json
[
  { "id": "uuid-1", "name": "urgente", "color": "#FF5733" },
  { "id": "uuid-2", "name": "baixa-prioridade", "color": "#00FF00" },
  { "id": "uuid-3", "name": "em-revisao", "color": "#0000FF" }
]
```

### Uso Recomendado

Este endpoint é ideal para popular:

- Dropdowns de seleção múltipla
- Tags autocomplete
- Filtros de busca

---

## 5. Buscar Tag por ID

**GET** `/tags/:id`

### Response (200 OK)

```json
{
  "id": "uuid-da-tag",
  "name": "urgente",
  "color": "#FF5733",
  "description": "Tarefas urgentes",
  "isActive": true,
  "createdAt": "2024-12-21T00:00:00.000Z",
  "updatedAt": "2024-12-21T00:00:00.000Z"
}
```

### Erros

- `404 Not Found`: Tag não encontrada

---

## 6. Atualizar Tag

**PATCH** `/tags/:id`

### Request Body

```json
{
  "name": "muito-urgente",
  "color": "#FF0000",
  "description": "Nova descrição",
  "isActive": false
}
```

Todos os campos são opcionais.

### Response (200 OK)

Retorna a tag atualizada.

### Erros

- `404 Not Found`: Tag não encontrada
- `409 Conflict`: Nome já existe em outra tag

---

## 7. Remover Tag

**DELETE** `/tags/:id`

Remove uma tag do sistema.

### Response (200 OK)

```json
{
  "id": "uuid-removido",
  "name": "tag-removida",
  ...
}
```

### Erros

- `404 Not Found`: Tag não encontrada

> ⚠️ **Atenção**: A remoção de uma tag NÃO remove automaticamente seu uso em templates existentes. Os templates manterão a referência ao nome da tag, mas ela não será mais validada.

---

## 8. Validar Tags

**POST** `/tags/validate`

Valida se um array de tags existe e está ativo no sistema.

### Request Body

```json
{
  "tags": ["urgente", "baixa-prioridade", "inexistente"]
}
```

### Response (200 OK) - Todas válidas

```json
{
  "valid": true,
  "tags": ["urgente", "baixa-prioridade"]
}
```

### Response (400 Bad Request) - Tags inválidas

```json
{
  "statusCode": 400,
  "message": "Tags inválidas ou inativas: inexistente. Use GET /tags/active para ver as tags disponíveis.",
  "error": "Bad Request"
}
```

---

## 9. Estatísticas de Tags

**GET** `/tags/stats`

Retorna estatísticas sobre o uso das tags.

### Response (200 OK)

```json
{
  "total": 15,
  "active": 12,
  "inactive": 3,
  "mostUsed": [
    { "name": "urgente", "usageCount": 45 },
    { "name": "baixa-prioridade", "usageCount": 30 },
    { "name": "em-revisao", "usageCount": 22 }
  ]
}
```

---

## Integração com Templates

### Criando Template com Tags

As tags agora são **validadas** antes de serem aceitas em um template.

**POST** `/templates`

```json
{
  "title": "Checklist de Qualidade",
  "description": "Template para revisão de código",
  "defaultDueDays": 5,
  "tags": ["urgente", "revisao"]
}
```

### Fluxo Recomendado no Frontend

1. **Carregar tags disponíveis**:

   ```javascript
   const { data: tags } = await api.get("/tags/active");
   ```

2. **Montar componente de seleção**:

   ```jsx
   <MultiSelect
     options={tags.map((t) => ({
       value: t.name,
       label: t.name,
       color: t.color,
     }))}
     onChange={setSelectedTags}
   />
   ```

3. **Enviar no create/update**:
   ```javascript
   await api.post("/templates", {
     title: "Meu Template",
     tags: selectedTags, // Array de nomes
   });
   ```

---

## Componente React de Exemplo

```tsx
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface Tag {
  id: string;
  name: string;
  color: string | null;
}

export function TagSelector({
  value = [],
  onChange,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
}) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tags/active")
      .then((res) => res.json())
      .then((data) => {
        setTags(data);
        setLoading(false);
      });
  }, []);

  const toggleTag = (tagName: string) => {
    if (value.includes(tagName)) {
      onChange(value.filter((t) => t !== tagName));
    } else {
      onChange([...value, tagName]);
    }
  };

  if (loading) return <div>Carregando tags...</div>;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          variant={value.includes(tag.name) ? "default" : "outline"}
          style={{
            backgroundColor: value.includes(tag.name)
              ? tag.color || undefined
              : undefined,
            borderColor: tag.color || undefined,
          }}
          className="cursor-pointer"
          onClick={() => toggleTag(tag.name)}
        >
          {tag.name}
        </Badge>
      ))}
    </div>
  );
}
```

---

## Gerenciamento de Tags (CRUD)

### Componente de Listagem

```tsx
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";

interface Tag {
  id: string;
  name: string;
  color: string | null;
  description: string | null;
  isActive: boolean;
}

export function TagList() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });

  const fetchTags = async (page = 1) => {
    const res = await fetch(`/api/tags?page=${page}&limit=20`);
    const data = await res.json();
    setTags(data.data);
    setMeta(data.meta);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta tag?")) return;

    await fetch(`/api/tags/${id}`, { method: "DELETE" });
    fetchTags(meta.page);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Cor</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tags.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell>
                <Badge style={{ backgroundColor: tag.color || "#666" }}>
                  {tag.name}
                </Badge>
              </TableCell>
              <TableCell>
                {tag.color && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.color}
                  </div>
                )}
              </TableCell>
              <TableCell>{tag.description || "-"}</TableCell>
              <TableCell>
                <Badge variant={tag.isActive ? "default" : "secondary"}>
                  {tag.isActive ? "Ativa" : "Inativa"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(tag.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

### Formulário de Criação/Edição

```tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface TagFormProps {
  initialData?: {
    id?: string;
    name: string;
    color: string | null;
    description: string | null;
    isActive: boolean;
  };
  onSuccess: () => void;
}

export function TagForm({ initialData, onSuccess }: TagFormProps) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    color: initialData?.color || "#3B82F6",
    description: initialData?.description || "",
    isActive: initialData?.isActive ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!initialData?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEdit ? `/api/tags/${initialData.id}` : "/api/tags";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-800 rounded">{error}</div>
      )}

      <div>
        <Label htmlFor="name">Nome da Tag *</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="ex: urgente"
          required
          maxLength={50}
        />
      </div>

      <div>
        <Label htmlFor="color">Cor</Label>
        <div className="flex gap-2">
          <Input
            id="color"
            type="color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="w-16 h-10 p-1"
          />
          <Input
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            placeholder="#FF5733"
            pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Descrição opcional da tag"
          maxLength={200}
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="isActive"
          checked={form.isActive}
          onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
        />
        <Label htmlFor="isActive">Tag ativa</Label>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Salvando..." : isEdit ? "Atualizar Tag" : "Criar Tag"}
      </Button>
    </form>
  );
}
```

---

## TypeScript Types

```typescript
// types/tag.ts

export interface Tag {
  id: string;
  name: string;
  color: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TagSimple {
  id: string;
  name: string;
  color: string | null;
}

export interface CreateTagDto {
  name: string;
  color?: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateTagDto {
  name?: string;
  color?: string;
  description?: string;
  isActive?: boolean;
}

export interface TagListResponse {
  data: Tag[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface TagStats {
  total: number;
  active: number;
  inactive: number;
  mostUsed: Array<{
    name: string;
    usageCount: number;
  }>;
}

export interface TagValidationResponse {
  valid: boolean;
  tags: string[];
}
```

---

## Service/Hook de API

```typescript
// services/tagService.ts

import { api } from "@/lib/api";
import type {
  Tag,
  TagSimple,
  CreateTagDto,
  UpdateTagDto,
  TagListResponse,
  TagStats,
} from "@/types/tag";

export const tagService = {
  // Listar tags com filtros
  list: async (params?: {
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<TagListResponse> => {
    const { data } = await api.get("/tags", { params });
    return data;
  },

  // Listar tags ativas (para selects)
  getActive: async (): Promise<TagSimple[]> => {
    const { data } = await api.get("/tags/active");
    return data;
  },

  // Buscar por ID
  getById: async (id: string): Promise<Tag> => {
    const { data } = await api.get(`/tags/${id}`);
    return data;
  },

  // Criar tag
  create: async (dto: CreateTagDto): Promise<Tag> => {
    const { data } = await api.post("/tags", dto);
    return data;
  },

  // Criar múltiplas
  createBatch: async (tags: CreateTagDto[]) => {
    const { data } = await api.post("/tags/batch", tags);
    return data;
  },

  // Atualizar
  update: async (id: string, dto: UpdateTagDto): Promise<Tag> => {
    const { data } = await api.patch(`/tags/${id}`, dto);
    return data;
  },

  // Remover
  delete: async (id: string): Promise<Tag> => {
    const { data } = await api.delete(`/tags/${id}`);
    return data;
  },

  // Validar tags
  validate: async (
    tags: string[],
  ): Promise<{ valid: boolean; tags: string[] }> => {
    const { data } = await api.post("/tags/validate", { tags });
    return data;
  },

  // Estatísticas
  getStats: async (): Promise<TagStats> => {
    const { data } = await api.get("/tags/stats");
    return data;
  },
};
```

---

## React Query Hooks (Opcional)

```typescript
// hooks/useTags.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tagService } from "@/services/tagService";
import type { CreateTagDto, UpdateTagDto } from "@/types/tag";

export const useTagsQuery = (
  params?: Parameters<typeof tagService.list>[0],
) => {
  return useQuery({
    queryKey: ["tags", params],
    queryFn: () => tagService.list(params),
  });
};

export const useActiveTagsQuery = () => {
  return useQuery({
    queryKey: ["tags", "active"],
    queryFn: tagService.getActive,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useTagQuery = (id: string) => {
  return useQuery({
    queryKey: ["tags", id],
    queryFn: () => tagService.getById(id),
    enabled: !!id,
  });
};

export const useTagStatsQuery = () => {
  return useQuery({
    queryKey: ["tags", "stats"],
    queryFn: tagService.getStats,
  });
};

export const useCreateTagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateTagDto) => tagService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

export const useUpdateTagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTagDto }) =>
      tagService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

export const useDeleteTagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tagService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};
```

---

## Cores Sugeridas para Tags

```typescript
export const TAG_COLORS = [
  { name: "Vermelho", value: "#EF4444" },
  { name: "Laranja", value: "#F97316" },
  { name: "Âmbar", value: "#F59E0B" },
  { name: "Amarelo", value: "#EAB308" },
  { name: "Lima", value: "#84CC16" },
  { name: "Verde", value: "#22C55E" },
  { name: "Esmeralda", value: "#10B981" },
  { name: "Ciano", value: "#06B6D4" },
  { name: "Azul", value: "#3B82F6" },
  { name: "Índigo", value: "#6366F1" },
  { name: "Violeta", value: "#8B5CF6" },
  { name: "Roxo", value: "#A855F7" },
  { name: "Fúcsia", value: "#D946EF" },
  { name: "Rosa", value: "#EC4899" },
  { name: "Cinza", value: "#6B7280" },
];
```

---

## Resumo dos Endpoints

| Método | Endpoint         | Descrição                 |
| ------ | ---------------- | ------------------------- |
| POST   | `/tags`          | Criar tag                 |
| POST   | `/tags/batch`    | Criar múltiplas tags      |
| GET    | `/tags`          | Listar tags (paginado)    |
| GET    | `/tags/active`   | Tags ativas (para select) |
| GET    | `/tags/stats`    | Estatísticas              |
| POST   | `/tags/validate` | Validar array de tags     |
| GET    | `/tags/:id`      | Buscar por ID             |
| PATCH  | `/tags/:id`      | Atualizar tag             |
| DELETE | `/tags/:id`      | Remover tag               |

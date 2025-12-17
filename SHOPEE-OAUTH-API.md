# Integração Shopee OAuth - Documentação para Front-end

## Visão Geral

Este documento descreve como integrar o fluxo de conexão de lojas Shopee no front-end. O fluxo permite que usuários autenticados conectem suas lojas Shopee à plataforma.

### Requisitos

- Usuário deve estar **autenticado** (ter um Bearer Token válido)
- O fluxo usa OAuth 2.0 da Shopee com state para segurança

---

## Fluxo de Conexão

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FLUXO DE CONEXÃO SHOPEE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. USUÁRIO CLICA EM "CONECTAR LOJA SHOPEE"                                 │
│     │                                                                       │
│     ▼                                                                       │
│  2. FRONT CHAMA: GET /api/shopee/connect                                    │
│     │            (com Bearer Token)                                         │
│     │                                                                       │
│     ▼                                                                       │
│  3. API RETORNA: { authUrl: "https://shopee.com/..." }                      │
│     │                                                                       │
│     ▼                                                                       │
│  4. FRONT REDIRECIONA USUÁRIO PARA authUrl                                  │
│     │           (abre nova aba ou redirect)                                 │
│     │                                                                       │
│     ▼                                                                       │
│  5. USUÁRIO AUTORIZA NA SHOPEE                                              │
│     │                                                                       │
│     ▼                                                                       │
│  6. SHOPEE REDIRECIONA PARA: /api/shopee/callback                           │
│     │                                                                       │
│     ▼                                                                       │
│  7. API PROCESSA E REDIRECIONA PARA FRONTEND:                               │
│     │   → Sucesso: /shopee/callback?success=true&shop_id=xxx               │
│     │   → Erro: /shopee/callback?success=false&error=xxx                   │
│     │                                                                       │
│     ▼                                                                       │
│  8. FRONT MOSTRA RESULTADO E ATUALIZA LISTA DE LOJAS                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Endpoints da API

### Base URL: `/api/shopee`

---

## 1. Iniciar Conexão

**Endpoint:** `GET /api/shopee/connect`

**Autenticação:** ⚠️ **Requer Bearer Token**

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta de Sucesso (200):**

```json
{
  "success": true,
  "message": "Redirecione o usuário para a URL de autorização",
  "data": {
    "authUrl": "https://partner.shopeemobile.com/api/v2/shop/auth_partner?partner_id=123&timestamp=123&sign=abc&redirect=https://...&state=...",
    "instructions": "Abra esta URL em uma nova aba ou redirecione o usuário para ela"
  }
}
```

**Uso no Front-end:**

```javascript
async function connectShopee() {
  const response = await fetch("/api/shopee/connect", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (data.success) {
    // Opção 1: Abrir em nova aba
    window.open(data.data.authUrl, "_blank");

    // Opção 2: Redirecionar na mesma janela
    // window.location.href = data.data.authUrl;
  }
}
```

---

## 2. Callback (Automático)

**Endpoint:** `GET /api/shopee/callback`

> ⚠️ **Este endpoint é chamado automaticamente pela Shopee**, não pelo front-end.

Após a autorização na Shopee, o usuário é redirecionado para uma URL configurada no front-end:

**URL de Sucesso:**

```
https://seu-frontend.com/shopee/callback?success=true&shop_id=123456789&shop_name=Minha%20Loja
```

**URL de Erro:**

```
https://seu-frontend.com/shopee/callback?success=false&error=token_error&message=Erro%20ao%20obter%20token
```

**Parâmetros de Query:**

| Parâmetro | Descrição                              |
| --------- | -------------------------------------- |
| success   | `true` ou `false`                      |
| shop_id   | ID da loja (se sucesso)                |
| shop_name | Nome da loja (se sucesso)              |
| error     | Código do erro (se falha)              |
| message   | Mensagem descritiva do erro (se falha) |

**Códigos de Erro:**
| Código | Descrição |
|--------|-----------|
| `missing_params` | Code ou Shop ID não fornecido pela Shopee |
| `missing_state` | State não retornado (problema de segurança) |
| `invalid_state` | State inválido ou corrompido |
| `token_error` | Erro ao trocar code por token |
| `internal_error` | Erro interno do servidor |

---

## 3. Listar Lojas Conectadas

**Endpoint:** `GET /api/shopee/stores`

**Autenticação:** ⚠️ **Requer Bearer Token**

**Resposta de Sucesso (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "shopId": "123456789",
      "shopName": "Minha Loja Shopee",
      "region": "BR",
      "status": "ACTIVE",
      "tokenExpiresAt": "2025-12-20T20:00:00.000Z",
      "lastSyncAt": null,
      "errorMessage": null,
      "createdAt": "2025-12-16T20:00:00.000Z",
      "updatedAt": "2025-12-16T20:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1
  }
}
```

**Status Possíveis:**
| Status | Descrição |
|--------|-----------|
| `ACTIVE` | Loja conectada e funcionando |
| `TOKEN_EXPIRED` | Token expirado, precisa reconectar |
| `DISCONNECTED` | Loja desconectada pelo usuário |
| `ERROR` | Erro na conexão |

---

## 4. Verificar Status de Conexão

**Endpoint:** `GET /api/shopee/connected`

**Autenticação:** ⚠️ **Requer Bearer Token**

**Resposta de Sucesso (200):**

```json
{
  "success": true,
  "connected": true,
  "data": {
    "totalStores": 1,
    "activeStores": 1,
    "stores": [
      {
        "shopId": "123456789",
        "shopName": "Minha Loja",
        "status": "ACTIVE",
        "isActive": true
      }
    ]
  }
}
```

---

## 5. Detalhes de uma Loja

**Endpoint:** `GET /api/shopee/stores/:shopId`

**Autenticação:** ⚠️ **Requer Bearer Token**

**Resposta de Sucesso (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "shopId": "123456789",
    "shopName": "Minha Loja",
    "region": "BR",
    "status": "ACTIVE",
    "tokenExpiresAt": "2025-12-20T20:00:00.000Z",
    "lastSyncAt": null,
    "createdAt": "2025-12-16T20:00:00.000Z"
  }
}
```

---

## 6. Status de uma Loja Específica

**Endpoint:** `GET /api/shopee/stores/:shopId/status`

**Autenticação:** ⚠️ **Requer Bearer Token**

**Resposta de Sucesso (200):**

```json
{
  "success": true,
  "connected": true,
  "data": {
    "status": "ACTIVE",
    "isActive": true,
    "isExpired": false,
    "tokenExpiresAt": "2025-12-20T20:00:00.000Z",
    "shopName": "Minha Loja",
    "lastSyncAt": null,
    "errorMessage": null
  }
}
```

---

## 7. Desconectar Loja

**Endpoint:** `DELETE /api/shopee/stores/:shopId`

**Autenticação:** ⚠️ **Requer Bearer Token**

**Resposta de Sucesso (200):**

```json
{
  "success": true,
  "message": "Loja desconectada com sucesso"
}
```

---

## 8. Renovar Token de uma Loja

**Endpoint:** `POST /api/shopee/stores/:shopId/refresh`

**Autenticação:** ⚠️ **Requer Bearer Token**

**Resposta de Sucesso (200):**

```json
{
  "success": true,
  "message": "Token renovado com sucesso",
  "data": {
    "status": "ACTIVE",
    "tokenExpiresAt": "2025-12-20T20:00:00.000Z"
  }
}
```

---

## Implementação no Front-end

### Componente React de Exemplo

```tsx
import { useState, useEffect } from "react";

// Hook para gerenciar conexão Shopee
function useShopeeConnection() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar lojas conectadas
  const loadStores = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/shopee/stores", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setStores(data.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Iniciar conexão
  const connectStore = async () => {
    try {
      const response = await fetch("/api/shopee/connect", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        // Abrir em nova aba
        window.open(data.data.authUrl, "shopee_auth", "width=800,height=600");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Desconectar loja
  const disconnectStore = async (shopId) => {
    try {
      const response = await fetch(`/api/shopee/stores/${shopId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        // Recarregar lista
        await loadStores();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadStores();
  }, []);

  return {
    stores,
    loading,
    error,
    connectStore,
    disconnectStore,
    refreshStores: loadStores,
  };
}

// Componente de Lista de Lojas
function ShopeeStoresList() {
  const { stores, loading, connectStore, disconnectStore } =
    useShopeeConnection();

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Lojas Shopee Conectadas</h2>

      {stores.length === 0 ? (
        <div>
          <p>Nenhuma loja conectada</p>
          <button onClick={connectStore}>🛒 Conectar Loja Shopee</button>
        </div>
      ) : (
        <ul>
          {stores.map((store) => (
            <li key={store.shopId}>
              <strong>{store.shopName || store.shopId}</strong>
              <span className={`status ${store.status.toLowerCase()}`}>
                {store.status}
              </span>
              <button onClick={() => disconnectStore(store.shopId)}>
                Desconectar
              </button>
            </li>
          ))}
        </ul>
      )}

      {stores.length > 0 && (
        <button onClick={connectStore}>+ Conectar outra loja</button>
      )}
    </div>
  );
}
```

### Página de Callback

```tsx
// pages/shopee/callback.tsx (Next.js) ou similar
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ShopeeCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const success = searchParams.get("success") === "true";
    const shopId = searchParams.get("shop_id");
    const shopName = searchParams.get("shop_name");
    const error = searchParams.get("error");
    const message = searchParams.get("message");

    if (success) {
      setStatus("success");

      // Mostrar sucesso por 3 segundos e redirecionar
      setTimeout(() => {
        router.push("/dashboard/shopee");
      }, 3000);
    } else {
      setStatus("error");
      console.error("Erro Shopee:", error, message);
    }
  }, [searchParams, router]);

  return (
    <div className="callback-container">
      {status === "loading" && (
        <div>
          <h1>⏳ Processando...</h1>
          <p>Aguarde enquanto verificamos a conexão.</p>
        </div>
      )}

      {status === "success" && (
        <div>
          <h1>✅ Loja Conectada com Sucesso!</h1>
          <p>
            <strong>{searchParams.get("shop_name")}</strong> foi conectada à sua
            conta.
          </p>
          <p>Redirecionando...</p>
        </div>
      )}

      {status === "error" && (
        <div>
          <h1>❌ Erro na Conexão</h1>
          <p>{searchParams.get("message") || "Erro desconhecido"}</p>
          <button onClick={() => router.push("/dashboard/shopee")}>
            Voltar ao Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## Configuração do .env (Backend)

Adicione estas variáveis ao `.env`:

```env
# Shopee OAuth
PARTNER_ID=1189980
PARTNER_KEY=shpk54475058786b4453455a714d624b5346587066707a6242664a7469434253
SHOPEE_ENVIRONMENT=test

# URL de callback da API (para onde a Shopee redireciona)
SHOPEE_REDIRECT_URL=https://sba.icastelo.com.br/api/shopee/callback

# URL do frontend (para onde a API redireciona após processar)
SHOPEE_FRONTEND_CALLBACK_URL=https://sba.icastelo.com.br/shopee/callback
```

**Importante para produção:**

- `SHOPEE_ENVIRONMENT=production` para ambiente de produção
- Atualize `SHOPEE_REDIRECT_URL` e `SHOPEE_FRONTEND_CALLBACK_URL` com as URLs corretas

---

## Resumo das Rotas

| Método | Endpoint                             | Auth   | Descrição                       |
| ------ | ------------------------------------ | ------ | ------------------------------- |
| GET    | `/api/shopee/connect`                | ✅ JWT | Inicia conexão OAuth            |
| GET    | `/api/shopee/callback`               | ❌     | Callback da Shopee (automático) |
| GET    | `/api/shopee/stores`                 | ✅ JWT | Lista lojas conectadas          |
| GET    | `/api/shopee/stores/:shopId`         | ✅ JWT | Detalhes de uma loja            |
| GET    | `/api/shopee/stores/:shopId/status`  | ✅ JWT | Status de uma loja              |
| DELETE | `/api/shopee/stores/:shopId`         | ✅ JWT | Desconecta uma loja             |
| POST   | `/api/shopee/stores/:shopId/refresh` | ✅ JWT | Renova token da loja            |
| GET    | `/api/shopee/connected`              | ✅ JWT | Verifica se há lojas conectadas |

---

## Checklist para Submissão Shopee

✅ **Fluxo implementado:**

1. ✅ Usuário clica em "Conectar loja Shopee"
2. ✅ É redirecionado para a Shopee
3. ✅ Autoriza a conexão
4. ✅ Volta para o `redirect_uri` configurado
5. ✅ Token é obtido e armazenado no banco de dados
6. ✅ Usuário vê confirmação de sucesso
7. ✅ Loja aparece na lista de lojas conectadas

**Dados armazenados por loja:**

- `shop_id` - ID único da loja na Shopee
- `shop_name` - Nome da loja
- `access_token` - Token de acesso à API
- `refresh_token` - Token para renovação
- `token_expires_at` - Data de expiração
- `status` - Status da conexão (ACTIVE, TOKEN_EXPIRED, etc)
- `user_id` - Usuário dono da conexão

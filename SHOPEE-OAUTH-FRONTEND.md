# 🛍️ Integração OAuth Shopee - Frontend

Documentação completa para implementar o fluxo OAuth da Shopee no frontend.

---

## 📋 Visão Geral

O fluxo OAuth permite que usuários conectem suas lojas Shopee ao sistema:

1. **Usuário logado** clica em "Conectar Shopee"
2. Frontend chama backend para gerar URL de autorização
3. Backend retorna URL e cria session temporária
4. Frontend redireciona usuário para Shopee
5. Usuário autoriza na Shopee
6. Shopee redireciona para backend com code
7. Backend processa, salva tokens e redireciona para frontend
8. Frontend mostra sucesso/erro

---

## 🔐 Pré-requisitos

-   Usuário deve estar **logado** (ter JWT access token)
-   Backend rodando e acessível

---

## 📁 Estrutura de Arquivos

### Vite + React Router (recomendado para você)

```
src/
├── pages/
│   ├── shopee/
│   │   ├── ShopeeConnect.tsx      # Página para iniciar conexão
│   │   └── ShopeeCallback.tsx     # Página de callback (OBRIGATÓRIO)
│   └── dashboard/
│       └── Integrations.tsx       # Gerenciar lojas conectadas
├── App.tsx                         # Rotas React Router
└── main.tsx
```

### Next.js App Router

```
app/
├── shopee/
│   ├── connect/
│   │   └── page.tsx          # Página para iniciar conexão
│   └── callback/
│       └── page.tsx          # Página de callback (OBRIGATÓRIO)
└── dashboard/
    └── integrations/
        └── page.tsx          # Gerenciar lojas conectadas
```

### Next.js Pages Router

```
pages/
├── shopee/
│   ├── connect.tsx           # Página para iniciar conexão
│   └── callback.tsx          # Página de callback (OBRIGATÓRIO)
└── dashboard/
    └── integrations.tsx      # Gerenciar lojas conectadas
```

---

## 🚀 Implementação

### 1. Página de Callback (OBRIGATÓRIO)

#### Vite + React Router

**Caminho:** `src/pages/shopee/ShopeeCallback.tsx`

```tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ShopeeCallback() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
	const [message, setMessage] = useState("");

	useEffect(() => {
		const success = searchParams.get("success") === "true";
		const shopName = searchParams.get("shop_name");
		const shopId = searchParams.get("shop_id");
		const error = searchParams.get("error");
		const errorMessage = searchParams.get("message");

		if (success) {
			setStatus("success");
			setMessage(`Loja "${shopName || shopId}" conectada com sucesso!`);

			// Redirecionar após 3 segundos
			setTimeout(() => {
				navigate("/dashboard/integrations");
			}, 3000);
		} else {
			setStatus("error");
			setMessage(errorMessage || error || "Erro desconhecido ao conectar loja");
		}
	}, [searchParams, navigate]);

	if (status === "loading") {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
					<p className="mt-4 text-gray-600">Processando conexão com a Shopee...</p>
				</div>
			</div>
		);
	}

	if (status === "success") {
		return (
			<div className="flex items-center justify-center min-h-screen bg-green-50">
				<div className="text-center p-8 bg-white rounded-lg shadow-lg">
					<div className="text-6xl mb-4">✅</div>
					<h1 className="text-2xl font-bold text-green-600 mb-2">Conexão Realizada!</h1>
					<p className="text-gray-700">{message}</p>
					<p className="text-sm text-gray-500 mt-4">Redirecionando...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-red-50">
			<div className="text-center p-8 bg-white rounded-lg shadow-lg">
				<div className="text-6xl mb-4">❌</div>
				<h1 className="text-2xl font-bold text-red-600 mb-2">Erro na Conexão</h1>
				<p className="text-gray-700 mb-4">{message}</p>
				<button
					onClick={() => navigate("/dashboard/integrations")}
					className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
				>
					Voltar
				</button>
			</div>
		</div>
	);
}
```

**Adicionar rota no `App.tsx`:**

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShopeeCallback from "./pages/shopee/ShopeeCallback";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* Suas outras rotas */}
				<Route path="/shopee/callback" element={<ShopeeCallback />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
```

---

#### Next.js

**Caminho:** `app/shopee/callback/page.tsx` ou `pages/shopee/callback.tsx`

```tsx
"use client"; // Apenas para App Router

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // App Router
// import { useRouter } from 'next/router'; // Pages Router

export default function ShopeeCallbackPage() {
	const router = useRouter();
	const searchParams = useSearchParams(); // App Router
	// const { query } = router; // Pages Router

	const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
	const [message, setMessage] = useState("");

	useEffect(() => {
		// App Router
		const success = searchParams.get("success") === "true";
		const shopName = searchParams.get("shop_name");
		const shopId = searchParams.get("shop_id");
		const error = searchParams.get("error");
		const errorMessage = searchParams.get("message");

		// Pages Router: use query.success, query.shop_name, etc.

		if (success) {
			setStatus("success");
			setMessage(`Loja "${shopName || shopId}" conectada com sucesso!`);

			// Redirecionar após 3 segundos
			setTimeout(() => {
				router.push("/dashboard/integrations");
			}, 3000);
		} else {
			setStatus("error");
			setMessage(errorMessage || error || "Erro desconhecido ao conectar loja");
		}
	}, [searchParams, router]);

	if (status === "loading") {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
					<p className="mt-4 text-gray-600">Processando conexão com a Shopee...</p>
				</div>
			</div>
		);
	}

	if (status === "success") {
		return (
			<div className="flex items-center justify-center min-h-screen bg-green-50">
				<div className="text-center p-8 bg-white rounded-lg shadow-lg">
					<div className="text-6xl mb-4">✅</div>
					<h1 className="text-2xl font-bold text-green-600 mb-2">Conexão Realizada!</h1>
					<p className="text-gray-700">{message}</p>
					<p className="text-sm text-gray-500 mt-4">Redirecionando...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-red-50">
			<div className="text-center p-8 bg-white rounded-lg shadow-lg">
				<div className="text-6xl mb-4">❌</div>
				<h1 className="text-2xl font-bold text-red-600 mb-2">Erro na Conexão</h1>
				<p className="text-gray-700 mb-4">{message}</p>
				<button
					onClick={() => router.push("/dashboard/integrations")}
					className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
				>
					Voltar
				</button>
			</div>
		</div>
	);
}
```

---

### 2. Botão "Conectar Shopee"

#### Vite + React Router

**Caminho:** `src/pages/dashboard/Integrations.tsx`

```tsx
import { useState } from "react";

export default function Integrations() {
	const [loading, setLoading] = useState(false);

	const handleConnectShopee = async () => {
		setLoading(true);

		try {
			// Pegar token JWT do localStorage/cookie
			const token = localStorage.getItem("access_token");

			// Chamar backend para gerar URL
			const response = await fetch("https://sba.icastelo.com.br/api/shopee/connect", {
				method: "GET",
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Erro ao gerar URL de autorização");
			}

			const data = await response.json();

			// Redirecionar para Shopee
			window.location.href = data.data.authUrl;
		} catch (error) {
			console.error("Erro ao conectar Shopee:", error);
			alert("Erro ao conectar com a Shopee. Tente novamente.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-8">
			<h1 className="text-3xl font-bold mb-6">Integrações</h1>

			<div className="bg-white p-6 rounded-lg shadow">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-xl font-semibold">Shopee</h2>
						<p className="text-gray-600">Conecte sua loja Shopee</p>
					</div>

					<button
						onClick={handleConnectShopee}
						disabled={loading}
						className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
					>
						{loading ? "Conectando..." : "Conectar Shopee"}
					</button>
				</div>
			</div>
		</div>
	);
}
```

---

#### Next.js

**Caminho:** `app/dashboard/integrations/page.tsx`
**Mesmo código para Vite e Next.js** - apenas remova `'use client'` se estiver usando Vite:

```tsx'use client';

import { useState } from 'react';

export default function IntegrationsPage() {
  const [loading, setLoading] = useState(false);

  const handleConnectShopee = async () => {
    setLoading(true);

    try {
      // Pegar token JWT do localStorage/cookie
      const token = localStorage.getItem('access_token');

      // Chamar backend para gerar URL
      const response = await fetch('https://sba.icastelo.com.br/api/shopee/connect', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar URL de autorização');
      }

      const data = await response.json();

      // Abrir URL da Shopee em nova aba (ou redirect)
      window.location.href = data.data.authUrl;
      // ou: window.open(data.data.authUrl, '_blank');

    } catch (error) {
      console.error('Erro ao conectar Shopee:', error);
      alert('Erro ao conectar com a Shopee. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Integrações</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Shopee</h2>
            <p className="text-gray-600">Conecte sua loja Shopee</p>
          </div>

          <button
            onClick={handleConnectShopee}
            disabled={loading}
            className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? 'Conectando...' : 'Conectar Shopee'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

### 3. Listar Lojas Conectadas

```tsx
"use client";

import { useEffect, useState } from "react";

interface ShopeeStore {
	id: string;
	shopId: string;
	shopName: string;
	status: "ACTIVE" | "TOKEN_EXPIRED" | "DISCONNECTED" | "ERROR";
	createdAt: string;
}

export default function ShopeeStoresList() {
	const [stores, setStores] = useState<ShopeeStore[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadStores();
	}, []);

	const loadStores = async () => {
		try {
			const token = localStorage.getItem("access_token");

			const response = await fetch("https://sba.icastelo.com.br/api/shopee/stores", {
				headers: {
					"Authorization": `Bearer ${token}`,
				},
			});

			const data = await response.json();
			setStores(data.data || []);
		} catch (error) {
			console.error("Erro ao carregar lojas:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDisconnect = async (shopId: string) => {
		if (!confirm("Deseja realmente desconectar esta loja?")) return;

		try {
			const token = localStorage.getItem("access_token");

			await fetch(`https://sba.icastelo.com.br/api/shopee/stores/${shopId}`, {
				method: "DELETE",
				headers: {
					"Authorization": `Bearer ${token}`,
				},
			});

			loadStores(); // Recarregar lista
			alert("Loja desconectada com sucesso!");
		} catch (error) {
			console.error("Erro ao desconectar:", error);
			alert("Erro ao desconectar loja");
		}
	};

	const getStatusBadge = (status: string) => {
		const badges = {
			ACTIVE: "bg-green-100 text-green-800",
			TOKEN_EXPIRED: "bg-yellow-100 text-yellow-800",
			DISCONNECTED: "bg-gray-100 text-gray-800",
			ERROR: "bg-red-100 text-red-800",
		};

		return badges[status] || badges.ERROR;
	};

	if (loading) {
		return <div>Carregando lojas...</div>;
	}

	return (
		<div className="mt-6">
			<h3 className="text-lg font-semibold mb-4">Lojas Conectadas</h3>

			{stores.length === 0 ? (
				<p className="text-gray-500">Nenhuma loja conectada</p>
			) : (
				<div className="space-y-4">
					{stores.map((store) => (
						<div key={store.id} className="border rounded-lg p-4 flex justify-between items-center">
							<div>
								<p className="font-semibold">{store.shopName || `Loja ${store.shopId}`}</p>
								<p className="text-sm text-gray-600">Shop ID: {store.shopId}</p>
								<span
									className={`inline-block mt-2 px-2 py-1 rounded text-xs ${getStatusBadge(
										store.status
									)}`}
								>
									{store.status}
								</span>
							</div>

							<button
								onClick={() => handleDisconnect(store.shopId)}
								className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
							>
								Desconectar
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
```

---

## 🔌 Endpoints da API

### GET `/api/shopee/connect` 🔒

Inicia fluxo OAuth (requer autenticação)

**Headers:**

```
Authorization: Bearer {access_token}
```

**Response:**

```json
{
	"success": true,
	"message": "Redirecione o usuário para a URL de autorização",
	"data": {
		"authUrl": "https://partner.shopee.com/api/v2/shop/auth_partner?..."
	}
}
```

---

### GET `/api/shopee/callback/:session`

Callback da Shopee (público, chamado pela Shopee)

**Query Params da Shopee:**

-   `code` - Código de autorização
-   `shop_id` - ID da loja

**Redirect para Frontend:**

```
https://sba.icastelo.com.br/shopee/callback?success=true&shop_id=xxx&shop_name=xxx
```

**Em caso de erro:**

```
https://sba.icastelo.com.br/shopee/callback?success=false&error=xxx&message=xxx
```

---

### GET `/api/shopee/stores` 🔒

Lista lojas conectadas do usuário

**Headers:**

```
Authorization: Bearer {access_token}
```

**Response:**

```json
{
	"success": true,
	"data": [
		{
			"id": "uuid",
			"shopId": "225992492",
			"shopName": "Minha Loja",
			"region": "BR",
			"status": "ACTIVE",
			"createdAt": "2025-12-16T23:30:00.000Z"
		}
	]
}
```

---

### DELETE `/api/shopee/stores/:shopId` 🔒

Desconecta uma loja

**Headers:**

```
Authorization: Bearer {access_token}
```

**Response:**

```json
{
	"success": true,
	"message": "Loja desconectada com sucesso"
}
```

---

## 📝 Query Parameters do Callback

O backend redireciona para `/shopee/callback` com os seguintes parâmetros:

### Sucesso

```
?success=true
&shop_id=225992492
&shop_name=OpenSANDBOX985660740b58f815196
```

### Erro

```
?success=false
&error=missing_params|invalid_state|token_error|internal_error
&message=Descrição do erro
```

---

## ⚠️ Pontos Importantes

1. **A rota `/shopee/callback` é OBRIGATÓRIA** - sem ela o fluxo falha
2. **Usuário precisa estar logado** - guarde o JWT token
3. **Redirect automático** - após conectar, redirecione para página apropriada
4. **Tratamento de erros** - sempre mostre mensagem clara ao usuário
5. **Session expira em 10 minutos** - usuário deve completar OAuth rapidamente

---

## 🎨 Customização

Você pode:

-   Adicionar loading states mais elaborados
-   Usar toast notifications em vez de alerts
-   Integrar com seu sistema de gerenciamento de estado (Redux, Zustand, etc.)
-   Adicionar analytics para rastrear conexões bem-sucedidas
-   Personalizar mensagens de erro

---

## 🐛 Troubleshooting

### "Cannot GET /shopee/callback"

✅ **Solução:** Criar a página de callback conforme documentado acima

### "Unauthorized" ao chamar `/api/shopee/connect`

✅ **Solução:** Verificar se JWT token está sendo enviado no header

### Redirect não funciona

✅ **Solução:** Verificar se `SHOPEE_FRONTEND_CALLBACK_URL` está correto no `.env` do backend

### Session expirado

✅ **Solução:** Usuário demorou mais de 10 minutos - tentar novamente

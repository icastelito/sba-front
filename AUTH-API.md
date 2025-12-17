# API de Autenticação - Documentação para Front-end

## Visão Geral

O sistema de autenticação utiliza JWT (JSON Web Token) com tokens Bearer e refresh tokens para manter sessões seguras.

### Características:
- **Access Token**: Válido por **4 horas**
- **Refresh Token**: Válido por **3 dias**, renovado automaticamente a cada uso
- **Tipo de Token**: Bearer Token
- **Hash de Senha**: bcrypt com 12 rounds

---

## Endpoints de Autenticação

### Base URL: `/api/auth`

---

## 1. Registro de Usuário

**Endpoint:** `POST /api/auth/register`

**Autenticação:** Não requer

**Body:**
```json
{
  "email": "usuario@exemplo.com",
  "username": "usuario123",
  "name": "Nome Completo",
  "nickname": "Apelido (opcional)",
  "password": "SenhaSegura123"
}
```

**Validações:**
| Campo | Regras |
|-------|--------|
| email | Obrigatório, formato válido, único |
| username | Obrigatório, 3-30 caracteres, apenas letras, números e underscore, único |
| name | Obrigatório, 2-100 caracteres |
| nickname | Opcional, máximo 50 caracteres |
| password | Obrigatório, mínimo 8 caracteres, deve conter: 1 minúscula, 1 maiúscula, 1 número |

**Resposta de Sucesso (201):**
```json
{
  "message": "Usuário cadastrado com sucesso. Verifique seu email para ativar a conta.",
  "user": {
    "id": "uuid",
    "email": "usuario@exemplo.com",
    "username": "usuario123",
    "name": "Nome Completo",
    "nickname": "Apelido",
    "isActive": true,
    "emailVerified": false,
    "createdAt": "2025-12-16T20:00:00.000Z",
    "updatedAt": "2025-12-16T20:00:00.000Z"
  }
}
```

**Erros Possíveis:**
- `409 Conflict`: Email ou username já em uso
- `400 Bad Request`: Validação falhou

---

## 2. Login

**Endpoint:** `POST /api/auth/login`

**Autenticação:** Não requer

**Body:**
```json
{
  "login": "usuario@exemplo.com ou username",
  "password": "SenhaSegura123"
}
```

**Resposta de Sucesso (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "a1b2c3d4e5f6...",
  "expiresIn": 14400,
  "tokenType": "Bearer"
}
```

**Campos da Resposta:**
| Campo | Descrição |
|-------|-----------|
| accessToken | Token JWT para autenticação (válido por 4h) |
| refreshToken | Token para renovar o accessToken (válido por 3 dias) |
| expiresIn | Tempo de expiração em segundos (14400 = 4 horas) |
| tokenType | Sempre "Bearer" |

**Erros Possíveis:**
- `401 Unauthorized`: Credenciais inválidas ou conta desativada

---

## 3. Renovar Token (Refresh)

**Endpoint:** `POST /api/auth/refresh`

**Autenticação:** Não requer (usa refresh token no body)

**Body:**
```json
{
  "refreshToken": "a1b2c3d4e5f6..."
}
```

**Resposta de Sucesso (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "x1y2z3w4v5u6...",
  "expiresIn": 14400,
  "tokenType": "Bearer"
}
```

> **IMPORTANTE:** O refresh token é renovado a cada uso. O token antigo é invalidado e um novo é retornado. Sempre armazene o novo refresh token!

**Erros Possíveis:**
- `401 Unauthorized`: Refresh token inválido, expirado ou revogado

---

## 4. Logout

**Endpoint:** `POST /api/auth/logout`

**Autenticação:** Não requer (usa refresh token no body)

**Body:**
```json
{
  "refreshToken": "a1b2c3d4e5f6..."
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Logout realizado com sucesso"
}
```

---

## 5. Logout de Todos os Dispositivos

**Endpoint:** `POST /api/auth/logout-all`

**Autenticação:** ⚠️ **Requer Bearer Token**

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body:** Nenhum

**Resposta de Sucesso (200):**
```json
{
  "message": "Logout realizado em todos os dispositivos"
}
```

---

## 6. Obter Perfil do Usuário

**Endpoint:** `GET /api/auth/me`

**Autenticação:** ⚠️ **Requer Bearer Token**

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta de Sucesso (200):**
```json
{
  "id": "uuid",
  "email": "usuario@exemplo.com",
  "username": "usuario123",
  "name": "Nome Completo",
  "nickname": "Apelido",
  "isActive": true,
  "emailVerified": false,
  "createdAt": "2025-12-16T20:00:00.000Z",
  "updatedAt": "2025-12-16T20:00:00.000Z"
}
```

---

## 7. Atualizar Perfil

**Endpoint:** `PUT /api/auth/profile`

**Autenticação:** ⚠️ **Requer Bearer Token**

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body (todos opcionais):**
```json
{
  "name": "Novo Nome",
  "nickname": "Novo Apelido",
  "username": "novousername"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Perfil atualizado com sucesso",
  "user": {
    "id": "uuid",
    "email": "usuario@exemplo.com",
    "username": "novousername",
    "name": "Novo Nome",
    "nickname": "Novo Apelido",
    "isActive": true,
    "emailVerified": false,
    "createdAt": "2025-12-16T20:00:00.000Z",
    "updatedAt": "2025-12-16T21:00:00.000Z"
  }
}
```

**Erros Possíveis:**
- `409 Conflict`: Username já em uso

---

## 8. Alterar Senha

**Endpoint:** `PUT /api/auth/password`

**Autenticação:** ⚠️ **Requer Bearer Token**

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body:**
```json
{
  "currentPassword": "SenhaAtual123",
  "newPassword": "NovaSenha456"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Senha alterada com sucesso. Faça login novamente em todos os dispositivos."
}
```

> **IMPORTANTE:** Após alterar a senha, todos os refresh tokens são revogados. O usuário precisará fazer login novamente em todos os dispositivos.

**Erros Possíveis:**
- `400 Bad Request`: Senha atual incorreta ou nova senha não atende aos requisitos

---

## 9. Verificar Email

**Endpoint:** `GET /api/auth/verify-email?token=xxx`

**Autenticação:** Não requer

**Query Parameters:**
| Parâmetro | Descrição |
|-----------|-----------|
| token | Token de verificação recebido por email |

**Resposta de Sucesso (200):**
```json
{
  "message": "Email verificado com sucesso",
  "user": {
    "id": "uuid",
    "email": "usuario@exemplo.com",
    "emailVerified": true,
    ...
  }
}
```

---

## Uso do Token nas Requisições

### Header de Autorização

Para rotas protegidas, envie o token no header `Authorization`:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Exemplo com Fetch (JavaScript)

```javascript
// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ login: 'usuario@exemplo.com', password: 'SenhaSegura123' })
});
const { accessToken, refreshToken } = await loginResponse.json();

// Armazenar tokens
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);

// Requisição autenticada
const response = await fetch('/api/todos', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});
```

### Exemplo com Axios

```javascript
// Configurar interceptor
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para refresh automático
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && error.response?.data?.message === 'Token expirado') {
      const refreshToken = localStorage.getItem('refreshToken');
      
      try {
        const { data } = await axios.post('/api/auth/refresh', { refreshToken });
        
        // Salvar novos tokens
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        
        // Repetir requisição original
        error.config.headers.Authorization = `Bearer ${data.accessToken}`;
        return axios(error.config);
      } catch (refreshError) {
        // Refresh falhou - redirecionar para login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

---

## Rotas Protegidas vs Públicas

### 🔓 Rotas Públicas (não requerem autenticação)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register` | Registro de usuário |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Renovar token |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/verify-email` | Verificar email |
| GET | `/api/health` | Health check |
| GET | `/api/products/public` | Produtos públicos |
| POST | `/api/webhooks/*` | Webhooks (usam HMAC) |
| GET | `/api/auth/shopee/*` | OAuth Shopee |

### 🔒 Rotas Protegidas (requerem Bearer Token)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/auth/me` | Perfil do usuário |
| PUT | `/api/auth/profile` | Atualizar perfil |
| PUT | `/api/auth/password` | Alterar senha |
| POST | `/api/auth/logout-all` | Logout de todos dispositivos |
| * | `/api/todos/*` | Todas as rotas de tarefas |
| * | `/api/tasks/*` | Todas as rotas de tarefas (legacy) |
| * | `/api/requesters/*` | Todas as rotas de demandantes |
| * | `/api/products/*` | Todas as rotas de produtos (exceto /public) |
| * | `/api/templates/*` | Todas as rotas de templates |
| * | `/api/clients/*` | Todas as rotas de clientes |
| * | `/api/sales-orders/*` | Todas as rotas de pedidos |

---

## Tratamento de Erros

### Respostas de Erro Comuns

**401 Unauthorized - Token inválido ou ausente:**
```json
{
  "statusCode": 401,
  "message": "Não autorizado",
  "error": "Unauthorized"
}
```

**401 Unauthorized - Token expirado:**
```json
{
  "statusCode": 401,
  "message": "Token expirado",
  "error": "Unauthorized"
}
```

**409 Conflict - Dado duplicado:**
```json
{
  "statusCode": 409,
  "message": "Email já está em uso",
  "error": "Conflict"
}
```

**400 Bad Request - Validação falhou:**
```json
{
  "statusCode": 400,
  "message": [
    "Senha deve ter no mínimo 8 caracteres",
    "Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número"
  ],
  "error": "Bad Request"
}
```

---

## Fluxo Recomendado

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          FLUXO DE AUTENTICAÇÃO                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐                                                           │
│  │ REGISTRO │ ──► POST /api/auth/register                               │
│  └────┬─────┘                                                           │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────┐                                                           │
│  │  LOGIN   │ ──► POST /api/auth/login                                  │
│  └────┬─────┘     ◄── { accessToken, refreshToken }                     │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────────────────────┐                                           │
│  │  ARMAZENAR TOKENS        │                                           │
│  │  localStorage/SecureStore│                                           │
│  └────┬─────────────────────┘                                           │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────────────────────┐                                           │
│  │  REQUISIÇÕES AUTENTICADAS│ ──► Authorization: Bearer {accessToken}   │
│  └────┬─────────────────────┘                                           │
│       │                                                                 │
│       ▼                                                                 │
│  ┌─────────────────┐   NÃO    ┌─────────────────┐                       │
│  │ Token expirado? │ ────────►│ Continuar normal │                      │
│  └────┬────────────┘          └─────────────────┘                       │
│       │ SIM                                                             │
│       ▼                                                                 │
│  ┌──────────────────────────┐                                           │
│  │  POST /api/auth/refresh  │                                           │
│  │  { refreshToken }        │                                           │
│  └────┬─────────────────────┘                                           │
│       │                                                                 │
│       ▼                                                                 │
│  ┌─────────────────┐   NÃO    ┌─────────────────┐                       │
│  │ Refresh válido? │ ────────►│ Redirecionar    │                       │
│  └────┬────────────┘          │ para LOGIN      │                       │
│       │ SIM                   └─────────────────┘                       │
│       ▼                                                                 │
│  ┌──────────────────────────┐                                           │
│  │  ATUALIZAR TOKENS        │ ◄── { accessToken, refreshToken }         │
│  │  (IMPORTANTE: Salvar     │                                           │
│  │   novo refreshToken!)    │                                           │
│  └──────────────────────────┘                                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Segurança - Boas Práticas

1. **Armazenamento de Tokens:**
   - Web: Use `httpOnly cookies` para o refresh token quando possível
   - Mobile: Use armazenamento seguro (Keychain/Keystore)
   - Evite localStorage para dados sensíveis em produção

2. **Refresh Token:**
   - Sempre salve o novo refresh token após cada refresh
   - O token antigo é invalidado após uso

3. **Logout:**
   - Sempre faça logout ao desconectar
   - Use logout-all após alteração de senha ou suspeita de comprometimento

4. **HTTPS:**
   - Sempre use HTTPS em produção
   - Nunca transmita tokens por HTTP

---

## Modelo de Dados do Usuário

```typescript
interface User {
  id: string;          // UUID
  email: string;       // Email único
  username: string;    // Username único (lowercase)
  name: string;        // Nome completo
  nickname: string | null;  // Apelido opcional
  isActive: boolean;   // Conta ativa
  emailVerified: boolean;  // Email verificado
  createdAt: Date;
  updatedAt: Date;
}

interface TokenResponse {
  accessToken: string;   // JWT para autenticação
  refreshToken: string;  // Token para renovar sessão
  expiresIn: number;     // Segundos até expirar (14400 = 4h)
  tokenType: 'Bearer';
}
```

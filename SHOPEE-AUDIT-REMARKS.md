# Texto para Campo "Remarks" - Verificação Shopee ISV

## ⚠️ TEXTO PARA O CAMPO REMARKS (máx 200 caracteres)

```
Guide: https://appsba.icastelo.com.br/audit
Login: auditor@sba.dev | Pass: Audit@123
Active integrations: Shopee + Mercado Livre
```

**Caracteres: ~130** ✅

---

## 🔗 Página de Ajuda Pública

O auditor pode acessar **https://appsba.icastelo.com.br/audit** para ver:

-   Credenciais de teste
-   Passo a passo detalhado
-   Lista de integrações ativas
-   Funcionalidades do sistema

---

## 🇧🇷 Versão Completa (para referência)

```
CREDENCIAIS DE ACESSO - CONTA DE TESTE

URL: https://appsba.icastelo.com.br
Login: auditor@sba.dev
Senha: Audit@123

PASSO A PASSO PARA VER A INTEGRAÇÃO:

1. Acesse a URL acima
2. Na tela de login, insira o email e senha fornecidos
3. Clique em "Entrar"
4. Após o login, você será redirecionado automaticamente para a página "Integrações"
5. Na página "Integrações", você verá:
   - 2 integrações ativas: Shopee e Mercado Livre
   - 3 integrações em desenvolvimento: Amazon, Magazine Luiza, Shein
6. Clique em "Shopee" no menu lateral para ver os detalhes da integração Shopee
7. Na página "Lojas Shopee", você verá:
   - 1 loja conectada com status "Conectada" (ativo)
   - Nome da loja: "Loja Teste SBA"
   - Região: BR
   - Botões de ação: "Sincronizar" e "Renovar Token"

INTEGRAÇÕES ATIVAS NO SISTEMA:
- Shopee (Brasil) - Status: Ativa
- Mercado Livre (América Latina) - Status: Ativa

FUNCIONALIDADES DEMONSTRADAS:
- Conexão OAuth com múltiplos marketplaces
- Gerenciamento de múltiplas lojas
- Sincronização de produtos
- Controle de expiração de token
- Status de conexão em tempo real

O SBA é um sistema de gestão de pedidos para vendedores que integra com múltiplas plataformas de e-commerce (Shopee, Mercado Livre, etc.) para automatizar o fluxo de vendas.
```

---

## 🇺🇸 English Version (caso peçam em inglês)

```
TEST ACCOUNT CREDENTIALS

URL: https://appsba.icastelo.com.br
Login: auditor@sba.dev
Password: Audit@123

STEP-BY-STEP TO VIEW THE INTEGRATION:

1. Access the URL above
2. On the login screen, enter the email and password provided
3. Click "Entrar" (Login)
4. After login, you will be automatically redirected to the "Integrações" (Integrations) page
5. On the "Integrations" page, you will see:
   - 2 active integrations: Shopee and Mercado Livre
   - 3 integrations in development: Amazon, Magazine Luiza, Shein
6. Click on "Shopee" in the sidebar menu to see Shopee integration details
7. On the "Lojas Shopee" (Shopee Stores) page, you will see:
   - 1 connected store with status "Conectada" (Active)
   - Store name: "Loja Teste SBA"
   - Region: BR
   - Action buttons: "Sincronizar" (Sync) and "Renovar Token" (Refresh Token)

ACTIVE INTEGRATIONS IN THE SYSTEM:
- Shopee (Brazil) - Status: Active
- Mercado Livre (Latin America) - Status: Active

DEMONSTRATED FEATURES:
- OAuth connection with multiple marketplaces
- Multi-store management
- Product synchronization
- Token expiration control
- Real-time connection status

SBA is an order management system for sellers that integrates with multiple e-commerce platforms (Shopee, Mercado Livre, etc.) to automate the sales workflow.
```

---

## ⚠️ Checklist antes de reenviar

-   [ ] Rodar seed no servidor: `docker compose exec api npx prisma db seed`
-   [ ] Testar login com `auditor@sba.dev` / `Audit@123`
-   [ ] Verificar que a página Shopee mostra loja com status "Conectada"
-   [ ] Confirmar que o site está acessível via HTTPS (TLS 1.2+)
-   [ ] Copiar o texto do Remarks acima no formulário da Shopee

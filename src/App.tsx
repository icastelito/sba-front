import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";
import {
	TodosPage,
	TodoCreatePage,
	TodoEditPage,
	TemplatesPage,
	TemplateCreatePage,
	TemplateEditPage,
	TagsPage,
	TagCreatePage,
	TagEditPage,
	ProductsPage,
	ProductCreatePage,
	ProductEditPage,
	RequestersPage,
	RequesterCreatePage,
	RequesterEditPage,
	ClientsPage,
	ClientCreatePage,
	ClientEditPage,
	SalesOrdersPage,
	SalesOrderCreatePage,
	SalesOrderEditPage,
	LoginPage,
	RegisterPage,
	ProfilePage,
	ShopeePage,
	ShopeeCallbackPage,
} from "./pages";

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					{/* Rotas públicas (só acessa se NÃO estiver logado) */}
					<Route element={<PublicRoute />}>
						<Route path="/login" element={<LoginPage />} />
						<Route path="/register" element={<RegisterPage />} />
					</Route>

					{/* Callback da Shopee - fora do Layout para evitar problemas */}
					<Route element={<ProtectedRoute />}>
						<Route path="/shopee/callback" element={<ShopeeCallbackPage />} />
					</Route>

					{/* Rotas protegidas (só acessa se estiver logado) */}
					<Route element={<ProtectedRoute />}>
						<Route path="/" element={<Layout />}>
							<Route index element={<Navigate to="/shopee" replace />} />
							<Route path="shopee" element={<ShopeePage />} />

							{/* Tarefas */}
							<Route path="tarefas" element={<TodosPage />} />
							<Route path="tarefas/novo" element={<TodoCreatePage />} />
							<Route path="tarefas/:id/editar" element={<TodoEditPage />} />

							{/* Templates */}
							<Route path="templates" element={<TemplatesPage />} />
							<Route path="templates/novo" element={<TemplateCreatePage />} />
							<Route path="templates/:id/editar" element={<TemplateEditPage />} />

							{/* Tags */}
							<Route path="tags" element={<TagsPage />} />
							<Route path="tags/novo" element={<TagCreatePage />} />
							<Route path="tags/:id/editar" element={<TagEditPage />} />

							{/* Demandantes */}
							<Route path="demandantes" element={<RequestersPage />} />
							<Route path="demandantes/novo" element={<RequesterCreatePage />} />
							<Route path="demandantes/:id/editar" element={<RequesterEditPage />} />

							{/* Produtos */}
							<Route path="produtos" element={<ProductsPage />} />
							<Route path="produtos/novo" element={<ProductCreatePage />} />
							<Route path="produtos/:id/editar" element={<ProductEditPage />} />

							{/* Clientes */}
							<Route path="clientes" element={<ClientsPage />} />
							<Route path="clientes/novo" element={<ClientCreatePage />} />
							<Route path="clientes/:id/editar" element={<ClientEditPage />} />

							{/* Pedidos */}
							<Route path="pedidos" element={<SalesOrdersPage />} />
							<Route path="pedidos/novo" element={<SalesOrderCreatePage />} />
							<Route path="pedidos/:id/editar" element={<SalesOrderEditPage />} />

							<Route path="perfil" element={<ProfilePage />} />
						</Route>
					</Route>

					{/* Rota padrão - redireciona para login se não logado */}
					<Route path="*" element={<Navigate to="/login" replace />} />
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;

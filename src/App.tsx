import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";
import {
	TodosPage,
	TemplatesPage,
	TagsPage,
	ProductsPage,
	RequestersPage,
	ClientsPage,
	SalesOrdersPage,
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
							<Route path="tarefas" element={<TodosPage />} />
							<Route path="templates" element={<TemplatesPage />} />
							<Route path="tags" element={<TagsPage />} />
							<Route path="demandantes" element={<RequestersPage />} />
							<Route path="produtos" element={<ProductsPage />} />
							<Route path="clientes" element={<ClientsPage />} />
							<Route path="pedidos" element={<SalesOrdersPage />} />
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

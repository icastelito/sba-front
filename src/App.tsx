import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { TodosPage, TemplatesPage, ProductsPage, RequestersPage, ClientsPage, SalesOrdersPage } from "./pages";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Navigate to="/tarefas" replace />} />
					<Route path="tarefas" element={<TodosPage />} />
					<Route path="templates" element={<TemplatesPage />} />
					<Route path="demandantes" element={<RequestersPage />} />
					<Route path="produtos" element={<ProductsPage />} />
					<Route path="clientes" element={<ClientsPage />} />
					<Route path="pedidos" element={<SalesOrdersPage />} />
					<Route path="*" element={<Navigate to="/tarefas" replace />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;

import { useState } from "react";
import type { ReactNode } from "react";
import { TodoList } from "./components/todos";
import { TemplateList } from "./components/templates";
import { ProductList } from "./components/products";
import { RequesterList } from "./components/requesters";
import { IconTasks, IconTemplate, IconProducts, IconUsers } from "./components/ui";

type Tab = "todos" | "templates" | "products" | "requesters";

function App() {
	const [activeTab, setActiveTab] = useState<Tab>("todos");

	const tabs: { id: Tab; label: string; icon: ReactNode }[] = [
		{ id: "todos", label: "Tarefas", icon: <IconTasks size={18} /> },
		{ id: "templates", label: "Templates", icon: <IconTemplate size={18} /> },
		{ id: "requesters", label: "Demandantes", icon: <IconUsers size={18} /> },
		{ id: "products", label: "Produtos", icon: <IconProducts size={18} /> },
	];

	const renderContent = () => {
		switch (activeTab) {
			case "todos":
				return <TodoList />;
			case "templates":
				return <TemplateList />;
			case "requesters":
				return <RequesterList />;
			case "products":
				return <ProductList />;
		}
	};

	return (
		<div className="app-container">
			<nav className="app-nav">
				<div className="app-nav-inner">
					<div className="app-logo">
						<span className="app-logo-text">SBA</span>
					</div>
					<div className="app-tabs">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`app-tab ${activeTab === tab.id ? "app-tab-active" : ""}`}
							>
								{tab.icon}
								<span>{tab.label}</span>
							</button>
						))}
					</div>
				</div>
			</nav>

			<main className="app-main">{renderContent()}</main>
		</div>
	);
}

export default App;

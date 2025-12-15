import { Outlet, NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import { IconTasks, IconTemplate, IconProducts, IconUsers, IconClients, IconShoppingCart } from "./ui";

interface NavItem {
	to: string;
	label: string;
	icon: ReactNode;
}

const navItems: NavItem[] = [
	{ to: "/tarefas", label: "Tarefas", icon: <IconTasks size={18} /> },
	{ to: "/templates", label: "Templates", icon: <IconTemplate size={18} /> },
	{ to: "/demandantes", label: "Demandantes", icon: <IconUsers size={18} /> },
	{ to: "/produtos", label: "Produtos", icon: <IconProducts size={18} /> },
	{ to: "/clientes", label: "Clientes", icon: <IconClients size={18} /> },
	{ to: "/pedidos", label: "Pedidos", icon: <IconShoppingCart size={18} /> },
];

export function Layout() {
	return (
		<div className="app-container">
			<nav className="app-nav">
				<div className="app-nav-inner">
					<NavLink to="/" className="app-logo">
						<span className="app-logo-text">SBA</span>
					</NavLink>
					<div className="app-tabs">
						{navItems.map((item) => (
							<NavLink
								key={item.to}
								to={item.to}
								className={({ isActive }) => `app-tab ${isActive ? "app-tab-active" : ""}`}
							>
								{item.icon}
								<span>{item.label}</span>
							</NavLink>
						))}
					</div>
				</div>
			</nav>

			<main className="app-main">
				<Outlet />
			</main>
		</div>
	);
}

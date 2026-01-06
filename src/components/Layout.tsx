import { Outlet, NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import {
	IconTasks,
	IconTemplate,
	IconTag,
	IconProducts,
	IconUsers,
	IconClients,
	IconShoppingCart,
	IconUser,
	IconShopee,
	IconLink,
} from "./ui";
import { useAuth } from "../hooks/useAuth";

interface NavItem {
	to: string;
	label: string;
	icon: ReactNode;
}

const navItems: NavItem[] = [
	{ to: "/integracoes", label: "Integrações", icon: <IconLink size={18} /> },
	{ to: "/shopee", label: "Shopee", icon: <IconShopee size={18} /> },
	{ to: "/tarefas", label: "Tarefas", icon: <IconTasks size={18} /> },
	{ to: "/templates", label: "Templates", icon: <IconTemplate size={18} /> },
	{ to: "/tags", label: "Tags", icon: <IconTag size={18} /> },
	{ to: "/demandantes", label: "Demandantes", icon: <IconUsers size={18} /> },
	{ to: "/produtos", label: "Produtos", icon: <IconProducts size={18} /> },
	{ to: "/clientes", label: "Clientes", icon: <IconClients size={18} /> },
	{ to: "/pedidos", label: "Pedidos", icon: <IconShoppingCart size={18} /> },
];

export function Layout() {
	const { user } = useAuth();

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
					<div className="app-user">
						<NavLink
							to="/perfil"
							className={({ isActive }) => `app-user-link ${isActive ? "app-user-link-active" : ""}`}
						>
							<IconUser size={18} />
							<span>{user?.nickname || user?.name?.split(" ")[0] || "Perfil"}</span>
						</NavLink>
					</div>
				</div>
			</nav>

			<main className="app-main">
				<Outlet />
			</main>
		</div>
	);
}

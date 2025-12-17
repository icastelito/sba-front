import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loading } from "./ui";

interface ProtectedRouteProps {
	children?: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="auth-page">
				<Loading />
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return children ? <>{children}</> : <Outlet />;
}

export function PublicRoute({ children }: ProtectedRouteProps) {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="auth-page">
				<Loading />
			</div>
		);
	}

	if (isAuthenticated) {
		return <Navigate to="/tarefas" replace />;
	}

	return children ? <>{children}</> : <Outlet />;
}

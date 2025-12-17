import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loading } from "../components";
import { IconCheck, IconError, IconShopee } from "../components/ui";

type CallbackStatus = "loading" | "success" | "error";

export function ShopeeCallbackPage() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [status, setStatus] = useState<CallbackStatus>("loading");

	const success = searchParams.get("success") === "true";
	const shopId = searchParams.get("shop_id");
	const shopName = searchParams.get("shop_name");
	const errorCode = searchParams.get("error");
	const errorMessage = searchParams.get("message");

	useEffect(() => {
		if (success) {
			setStatus("success");
			// Redirecionar após 3 segundos
			const timer = setTimeout(() => {
				navigate("/shopee");
			}, 3000);
			return () => clearTimeout(timer);
		} else {
			setStatus("error");
		}
	}, [success, navigate]);

	const handleGoBack = () => {
		navigate("/shopee");
	};

	if (status === "loading") {
		return (
			<div className="callback-page">
				<div className="callback-container">
					<Loading />
					<h2>Processando conexão...</h2>
					<p>Aguarde enquanto verificamos a autorização.</p>
				</div>
			</div>
		);
	}

	if (status === "success") {
		return (
			<div className="callback-page">
				<div className="callback-container callback-success">
					<div className="callback-icon success">
						<IconCheck size={48} />
					</div>
					<h1>Loja Conectada com Sucesso!</h1>
					<div className="callback-store-info">
						<IconShopee size={32} className="shopee-icon" />
						<div>
							<strong>{shopName || `Loja ${shopId}`}</strong>
							<span>ID: {shopId}</span>
						</div>
					</div>
					<p className="callback-message">
						Sua loja foi conectada à plataforma. Agora você pode gerenciar seus pedidos.
					</p>
					<p className="callback-redirect">Redirecionando em 3 segundos...</p>
					<button className="btn btn-primary" onClick={handleGoBack}>
						Ir para Minhas Lojas
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="callback-page">
			<div className="callback-container callback-error">
				<div className="callback-icon error">
					<IconError size={48} />
				</div>
				<h1>Erro na Conexão</h1>
				<p className="callback-error-message">
					{errorMessage || "Ocorreu um erro ao conectar sua loja Shopee."}
				</p>
				{errorCode && (
					<p className="callback-error-code">
						Código do erro: <code>{errorCode}</code>
					</p>
				)}
				<div className="callback-actions">
					<button className="btn btn-secondary" onClick={handleGoBack}>
						Voltar
					</button>
					<button className="btn btn-primary" onClick={() => navigate("/shopee")}>
						Tentar Novamente
					</button>
				</div>
			</div>
		</div>
	);
}

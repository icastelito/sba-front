import { IconShopee, IconCheck, IconLink } from "../components/ui";

export function AuditHelpPage() {
	return (
		<div className="audit-help-page">
			<div className="audit-help-container">
				<div className="audit-help-header">
					<div className="audit-help-logo">
						<span>SBA</span>
					</div>
					<h1>Shopee ISV Verification</h1>
					<p>Test account credentials and integration guide</p>
				</div>

				<div className="audit-help-section">
					<h2>🔐 Test Account Credentials</h2>
					<div className="credentials-box">
						<div className="credential-item">
							<span className="credential-label">URL:</span>
							<a href="https://appsba.icastelo.com.br" target="_blank" rel="noopener noreferrer">
								https://appsba.icastelo.com.br
							</a>
						</div>
						<div className="credential-item">
							<span className="credential-label">Login:</span>
							<code>auditor@sba.dev</code>
						</div>
						<div className="credential-item">
							<span className="credential-label">Password:</span>
							<code>Audit@123</code>
						</div>
					</div>
				</div>

				<div className="audit-help-section">
					<h2>📋 Step-by-Step Guide</h2>
					<ol className="steps-list">
						<li>
							<strong>Access the URL above</strong>
							<p>Open https://appsba.icastelo.com.br in your browser</p>
						</li>
						<li>
							<strong>Login with test credentials</strong>
							<p>Enter email: auditor@sba.dev and password: Audit@123</p>
						</li>
						<li>
							<strong>View Integrations page</strong>
							<p>
								After login, you'll see the "Integrações" (Integrations) page with active integrations
							</p>
						</li>
						<li>
							<strong>Check active integrations</strong>
							<p>
								You'll see 2 active integrations: <strong>Shopee</strong> and{" "}
								<strong>Mercado Livre</strong>
							</p>
						</li>
						<li>
							<strong>View Shopee details</strong>
							<p>
								Click "Shopee" in the sidebar to see the connected store with status "Conectada"
								(Active)
							</p>
						</li>
					</ol>
				</div>

				<div className="audit-help-section">
					<h2>✅ Active Integrations</h2>
					<div className="integrations-showcase">
						<div className="integration-showcase-item active">
							<IconShopee size={32} />
							<div>
								<strong>Shopee</strong>
								<span>Brazil - Active</span>
							</div>
							<IconCheck size={20} className="check-icon" />
						</div>
						<div className="integration-showcase-item active">
							<IconLink size={32} />
							<div>
								<strong>Mercado Livre</strong>
								<span>Latin America - Active</span>
							</div>
							<IconCheck size={20} className="check-icon" />
						</div>
					</div>
				</div>

				<div className="audit-help-section">
					<h2>🚀 Features Demonstrated</h2>
					<ul className="features-list">
						<li>OAuth connection with multiple marketplaces</li>
						<li>Multi-store management</li>
						<li>Product synchronization</li>
						<li>Token expiration control</li>
						<li>Real-time connection status</li>
						<li>Order management system</li>
					</ul>
				</div>

				<div className="audit-help-section">
					<h2>ℹ️ About SBA</h2>
					<p className="about-text">
						SBA (Shopee Business Agent) is an order management system for e-commerce sellers that integrates
						with multiple platforms (Shopee, Mercado Livre, Amazon, etc.) to automate sales workflow,
						inventory management, and order processing.
					</p>
				</div>

				<div className="audit-help-footer">
					<a href="/login?email=auditor@sba.dev&pass=Audit@123" className="btn btn-primary btn-lg">
						Go to Login (credentials pre-filled) →
					</a>
				</div>
			</div>
		</div>
	);
}

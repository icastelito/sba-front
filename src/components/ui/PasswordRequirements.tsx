import { IconCheck, IconX } from "./Icons";

interface PasswordRequirementsProps {
	password: string;
}

interface Requirement {
	label: string;
	test: (password: string) => boolean;
}

const requirements: Requirement[] = [
	{
		label: "Mínimo de 8 caracteres",
		test: (pwd) => pwd.length >= 8,
	},
	{
		label: "Pelo menos 1 letra minúscula",
		test: (pwd) => /[a-z]/.test(pwd),
	},
	{
		label: "Pelo menos 1 letra maiúscula",
		test: (pwd) => /[A-Z]/.test(pwd),
	},
	{
		label: "Pelo menos 1 número",
		test: (pwd) => /\d/.test(pwd),
	},
];

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
	return (
		<div
			style={{
				marginTop: "0.75rem",
				padding: "0.75rem",
				backgroundColor: "var(--bg-secondary)",
				borderRadius: "0.375rem",
				fontSize: "0.875rem",
			}}
		>
			<div style={{ marginBottom: "0.5rem", fontWeight: 500, color: "var(--text-primary)" }}>
				Requisitos da senha:
			</div>
			<ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
				{requirements.map((req, index) => {
					const isValid = req.test(password);
					return (
						<li
							key={index}
							style={{
								display: "flex",
								alignItems: "center",
								gap: "0.5rem",
								padding: "0.25rem 0",
								color: isValid ? "var(--success)" : "var(--text-secondary)",
								transition: "color 0.2s ease",
							}}
						>
							{isValid ? (
								<IconCheck size={16} style={{ flexShrink: 0 }} />
							) : (
								<IconX size={16} style={{ flexShrink: 0 }} />
							)}
							<span style={{ textDecoration: isValid ? "line-through" : "none" }}>{req.label}</span>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

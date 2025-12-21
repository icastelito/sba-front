import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

const defaultProps: SVGProps<SVGSVGElement> = {
	xmlns: "http://www.w3.org/2000/svg",
	fill: "none",
	viewBox: "0 0 24 24",
	strokeWidth: 1.5,
	stroke: "currentColor",
};

export function IconTasks({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
	);
}

export function IconTemplate({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
			/>
		</svg>
	);
}

export function IconProducts({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
			/>
		</svg>
	);
}

export function IconPlus({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
		</svg>
	);
}

export function IconSearch({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
			/>
		</svg>
	);
}

export function IconFilter({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
			/>
		</svg>
	);
}

export function IconEdit({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
			/>
		</svg>
	);
}

export function IconTrash({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
			/>
		</svg>
	);
}

export function IconClose({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
		</svg>
	);
}

export function IconCheck({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
		</svg>
	);
}

export function IconChevronLeft({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
		</svg>
	);
}

export function IconChevronRight({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
		</svg>
	);
}

export function IconChevronDown({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
		</svg>
	);
}

export function IconCalendar({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
			/>
		</svg>
	);
}

export function IconClock({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	);
}

export function IconUser({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
			/>
		</svg>
	);
}

export function IconTag({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
			/>
			<path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
		</svg>
	);
}

export function IconUpload({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
			/>
		</svg>
	);
}

export function IconLink({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
			/>
		</svg>
	);
}

export function IconExternalLink({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
			/>
		</svg>
	);
}

export function IconImage({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
			/>
		</svg>
	);
}

export function IconRefresh({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
			/>
		</svg>
	);
}

export function IconEye({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
			/>
			<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
		</svg>
	);
}

export function IconEyeOff({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
			/>
		</svg>
	);
}

export function IconTotal({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
			/>
		</svg>
	);
}

export function IconPending({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	);
}

export function IconCompleted({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
	);
}

export function IconWarning({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
			/>
		</svg>
	);
}

export function IconInfo({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
			/>
		</svg>
	);
}

export function IconCurrency({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
	);
}

export function IconBarcode({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
			/>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
			/>
		</svg>
	);
}

export function IconCategory({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z"
			/>
		</svg>
	);
}

export function IconSort({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
			/>
		</svg>
	);
}

export function IconPlay({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
			/>
		</svg>
	);
}

export function IconDuplicate({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
			/>
		</svg>
	);
}

export function IconClear({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z"
			/>
		</svg>
	);
}

export function IconMail({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
			/>
		</svg>
	);
}

export function IconPhone({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
			/>
		</svg>
	);
}

export function IconUsers({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
			/>
		</svg>
	);
}

export function IconShoppingCart({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
			/>
		</svg>
	);
}

export function IconClients({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
			/>
		</svg>
	);
}

// Status Icons
export function IconHourglass({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	);
}

export function IconCheckCircle({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
	);
}

export function IconCash({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
			/>
		</svg>
	);
}

export function IconCog({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
			/>
		</svg>
	);
}

export function IconTruck({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
			/>
		</svg>
	);
}

export function IconPackage({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
			/>
		</svg>
	);
}

export function IconXCircle({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
	);
}

export function IconArrowUturnLeft({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
		</svg>
	);
}

export function IconHomeCheck({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
			/>
		</svg>
	);
}

export function IconMapPin({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
			/>
		</svg>
	);
}

export function IconShopee({ size = 24, ...props }: IconProps) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
			<path d="M12 2C9.243 2 7 4.243 7 7h2c0-1.654 1.346-3 3-3s3 1.346 3 3h2c0-2.757-2.243-5-5-5z" />
			<path d="M18 7H6c-1.103 0-2 .897-2 2v11c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V9c0-1.103-.897-2-2-2zm-6 10c-2.757 0-5-2.243-5-5h2c0 1.654 1.346 3 3 3s3-1.346 3-3h2c0 2.757-2.243 5-5 5z" />
		</svg>
	);
}

export function IconError({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
			/>
		</svg>
	);
}

export function IconX({ size = 24, ...props }: IconProps) {
	return (
		<svg {...defaultProps} width={size} height={size} {...props}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
		</svg>
	);
}

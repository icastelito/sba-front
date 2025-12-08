import { useState, useRef, useEffect } from "react";
import { API_BASE_URL } from "../../lib/api";
import { IconUpload, IconLink, IconClose } from "../ui";

interface ImageUploadProps {
	currentImage?: string | null;
	imageType?: "local" | "external" | null;
	onFileSelect: (file: File | null) => void;
	onUrlChange: (url: string) => void;
	onRemove: () => void;
}

export function ImageUpload({ currentImage, imageType, onFileSelect, onUrlChange, onRemove }: ImageUploadProps) {
	const [mode, setMode] = useState<"upload" | "url">("upload");
	const [preview, setPreview] = useState<string | null>(null);
	const [externalUrl, setExternalUrl] = useState("");
	const [dragActive, setDragActive] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Limpar preview quando a imagem atual mudar
	useEffect(() => {
		if (!currentImage) {
			setPreview(null);
			setExternalUrl("");
		}
	}, [currentImage]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		processFile(file);
	};

	const processFile = (file: File | undefined) => {
		if (file) {
			const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
			if (!validTypes.includes(file.type)) {
				alert("Formato de imagem inválido. Use: JPG, PNG, GIF ou WebP");
				return;
			}

			if (file.size > 5 * 1024 * 1024) {
				alert("Imagem muito grande. Máximo: 5MB");
				return;
			}

			setPreview(URL.createObjectURL(file));
			onFileSelect(file);
		}
	};

	const handleDrag = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		const file = e.dataTransfer.files?.[0];
		processFile(file);
	};

	const handleUrlSubmit = () => {
		if (externalUrl) {
			onUrlChange(externalUrl);
			setPreview(externalUrl);
		}
	};

	const handleRemove = () => {
		setPreview(null);
		setExternalUrl("");
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
		onFileSelect(null);
		onRemove();
	};

	const getDisplayImage = () => {
		if (preview) return preview;
		if (currentImage) {
			return imageType === "external" ? currentImage : `${API_BASE_URL}${currentImage}`;
		}
		return null;
	};

	const displayImage = getDisplayImage();

	return (
		<div className="form-group">
			<label className="form-label">Imagem</label>

			{/* Tabs */}
			<div className="image-upload-tabs">
				<button
					type="button"
					className={`image-upload-tab ${mode === "upload" ? "active" : ""}`}
					onClick={() => setMode("upload")}
				>
					<IconUpload size={16} />
					Upload
				</button>
				<button
					type="button"
					className={`image-upload-tab ${mode === "url" ? "active" : ""}`}
					onClick={() => setMode("url")}
				>
					<IconLink size={16} />
					URL Externa
				</button>
			</div>

			<div className="image-upload-content">
				{/* Preview */}
				{displayImage && (
					<div className="image-upload-preview">
						<img src={displayImage} alt="Preview" />
						<button
							type="button"
							onClick={handleRemove}
							className="image-upload-remove"
							title="Remover imagem"
						>
							<IconClose size={14} />
						</button>
					</div>
				)}

				{/* Upload de arquivo */}
				{mode === "upload" && !displayImage && (
					<div
						onDragEnter={handleDrag}
						onDragLeave={handleDrag}
						onDragOver={handleDrag}
						onDrop={handleDrop}
						onClick={() => fileInputRef.current?.click()}
						className={`image-upload-dropzone ${dragActive ? "active" : ""}`}
					>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
							onChange={handleFileChange}
							style={{ display: "none" }}
						/>
						<IconUpload size={48} className="image-upload-icon" />
						<p className="image-upload-text">Arraste uma imagem ou clique para selecionar</p>
						<small className="image-upload-hint">JPG, PNG, GIF ou WebP • Máximo 5MB</small>
					</div>
				)}

				{/* URL externa */}
				{mode === "url" && !displayImage && (
					<div className="image-upload-url">
						<input
							type="url"
							placeholder="https://exemplo.com/imagem.jpg"
							value={externalUrl}
							onChange={(e) => setExternalUrl(e.target.value)}
							className="form-input"
						/>
						<button
							type="button"
							onClick={handleUrlSubmit}
							disabled={!externalUrl}
							className="btn btn-primary"
						>
							Usar URL
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

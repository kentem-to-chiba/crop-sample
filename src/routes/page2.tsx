/**
 * このページでは、画像をトリミングする機能を実装します。
 * トリミングにはreact-image-cropを使用します。
 * 画像の回転や拡縮も実装します。
 * 画像がロードされたらcanvasに描画します。
 * 画像の表示はimgタグではなく、canvasタグを使用します。
 * aspectRatioは5:6で固定です。
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { type Crop, type PixelCrop, ReactCrop } from "react-image-crop";
// import sampleImg from "../assets/cat.png";
import sampleImg from "../assets/発注者との契約書.jpg";

const Page2 = () => {
	// 画像のトリミング範囲を保持するstate
	const [crop, setCrop] = useState<Crop>();

	// 画像のサイズを保持するstate
	const [imgSize, setImgSize] = useState<{
		orgWidth: number;
		orgHeight: number;
		scale: number;
		rotate: number;
	}>();

	// トリミング対象の画像を描画するためのcanvasを保持するref
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// トリミングされた画像を描画するためのcanvasを保持するref
	const croppedCanvasRef = useRef<HTMLCanvasElement>(null);

	// 画像の長辺とその長さを算出する関数
	const getLongSide = useCallback(
		(imgSize: { orgWidth: number; orgHeight: number; scale: number }): {
			side: "width" | "height";
			long: number;
		} => {
			return imgSize.orgWidth > imgSize.orgHeight
				? { side: "width", long: imgSize.orgWidth * imgSize.scale }
				: { side: "height", long: imgSize.orgHeight * imgSize.scale };
		},
		[],
	);

	const handleRotate = () => {
		if (!canvasRef.current) return;

		const canvasCtx = canvasRef.current.getContext("2d");
		if (!canvasCtx) return;

		if (!imgSize) return;

		const { long: imgLong } = getLongSide(imgSize);

		const img = new Image();
		img.src = sampleImg;
		img.onload = () => {
			const { side: imgLongSide } = getLongSide({
				orgWidth: img.width,
				orgHeight: img.height,
				scale: imgSize.scale,
			});
			canvasCtx.reset();
			canvasCtx.translate(imgLong / 2, imgLong / 2);
			canvasCtx.rotate(((imgSize.rotate + 90) * Math.PI) / 180);
			canvasCtx.translate(-imgLong / 2, -imgLong / 2);

			if (imgLongSide === "width") {
				canvasCtx.drawImage(
					img,
					0,
					(img.width * imgSize.scale - img.height * imgSize.scale) / 2,
					img.width * imgSize.scale,
					img.height * imgSize.scale,
				);
			} else if (imgLongSide === "height") {
				canvasCtx.drawImage(
					img,
					(img.height * imgSize.scale - img.width * imgSize.scale) / 2,
					0,
					img.width * imgSize.scale,
					img.height * imgSize.scale,
				);
			}
			canvasCtx.resetTransform();
			setImgSize((prev) => {
				if (!prev) return prev;
				return { ...prev, rotate: prev.rotate + 90 };
			});
		};
	};

	const handleCrop = (newCropped: PixelCrop) => {
		setCrop(newCropped);

		if (!croppedCanvasRef.current) return;
		if (!canvasRef.current) return;
		const croppedCanvasCtx = croppedCanvasRef.current.getContext("2d");
		const canvasCtx = canvasRef.current.getContext("2d");
		if (!croppedCanvasCtx) return;
		if (!canvasCtx) return;

		// トリミングされた画像を取得
		const croppedImage = canvasCtx.getImageData(
			newCropped.x,
			newCropped.y,
			newCropped.width,
			newCropped.height,
		);

		// トリミングされた画像を描画
		croppedCanvasCtx.reset();
		croppedCanvasCtx.putImageData(croppedImage, 0, 0);
	};

	const createHandleScale = (newScaleDiff: number) => () => {
		if (!canvasRef.current) return;

		const canvasCtx = canvasRef.current.getContext("2d");
		if (!canvasCtx) return;

		if (!imgSize) return;
		const newScale = imgSize.scale + newScaleDiff;

		const img = new Image();
		img.src = sampleImg;
		img.onload = () => {
			const { long: imgLong, side: imgLongSide } = getLongSide({
				orgWidth: img.width,
				orgHeight: img.height,
				scale: newScale,
			});
			canvasCtx.reset();
			canvasCtx.translate((imgLong * newScale) / 2, (imgLong * newScale) / 2);
			canvasCtx.rotate((imgSize.rotate * Math.PI) / 180);
			canvasCtx.translate((-imgLong * newScale) / 2, (-imgLong * newScale) / 2);

			if (imgLongSide === "width") {
				canvasCtx.drawImage(
					img,
					0,
					(img.width * newScale - img.height * newScale) / 2,
					img.width * newScale,
					img.height * newScale,
				);
			} else if (imgLongSide === "height") {
				canvasCtx.drawImage(
					img,
					(img.height * newScale - img.width * newScale) / 2,
					0,
					img.width * newScale,
					img.height * newScale,
				);
			}
			canvasCtx.resetTransform();
			setImgSize((prev) => {
				if (!prev) return prev;
				return { ...prev, scale: newScale };
			});
		};
	};

	// 初期レンダリングの際に画像をロードして、canvasに描画する
	useEffect(() => {
		if (!canvasRef.current) return;

		const ctx = canvasRef.current.getContext("2d");
		if (!ctx) return;

		const img = new Image();
		img.src = sampleImg;
		img.onload = () => {
			const { side: imgLongSide } = getLongSide({
				orgWidth: img.width,
				orgHeight: img.height,
				scale: 1,
			});
			if (imgLongSide === "width") {
				ctx.drawImage(
					img,
					0,
					(img.width - img.height) / 2,
					img.width,
					img.height,
				);
			} else if (imgLongSide === "height") {
				ctx.drawImage(
					img,
					(img.height - img.width) / 2,
					0,
					img.width,
					img.height,
				);
			}
			setImgSize({
				orgWidth: img.width,
				orgHeight: img.height,
				scale: 1,
				rotate: 0,
			});
		};
	}, [getLongSide]);

	return (
		<div>
			{/* canvasRefを90度回転させる */}
			<button type="button" onClick={handleRotate}>
				回転
			</button>

			{/* canvasRefを拡大する */}
			<button type="button" onClick={createHandleScale(0.1)}>
				拡大
			</button>

			{/* canvasRefを縮小する */}
			<button type="button" onClick={createHandleScale(-0.1)}>
				縮小
			</button>

			<ReactCrop crop={crop} onChange={handleCrop} aspect={5 / 6}>
				<canvas
					ref={canvasRef}
					width={1500}
					height={1500}
					style={{ border: "1px solid black" }}
				/>
			</ReactCrop>

			{/* トリミングされた画像を描画 */}
			<canvas
				ref={croppedCanvasRef}
				width={1500}
				height={1500}
				style={{ border: "1px solid black" }}
			/>

			{/* トリミングされた画像をダウンロード */}
			<button
				type="button"
				onClick={() => {
					if (!croppedCanvasRef.current) return;
					const a = document.createElement("a");
					a.href = croppedCanvasRef.current.toDataURL();
					a.download = "croppedImg.png";
					a.click();
				}}
			>
				Download
			</button>
		</div>
	);
};
export default Page2;

import { useEffect, useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import sampleImg from "../assets/cat.png";

function Page1() {
	const [crop, setCrop] = useState<Crop>();
	const [aspect, setAspect] = useState<number | undefined>(5 / 6);

	useEffect(() => {
		console.log(crop);
	}, [crop]);

	return (
		<>
			<input
				type="checkbox"
				checked={aspect === 5 / 6}
				onChange={() => setAspect((prev) => (prev ? undefined : 5 / 6))}
			/>
			<ReactCrop crop={crop} onChange={(c) => setCrop(c)} aspect={aspect}>
				<img src={sampleImg} alt="sample" />
			</ReactCrop>
		</>
	);
}

export default Page1;

import { useEffect, useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import sampleImg from "../assets/cat.png";

function Page1() {
	const [crop, setCrop] = useState<Crop>();

	useEffect(() => {
		console.log(crop);
	}, [crop]);

	return (
		<ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
			<img src={sampleImg} alt="sample" />
		</ReactCrop>
	);
}

export default Page1;

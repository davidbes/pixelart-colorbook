export const createPixelArray = (imgData, pixelCount) => {
	const pixels = imgData;
	const pixelArray = [];
	for (let i = 0, offset, r, g, b; i < pixelCount; i++) {
		offset = i * 4;
		r = pixels[offset + 0];
		g = pixels[offset + 1];
		b = pixels[offset + 2];

		pixelArray.push([r, g, b, 255]);
	}
	return pixelArray;
};

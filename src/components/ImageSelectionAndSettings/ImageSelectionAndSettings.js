import React, { useState, useCallback } from 'react';
import ImageSettings from './ImageSettings/ImageSettings';
import PreviewImage from './PreviewImage/PreviewImage';
import UploadImage from './UploadImage/UploadImage';
import './ImageSelectionAndSettings.scss';
import quantize from 'quantize';
import { createPixelArray } from '../../utils/createPixelArray';
import { deltaE } from '../../utils/deltaE';
import allRalColors from '../../assets/data/palette.json';

const ImageSelectionAndSettings = ({ saveData }) => {
	const [imageSrc, setImageSrc] = useState(null);
	const [fileName, setFileName] = useState(null);
	const [imageDimensions, setImageDimensions] = useState({});
	const [settings, setSettings] = useState({});

	const clearImageData = useCallback(() => {
		setImageSrc(null);
	}, []);

	const buttonClick = useCallback(() => {
		if (
			settings &&
			settings.width &&
			settings.height &&
			settings.maxColors &&
			settings.squareSize &&
			imageSrc
		) {
			const { width, height, maxColors, squareSize } = settings;
			let img = new Image();
			img.crossOrigin = 'anonymous';
			img.onload = () => {
				// Round dimensions to the nearest integers for accurate result.
				const roundedHeight = Math.round(height);
				const roundedWidth = Math.round(width);

				const canvas = document.createElement('canvas');

				// Setup canvas dimensions.
				canvas.width = roundedWidth;
				canvas.height = roundedHeight;

				// Draw image to the canvas in the size of the rounded width.
				const canvasContext = canvas.getContext('2d');
				canvasContext.drawImage(img, 0, 0, roundedWidth, roundedHeight);

				// Get drawn image data.
				const imageData = canvasContext.getImageData(0, 0, roundedWidth, roundedHeight);
				const imagePixels = imageData.data;
				const imagePixelCount = roundedWidth * roundedHeight;

				// Create pixls array of the whole image.
				const pixelArray = createPixelArray(imagePixels, imagePixelCount);

				// Get map of quantized colors.
				const cmap = quantize(pixelArray, maxColors);
				const quantizedPalette = cmap.palette();

				// Generated Ral Palette
				const ralPalette = [];
				quantizedPalette.forEach(qColor => {
					// Find the closest ral color for this quantized color.
					const { ralColor } = allRalColors.reduce((bestColor, rColor) => {
						const rColorObj = {
							deltaE: deltaE(qColor, rColor.rgb.split(',')),
							ralColor: rColor,
						};
						return bestColor &&
							Math.min(bestColor.deltaE, rColorObj.deltaE) === bestColor.deltaE
							? bestColor
							: rColorObj || rColorObj;
					});

					// Find duplicated color in ral
					const duplicatedRal = ralPalette.find(
						paletteObj => paletteObj.ral.ral === ralColor.ral
					);

					// If there is not an element already inside the palette, add it.
					if (!duplicatedRal) {
						ralPalette.push({
							original: qColor.join(','),
							ral: ralColor,
						});
					} else {
						// There is already an element here, meaning we have a different RGB value. So we replace the string with array of two strings.
						const newArray =
							typeof duplicatedRal.original === 'string'
								? [duplicatedRal.original, qColor.join(',')]
								: [...duplicatedRal.original, qColor.join(',')];
						ralPalette.splice(ralPalette.indexOf(duplicatedRal), 1, {
							original: newArray,
							ral: ralColor,
						});
					}
				});

				// Find all the pixels's nearest quantized colors.
				const generatedPalette = [];
				pixelArray.forEach(pixel => {
					generatedPalette.push(cmap.map(pixel));
				});

				// Transform the generatedPalette of pixels into array of arrays for easier rendering.
				let i = 0;
				const mappedArray = [];
				while (generatedPalette.length) {
					mappedArray.push({
						row: i,
						columns: generatedPalette.splice(0, roundedWidth),
					});
					i++;
				}

				saveData({
					fileName: fileName,
					squareSize: squareSize,
					palette: ralPalette,
					pixels: mappedArray,
				});
				img = null;
			};
			img.src = imageSrc;
		}
	}, [imageSrc, fileName, settings, saveData]);

	return (
		<>
			<div className='img-upload-title '>Image upload and settings</div>
			<div className='img-settings-and-upload-wrapper'>
				{(!imageSrc && (
					<UploadImage returnImageSrc={setImageSrc} returnFileName={setFileName} />
				)) || (
					<>
						<ImageSettings imageDimensions={imageDimensions} returnSettings={setSettings} />
						<PreviewImage
							imageSrc={imageSrc}
							fileName={fileName}
							returnImgDimensions={setImageDimensions}
							clearImageData={clearImageData}
							returnSettings={setSettings}
						/>
					</>
				)}
			</div>
			<div className='img-settings-generate-button'>
				<button onClick={buttonClick}>Generate Pixels</button>
			</div>
		</>
	);
};

export default ImageSelectionAndSettings;

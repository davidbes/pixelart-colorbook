import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import domtoimage from 'dom-to-image-more';
import quantize from 'quantize';
import { createPixelArray } from '../../utils/createPixelArray';
import { deltaE } from '../../utils/deltaE';
import Palette from './Palette';
import allRalColors from '../../assets/data/palette.json';
import './GeneratedPaletteAndColorbook.scss';

const GeneratedPaletteAndColorBook = ({ data }) => {
	const [pixelData, setPixelData] = useState([]);
	const [colorPalette, setColorPalette] = useState([]);
	const [shouldColor, setShouldColor] = useState(false);
	const { width, height, maxColors, squareSize } = data.settings;

	useEffect(() => {
		if (width && height && maxColors && squareSize) {
			setPixelData([]);
			setColorPalette([]);
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
				setPixelData(mappedArray);
				setColorPalette(ralPalette);
				img = null;
			};
			img.src = data.imageSrc;
		}
	}, [height, width, maxColors, data.imageSrc, squareSize]);

	const componentRef = useRef();
	const paletteRef = useRef();

	const generateSVG = useCallback(() => {
		domtoimage.toSvg(componentRef.current).then(function (dataUrl) {
			const link = document.createElement('a');
			link.download = 'colorbook.svg';
			link.href = dataUrl;
			link.click();
		});
		domtoimage.toSvg(paletteRef.current).then(function (dataUrl) {
			const link = document.createElement('a');
			link.download = 'palette.svg';
			link.href = dataUrl;
			link.click();
		});
	}, [componentRef]);

	const generateJPG = useCallback(() => {
		domtoimage.toJpeg(componentRef.current).then(function (dataUrl) {
			const link = document.createElement('a');
			link.download = 'colorbook.jpeg';
			link.href = dataUrl;
			link.click();
		});
		domtoimage.toJpeg(paletteRef.current).then(function (dataUrl) {
			const link = document.createElement('a');
			link.download = 'palette.jpeg';
			link.href = dataUrl;
			link.click();
		});
	}, [componentRef]);

	const genreatePNG = useCallback(() => {
		domtoimage.toPng(componentRef.current).then(function (dataUrl) {
			const link = document.createElement('a');
			link.download = 'colorbook.png';
			link.href = dataUrl;
			link.click();
		});
		domtoimage.toPng(paletteRef.current).then(function (dataUrl) {
			const link = document.createElement('a');
			link.download = 'palette.png';
			link.href = dataUrl;
			link.click();
		});
	}, [componentRef]);

	function isSameSquarePalette(box, original) {
		if (!original || !box) return false;
		if (typeof original === 'string') {
			return original === box;
		} else if (Array.isArray(original)) {
			return original.includes(box);
		} else return false;
	}

	return (
		<div className='result-row'>
			<div>
				Colors generated {colorPalette && colorPalette.length}
				<div style={{ maxHeight: '700px', overflow: 'scroll', width: '100%' }}>
					<div ref={paletteRef}>
						{colorPalette && colorPalette.length > 0 && (
							<Palette palette={colorPalette}></Palette>
						)}
					</div>
				</div>
				<div>
					{shouldColor ? 'Showing "result"' : 'Showing blank'}
					<input
						type='checkbox'
						checked={shouldColor}
						onChange={() => setShouldColor(!shouldColor)}
					/>
				</div>
				<div>
					<button onClick={() => generateSVG(componentRef)}>Download SVG</button>
				</div>
				<div>
					<button onClick={() => generateJPG(componentRef)}>Download JPG</button>
				</div>
				<div>
					<button onClick={() => genreatePNG(componentRef)}>Download PNG</button>
				</div>
			</div>
			<div className='box'>
				<div className='colorbook' ref={componentRef}>
					{pixelData &&
						squareSize &&
						colorPalette &&
						pixelData.map((row, index, arr) => {
							const prevRow = (index !== 0 && pixelData[index - 1]) || null;
							const nextRow = (index + 1 !== arr.length && pixelData[index + 1]) || null;
							return (
								<div
									key={row.row}
									className='colorbook-row'
									style={{
										width: `${row.columns.length * squareSize}mm`,
										height: `${squareSize}mm`,
									}}>
									{row.columns.map((column, index, arr) => {
										const { top, bottom, left, right, center } = {
											center: column.join(','),
											top: prevRow && prevRow.columns[index].join(','),
											bottom: nextRow && nextRow.columns[index].join(','),
											left: (index !== 0 && row.columns[index - 1].join(',')) || null,
											right:
												(index + 1 !== arr.length &&
													row.columns[index + 1].join(',')) ||
												null,
										};

										const columnData =
											(colorPalette &&
												colorPalette.length > 0 &&
												colorPalette.find(color => {
													if (!Array.isArray(color.original)) {
														return color.original === center;
													} else {
														return color.original.includes(center);
													}
												})) ||
											null;

										const isTopEq =
											columnData && isSameSquarePalette(top, columnData.original);
										const isBotEq =
											columnData && isSameSquarePalette(bottom, columnData.original);
										const isRightEq =
											columnData && isSameSquarePalette(right, columnData.original);
										const isLeftEq =
											columnData && isSameSquarePalette(left, columnData.original);

										const allBoxesAreEqual = isTopEq && isRightEq && isLeftEq && isBotEq;

										return (
											<div
												key={row.row + index}
												className='colorbook-column'
												style={{
													fontSize: `${squareSize * 2}px`,
													borderTop: !shouldColor && createBorder(isTopEq),
													borderBottom: !shouldColor && createBorder(isBotEq),
													borderRight: !shouldColor && createBorder(isRightEq),
													borderLeft: !shouldColor && createBorder(isLeftEq),
													background: shouldColor
														? columnData &&
														  columnData.ral &&
														  columnData.ral.rgb &&
														  `rgb(${columnData.ral.rgb})`
														: 'white',
													display: 'inline-block',
													whiteSpace: 'none',
													flexGrow: 1,
													height: '100%',
													width: '100%',
													textAlign: 'center',
													color: 'rgb(0,0,0,0.8)',
													overflow: 'hidden',
												}}>
												{!shouldColor &&
													!allBoxesAreEqual &&
													columnData &&
													columnData.ral &&
													columnData.ral.code}
											</div>
										);
									})}
								</div>
							);
						})}
				</div>
			</div>
		</div>
	);
};

export default GeneratedPaletteAndColorBook;

const createBorder = isSideEqual => `0.2px solid ${isSideEqual ? '#FFFFFF' : '#5D5D5D'}`;
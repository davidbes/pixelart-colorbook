import React, { useEffect, useState } from 'react';
import quantize from 'quantize';
import './GeneratedPaletteAndColorbook.scss';
const GeneratedPaletteAndColorBook = ({ data }) => {
	const [pixelData, setPixelData] = useState([]);
	const [colorPalette, setColorPalette] = useState([]);
	const { width, height, maxColors, squareSize } = data.settings;
	console.log(data);

	useEffect(() => {
		setPixelData([]);
		setColorPalette([]);
		let img = new Image();
		img.crossOrigin = 'anonymous';
		img.src = data.imageSrc;
		img.onload = () => {
			const canvas = document.createElement('canvas');

			const roundedHeight = Math.round(height);
			const roundedWidth = Math.round(width);

			const canvasContext = canvas.getContext('2d');
			canvasContext.drawImage(img, 0, 0, roundedWidth, roundedHeight);

			console.log(roundedHeight, roundedWidth);
			const imageData = canvasContext.getImageData(0, 0, roundedWidth, roundedHeight);
			const imagePixels = imageData.data;
			const imagePixelCount = roundedWidth * roundedHeight;
			console.log(imagePixelCount);
			const pixelArray = createPixelArray(imagePixels, imagePixelCount, 1);

			const cmap = quantize(pixelArray, maxColors);
			console.log('pixel array', pixelArray);
			const palette = cmap.palette();
			// console.log(palette);
			const generateRGBArrayOfPalette = palette.map(palCol => palCol.join(','));
			const generatedPalette = [];
			pixelArray.forEach(pixel => {
				generatedPalette.push(cmap.map(pixel));
			});
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
			setColorPalette(generateRGBArrayOfPalette);
			img = null;
		};
	}, [height, width, maxColors, data.imageSrc]);

	console.log(colorPalette);
	console.log(pixelData);

	return (
		<div className='result-row'>
			<div
				style={{
					display: 'flex',
					width: '100%',
				}}>
				{colorPalette && (
					<div>
						{colorPalette.map((color, i) => {
							console.log(color);
							return (
								<div
									style={{
										background: `rgb(${color})`,
										display: 'inline-block',
										height: '50px',
										width: '50px',
										margin: '10px',
									}}></div>
							);
						})}
					</div>
				)}
			</div>
			<div className='box'>
				<div className='picture'>
					{(pixelData &&
						squareSize &&
						pixelData.map((row, index, arr) => {
							const prevRow = (index !== 0 && pixelData[index - 1]) || null;
							const nextRow = (index + 1 !== arr.length && pixelData[index + 1]) || null;
							return (
								<div
									key={row.row}
									style={{
										display: 'flex',
										width: `${row.columns.length * squareSize}mm`,
										height: `${squareSize}mm`,
									}}>
									{row.columns.map((column, index, arr) => {
										const prev = (index !== 0 && row.columns[index - 1]) || null;
										const curr = column;
										const next =
											(index + 1 !== arr.length && row.columns[index + 1]) || null;

										const prevRC = prevRow && prevRow.columns[index];
										const nextRC = nextRow && nextRow.columns[index];

										const prevI = prev && colorPalette.indexOf(prev.join(','));
										const currI = curr && colorPalette.indexOf(curr.join(','));
										const nextI = next && colorPalette.indexOf(next.join(','));

										const prevRCI = prevRC && colorPalette.indexOf(prevRC.join(','));
										const nextRCI = nextRC && colorPalette.indexOf(nextRC.join(','));

										const shouldColor = true;
										const leftBorder =
											prevI !== currI
												? '1px solid black'
												: shouldColor
												? `1px solid rgb(${curr.join(',')}) `
												: '1px solid white';
										const rightBorder =
											nextI !== currI
												? '1px solid black'
												: shouldColor
												? `1px solid rgb(${curr.join(',')}) `
												: '1px solid white';
										const topBorder =
											prevRCI !== currI
												? '1px solid black'
												: shouldColor
												? `1px solid rgb(${curr.join(',')})  `
												: '1px solid white';
										const bottomBorder =
											nextRCI !== currI
												? '1px solid black'
												: shouldColor
												? `1px solid rgb(${curr.join(',')})`
												: '1px soldid white';

										return (
											<div
												style={{
													display: 'inline-block',
													whiteSpace: 'none',
													flexGrow: 1,
													color: 'black',
													overflow: 'hidden',
													borderLeft: leftBorder,
													borderRight: rightBorder,
													borderTop: topBorder,
													borderBottom: bottomBorder,
													background: shouldColor ? `rgb(${curr.join(',')})` : 'white',
												}}>
												{/* {currI} */}
											</div>
										);
									})}
								</div>
							);
						})) || <div>Loading</div>}
				</div>
			</div>
		</div>
	);
};

export default GeneratedPaletteAndColorBook;

function createPixelArray(imgData, pixelCount) {
	const pixels = imgData;
	const pixelArray = [];
	console.log(imgData);
	for (let i = 0, offset, r, g, b, a; i < pixelCount; i++) {
		offset = i * 4;
		r = pixels[offset + 0];
		g = pixels[offset + 1];
		b = pixels[offset + 2];
		a = pixels[offset + 3];

		// If pixel is mostly opaque and not white
		pixelArray.push([r, g, b, a]);
	}
	return pixelArray;
}

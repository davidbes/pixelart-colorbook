import React, { useState, useCallback, useEffect } from 'react';
import './ImageSettings.scss';
import SelectPaper from '../../../components-UI/Select/Select';

const paperSizes = [
	{
		key: 'A0',
		height: 1189,
		width: 841,
	},
	{
		key: 'A1',
		height: 841,
		width: 594,
	},
	{
		key: 'A2',
		height: 594,
		width: 420,
	},
	{
		key: 'A3',
		height: 420,
		width: 297,
	},
	{
		key: 'A4',
		height: 297,
		width: 210,
	},
	{
		key: 'A5',
		height: 210,
		width: 148,
	},
];

const ImageSettings = ({ imageDimensions: { imageWidth, imageHeight }, returnSettings }) => {
	const [pixelsWidth, setPixelsWidth] = useState(undefined);
	const [pixelsHeight, setpixelsHeight] = useState(undefined);
	const [ratio, setRatio] = useState(1);
	const [pixelizationLevel, setPixelizationLevel] = useState(5);
	// const [whitespace, setWhitespace] = useState(21); //todo whitespace
	const [squareSize, setSquareSize] = useState(10);
	const [paperSize, setPaperSize] = useState(paperSizes[4]);
	const [maxColors, setMaxColors] = useState(15);

	useEffect(() => {
		if (imageHeight && imageWidth && pixelizationLevel) {
			setpixelsHeight(Math.round(imageHeight / pixelizationLevel));
			setPixelsWidth(Math.round(imageWidth / pixelizationLevel));
			const ratio = imageHeight / imageWidth;
			setRatio(ratio);
		}
	}, [imageHeight, imageWidth, pixelizationLevel]);

	const updateInput = useCallback(
		({ target }) => {
			switch (target.name) {
				case 'widthInput':
					setPixelsWidth(target.value);
					setpixelsHeight(Math.round(target.value * ratio));
					setPixelizationLevel((imageWidth / target.value).toFixed(2));
					break;
				case 'heightInput':
					setpixelsHeight(target.value);
					setPixelsWidth(Math.round(target.value / ratio));
					setPixelizationLevel((imageHeight / target.value).toFixed(2));
					break;
				case 'pixelizationLevelInput':
					setpixelsHeight(Math.round(imageHeight / target.value));
					setPixelsWidth(Math.round(imageWidth / target.value));
					setPixelizationLevel(target.value);
					break;
				case 'maxColors':
					setMaxColors(target.value);
					break;
				default:
					break;
			}
		},
		[ratio, imageHeight, imageWidth]
	);

	useEffect(() => {
		const getMax = Math.max(pixelsWidth, pixelsHeight);
		const getMin = Math.min(pixelsWidth, pixelsHeight);

		const idealSquareForHeight = paperSize.height / getMax;
		const willIdealSquareForHeightFitToWidth = idealSquareForHeight * getMin < paperSize.width;

		const idealSquareForWidth = paperSize.width / getMin;
		const willIdealSquareForWidthFitToWHeight = idealSquareForWidth * getMax < paperSize.height;

		const roundedHeight = Math.round(idealSquareForHeight * 10) / 10;
		const roundedWidth = Math.round(idealSquareForWidth * 10) / 10;

		willIdealSquareForHeightFitToWidth && setSquareSize(roundedHeight);
		willIdealSquareForWidthFitToWHeight && setSquareSize(roundedWidth);
	}, [pixelsHeight, pixelsWidth, paperSize, squareSize]);

	useEffect(() => {
		returnSettings({
			height: pixelsHeight,
			width: pixelsWidth,
			paperSize: paperSize,
			maxColors: maxColors,
			squareSize: squareSize,
		});
	}, [pixelsHeight, pixelsWidth, paperSize, squareSize, maxColors, returnSettings]);
	return (
		<div className='settings-column'>
			<div className='section-title'>Color book difficulty</div>
			<div className='row'>
				<div className='dimensions'>
					<div className='col'>
						<div className='col-title'></div>
						<input
							name='widthInput'
							type='number'
							value={pixelsWidth}
							onChange={updateInput}
						/>
						<div className='col-title'>WIDTH</div>
					</div>
					<div className='x'>x</div>
					<div className='col'>
						<input
							name='heightInput'
							type='number'
							value={pixelsHeight}
							onChange={updateInput}
						/>
						<div className='col-title'>HEIGHT</div>
					</div>
				</div>
				<div className='col'>
					<input
						name='pixelizationLevelInput'
						type='number'
						value={pixelizationLevel}
						onChange={updateInput}
					/>
					<div className='col-title'>PIXELIZATION LEVEL</div>
				</div>
			</div>
			<div className='section-title'>Paper size</div>
			<div className='row'>
				<SelectPaper
					selected={paperSize}
					options={paperSizes}
					returnSelectedOption={setPaperSize}
				/>
				<div className='col'>
					<div className='col-title'>SQUARE SIZE</div>
					<div>{squareSize}</div>
					<div className='col-title'>MM</div>
				</div>
				<div className='col'>
					<div className='col-title'>WHITEPSACE</div>
					<div>TBD</div>
					<div className='col-title'>MM</div>
				</div>
			</div>
			<div className='section-title'>Color Palette Settings</div>
			<div className='row'>
				<div className='col'>
					<div className='col-title'>MAX COLORS</div>
					<input name='maxColors' onChange={updateInput} value={maxColors} />
				</div>
			</div>
		</div>
	);
};

export default ImageSettings;

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

const ImageSettings = ({ imageDimensions }) => {
	const [paperSize, setPaperSize] = useState(paperSizes[4]);
	const [maxColors, setMaxColors] = useState(15);
	const [pixelsWidth, setPixelsWidth] = useState(100);
	const [pixelsHeight, setpixelsHeight] = useState(100);
	const [whitespace, setWhitespace] = useState(21);
	const [squareSize, setSquareSize] = useState(10);

	console.log(imageDimensions);

	useEffect(() => {
		if (imageDimensions) {
			setPixelsWidth(imageDimensions.imageWidth);
			setpixelsHeight(imageDimensions.imageHeight);
		}
	}, [imageDimensions]);

	const updateInput = useCallback(({ target }) => {
		switch (target.name) {
			case 'maxColors':
				// todo set color limit
				setMaxColors(target.value);
				break;
			case 'pixelsHeight':
				break;
			case 'pixelsWidth':
				setPixelsWidth(target.value);
				setpixelsHeight(target.value);
				break;
			default:
				break;
		}
	}, []);

	return (
		<div className='settings-column'>
			<div className='section-title'>Color book difficulty</div>
			<div className='row'>
				<div className='dimensions'>
					<div className='col'>
						<input
							name='pixelsWidth'
							type='number'
							value={pixelsWidth}
							onChange={updateInput}
						/>
						<div className='col-title'>WIDTH</div>
					</div>
					<div className='x'>x</div>
					<div className='col'>
						<input
							name='pixelsHeight'
							type='number'
							value={pixelsHeight}
							onChange={updateInput}
						/>
						<div className='col-title'>HEIGHT</div>
					</div>
				</div>
			</div>
			<div className='section-title'>Paper size</div>
			<div className='row'>
				<SelectPaper
					selected={paperSize}
					options={paperSizes}
					returnSelectedOption={setPaperSize}
				/>
				<div>
					<div className='col-title'>WHITESPACE</div>
					<input name='whitespace' type='number' value={whitespace} onChange={updateInput} />

					<div className='col-title'>MM</div>
				</div>
				<div>
					<div className='col-title'>SQUARE SIZE</div>
					<input name='squareSize' type='number' value={squareSize} onChange={updateInput} />
					<div className='col-title'>MM</div>
				</div>
			</div>
			<div className='section-title'>Color Palette Settings</div>
			<div className='row'>
				<div className='col'>
					<div className='col-title'>MAX COLORS</div>
					<input name='maxColors' type='number' value={maxColors} onChange={updateInput} />
				</div>
			</div>
		</div>
	);
};

export default ImageSettings;

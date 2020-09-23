import React, { useState, useCallback, useEffect } from 'react';
import './ImageSettings.scss';
import SelectPaper from '../../../components-UI/Select/Select';
import Input from '../../../components-UI/Input/Input';

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
		console.log(target);
	}, []);

	return (
		<div className='settings-column'>
			<div className='section-title'>Color book difficulty</div>
			<div className='row'>
				<div className='dimensions'>
					<Input subTitle='WIDTH' name='width' onChange={updateInput} value={pixelsWidth} />
					<div className='x'>x</div>
					<Input subTitle='HEIGHT' name='height' onChange={updateInput} value={pixelsHeight} />
				</div>
			</div>
			<div className='section-title'>Paper size</div>
			<div className='row'>
				<SelectPaper
					selected={paperSize}
					options={paperSizes}
					returnSelectedOption={setPaperSize}
				/>
				<Input
					title='WHITESPACE'
					name='whitespace'
					onChange={updateInput}
					value={whitespace}
					subTitle='MM'
				/>
				<Input
					title='SQUARE SIZE'
					name='squareSize'
					onChange={updateInput}
					value={squareSize}
					subTitle='MM'
				/>
			</div>
			<div className='section-title'>Color Palette Settings</div>
			<div className='row'>
				<Input title='MAX COLORS' name='maxColors' onChange={updateInput} value={maxColors} />
			</div>
		</div>
	);
};

export default ImageSettings;

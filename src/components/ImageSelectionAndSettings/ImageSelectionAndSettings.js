import React, { useState, useCallback } from 'react';
import './ImageSelectionAndSettings.scss';
import UploadImage from './UploadImage/UploadImage';
import PreviewImage from './PreviewImage/PreviewImage';
import ImageSettings from './ImageSettings/ImageSettings';

import image from '../../assets/images/image.png';

const ImageSelectionAndSettings = ({ processInProgress, saveData }) => {
	const [imageSrc, setImageSrc] = useState(null);
	// const [imageSrc, setImageSrc] = useState(image); TODO DELETE
	const [fileName, setFileName] = useState(null);
	const [imageDimensions, setImageDimensions] = useState({});

	const [pixelHeight, setPixelHeight] = useState(null);
	const [pixelWidth, setpixelWidth] = useState(null);

	const [maxColors, setMaxColors] = useState(10);
	const [predefinedColors, setPredefinedColors] = useState([]);

	const [paperSize, setPaperSize] = useState(null);
	const [whiteSpace, setWhiteSpace] = useState(null);
	const [squareSize, setsquareSize] = useState(null);

	const clearImageData = useCallback(() => {
		setImageSrc(null);
	}, []);

	const buttonClick = useCallback(() => {
		saveData({
			imageSrc,
			pixelHeight,
			pixelWidth,
			maxColors,
			predefinedColors,
			paperSize,
			whiteSpace,
			squareSize,
		});
	}, []);

	return (
		<>
			<div className='img-upload-title '>Image upload and settings</div>
			<div className='img-settings-and-upload-wrapper'>
				{(!imageSrc && (
					<UploadImage returnImageSrc={setImageSrc} returnFileName={setFileName} />
				)) || (
					<>
						<ImageSettings imageDimensions={imageDimensions} />
						<PreviewImage
							imageSrc={imageSrc}
							fileName={fileName}
							returnImgDimensions={setImageDimensions}
							clearImageData={clearImageData}
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

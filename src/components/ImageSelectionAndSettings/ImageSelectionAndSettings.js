import React, { useState, useCallback } from 'react';
import './ImageSelectionAndSettings.scss';
import UploadImage from './UploadImage/UploadImage';
import PreviewImage from './PreviewImage/PreviewImage';
import ImageSettings from './ImageSettings/ImageSettings';

const ImageSelectionAndSettings = ({ saveData }) => {
	const [imageSrc, setImageSrc] = useState(null);
	const [fileName, setFileName] = useState(null);
	const [imageDimensions, setImageDimensions] = useState({});
	const [settings, setSettings] = useState({});

	const clearImageData = useCallback(() => {
		setImageSrc(null);
	}, []);

	const buttonClick = useCallback(() => {
		saveData({
			imageSrc: imageSrc,
			fileName: fileName,
			imageDimensions: imageDimensions,
			settings: settings,
		});
	}, [imageSrc, fileName, imageDimensions, settings, saveData]);

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

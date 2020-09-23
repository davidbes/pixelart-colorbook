import React, { useEffect, useState } from 'react';
import './PreviewImage.scss';

const PreviewImage = ({ imageSrc, fileName, returnImgDimensions, clearImageData }) => {
	const [imageWidth, setImageWidth] = useState(100);
	const [imageHeight, setImageHeight] = useState(100);

	// Calculate image dimensions
	useEffect(() => {
		const img = new Image();
		img.onload = () => {
			setImageHeight(img.height);
			setImageWidth(img.width);

			returnImgDimensions({ imageHeight: img.height, imageWidth: img.width });
		};
		img.src = imageSrc;
		return () => {
			setImageHeight(100);
			setImageWidth(100);
		};
	}, [imageSrc]);

	return (
		<div className='preview-image'>
			{imageSrc && (
				<div className='image-wrapper'>
					<img
						src={imageSrc}
						style={{
							width: imageWidth >= imageHeight ? '60%' : 'auto',
							height: imageHeight > imageWidth ? '60%' : 'auto',
						}}
					/>
				</div>
			)}
			<div className='file-name' onClick={clearImageData}>
				{fileName && fileName}
			</div>
			<div className='dimensions'>
				{imageWidth && imageHeight && `${imageWidth} x ${imageHeight}`}
			</div>
		</div>
	);
};

export default PreviewImage;

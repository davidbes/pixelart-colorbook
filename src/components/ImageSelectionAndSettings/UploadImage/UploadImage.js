import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import uploadImage from '../../../assets/icons/upload-image.svg';

import './UploadImage.scss';

const UploadImage = ({ returnImageSrc, returnFileName }) => {
	// Recieve files with this callback
	const onDrop = useCallback(
		(acceptedFiles, fileRejections, event) => {
			// todo handle errors
			if (fileRejections.length) {
				return;
			}
			if (!acceptedFiles.length) return;

			const file = acceptedFiles[0];

			const fileName = file.name;

			const reader = new FileReader();
			reader.onload = ({ target: { result } }) => {
				returnImageSrc(result);
				returnFileName(fileName);
			};
			reader.readAsDataURL(file);
		},
		[returnImageSrc, returnFileName]
	);

	// Input Hook
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		maxFiles: 1,
		maxSize: 10 * 1024 * 1024,
	});

	return (
		<div className='upload-wrapper'>
			<div
				{...getRootProps({
					className: !isDragActive ? 'upload-label' : 'upload-label active',
				})}>
				<input {...getInputProps()} />
				<div className='text-div'>
					<img alt='upload' src={uploadImage} />

					<div className='bigger'> Drop image here</div>
					<div className='smaller'>or click here to select it from files</div>
				</div>
			</div>
		</div>
	);
};

export default UploadImage;

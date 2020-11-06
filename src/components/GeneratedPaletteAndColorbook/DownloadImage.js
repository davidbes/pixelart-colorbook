import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import domtoimage from 'dom-to-image-more';

const DownlaodImage = ({ fileName, colorbookRef, paletteRef }) => {
	const [isLoading, setIsLoading] = useState(false);

	const setDownloadStart = useCallback(async () => {
		const slicedFileName = fileName.split('.').slice(0, -1).join('.');
		setIsLoading(true);
		if (slicedFileName && colorbookRef && paletteRef) {
			const colorbookDataURL = await domtoimage.toJpeg(colorbookRef.current);
			const link = document.createElement('a');
			link.download = `${slicedFileName}-colorbook.jpeg`;
			link.href = colorbookDataURL;
			link.click();

			const paletteDataURL = await domtoimage.toJpeg(paletteRef.current, { bgcolor: '#ffffff' });
			const palLink = document.createElement('a');
			palLink.download = `${slicedFileName}-palette.jpeg`;
			palLink.href = paletteDataURL;
			palLink.click();

			setIsLoading(false);
		} else {
			setIsLoading(false);
		}
	}, [fileName, colorbookRef, paletteRef]);

	return (
		<ButtonWrapper>
			<button onClick={() => setDownloadStart()}>
				{isLoading ? 'Loading' : 'Download JPG'}
			</button>
		</ButtonWrapper>
	);
};

export default DownlaodImage;

const ButtonWrapper = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	display: flex;
	justify-content: center;
	button {
		display: block;
		width: 300px;
		height: 70px;
		margin: auto;
		background-color: #3b6978;
		color: #e4e3e3;
		font-size: 20px;
		text-transform: uppercase;
		border: none;
		border-radius: 18px;
		outline: none;
		cursor: pointer;
		box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.75);
		transition: 0.1s;

		:active {
			outline: none;
		}
	}
`;

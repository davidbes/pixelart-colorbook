import React, { useState } from 'react';
import styled from 'styled-components';
import ToggleColor from './ToggleColor';
import Colorbook from './Colorbook';
import Palette from './Palette';
import DownloadImage from './DownloadImage';

const GeneratedColorbookAndPalette = ({ palette, pixels, squareSize, fileName }) => {
	const [colorbookRef, setColorbookRef] = useState(null);
	const [paletteRef, setPaletteRef] = useState(null);
	const [shouldColor, setShouldColor] = useState(false);
	return (
		<Grid>
			<div className='section-title'>Generated Palette and Colorbook</div>
			<div className='color-count'>
				<div>Colors generated: {palette.length}</div>
			</div>
			<div className='toggle-switch'>
				<ToggleColor toggle={shouldColor} updateToggle={e => setShouldColor(e)} />
			</div>
			<div className='palette'>
				<Palette palette={palette} sendRef={ref => setPaletteRef(ref)} />
			</div>
			<div className='colorbook'>
				<Colorbook
					sendRef={ref => setColorbookRef(ref)}
					palette={palette}
					pixels={pixels}
					squareSize={squareSize}
					shouldColor={shouldColor}
				/>
			</div>
			<div className='download'>
				<DownloadImage
					fileName={fileName}
					colorbookRef={colorbookRef}
					paletteRef={paletteRef}
				/>
			</div>
		</Grid>
	);
};

export default GeneratedColorbookAndPalette;

const Grid = styled.div`
	width: 100%;
	height: 100%;
	display: grid;
	column-gap: 20px;
	grid-template-rows: 70px 70px 700px 150px;
	grid-template-columns: 1fr 1fr;

	.section-title {
		grid-column: 1 / 3;
		grid-row: 1;
		text-align: center;
	}

	.color-count {
		grid-column: 1 / 2;
		grid-row: 2;
		position: relative;
		div {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			font-size: 22px;
			color: #204051;
		}
	}

	.toggle-switch {
		grid-column: 2 / 3;
		grid-row: 2;
	}
	.palette {
		grid-column: 1 / 2;
		grid-row: 3;
	}
	.colorbook {
		grid-column: 2 / 3;
		grid-row: 3;
		box-shadow: inset 0 0 10px #000000;
	}
	.download {
		grid-column: 1 / 3;
		grid-row: 4;
	}
`;

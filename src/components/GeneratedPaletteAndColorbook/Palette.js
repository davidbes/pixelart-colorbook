import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const PaletteDiv = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-auto-rows: 100px;
	grid-gap: 10px;
	margin-right: 20px;
	margin-left: 20px;
`;

const ColorDiv = styled.div`
	display: flex;
	height: 100%;

	.square {
		width: 50px;
		background-color: ${props => props.color};
		color: ${props => props.codeColor};
		text-align: center;
		align-content: center;
		font-size: 22px;
		font-weight: bold;
		position: relative;

		div {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%) rotate(90deg);
		}
	}

	.info {
		width: 100%;
		margin: auto;
		height: 80px;
		padding: 10px;
		background: #fff;

		.code {
			font-size: 22px;
			font-weight: bold;
		}

		.name {
			font-size: 18px;
		}
	}
`;

const Palette = ({ palette = [] }) => {
	const [sortedPalette, setSortedPalette] = useState([]);
	useEffect(() => {
		setSortedPalette(
			palette.sort((colA, colB) => {
				const ralCodeA = colA.ral.ral.split(' ')[1];
				const ralCodeB = colB.ral.ral.split(' ')[1];
				return ralCodeA - ralCodeB;
			})
		);
	}, [palette]);
	return (
		<PaletteDiv>
			{sortedPalette.length > 0 &&
				sortedPalette.map(color => (
					<Color
						ral={color.ral.ral}
						code={color.ral.code}
						name={color.ral.name}
						rgb={color.ral.rgb}
					/>
				))}
		</PaletteDiv>
	);
};

export default Palette;

const Color = ({ ral, code, name, rgb }) => {
	const rgbArray = rgb.split(',');
	const textColor =
		0.213 * rgbArray[0] + 0.715 * rgbArray[1] + 0.072 * rgbArray[2] < 125 ? '#fff' : '$000';
	return (
		<ColorDiv color={`rgb(${rgb})`} codeColor={textColor}>
			<div className='square'>
				<div>{code}</div>
			</div>
			<div className='info'>
				<div className='code'>{name}</div>
				<div className='name'>{ral}</div>
			</div>
		</ColorDiv>
	);
};

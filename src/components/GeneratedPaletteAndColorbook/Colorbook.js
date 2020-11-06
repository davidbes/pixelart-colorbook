import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const Colorbook = ({ palette, pixels, squareSize, shouldColor, sendRef }) => {
	const colorbookRef = useRef(null);

	const createBorder = isSideEqual => `0.2px solid ${isSideEqual ? '#FFFFFF' : '#5D5D5D'}`;
	const isSameSquarePalette = (box, original) => {
		if (!original || !box) return false;
		if (typeof original === 'string') {
			return original === box;
		} else if (Array.isArray(original)) {
			return original.includes(box);
		} else return false;
	};

	useEffect(() => {
		sendRef(colorbookRef);
	}, [colorbookRef, sendRef]);

	return (
		<ColorbookContainer>
			<div ref={colorbookRef} className='colorbook'>
				{(squareSize &&
					palette &&
					pixels &&
					pixels.map((row, index, arr) => {
						const prevRow = (index !== 0 && pixels[index - 1]) || null;
						const nextRow = (index + 1 !== arr.length && pixels[index + 1]) || null;
						return (
							<Row
								key={row.row}
								rowWidth={`${row.columns.length * squareSize}mm`}
								rowHeight={`${squareSize}mm`}>
								{row.columns.map((column, index, arr) => {
									const { top, bottom, left, right, center } = {
										center: column.join(','),
										top: prevRow && prevRow.columns[index].join(','),
										bottom: nextRow && nextRow.columns[index].join(','),
										left: (index !== 0 && row.columns[index - 1].join(',')) || null,
										right:
											(index + 1 !== arr.length && row.columns[index + 1].join(',')) ||
											null,
									};

									const columnData =
										(palette &&
											palette.length > 0 &&
											palette.find(color => {
												if (!Array.isArray(color.original)) {
													return color.original === center;
												} else {
													return color.original.includes(center);
												}
											})) ||
										null;

									const isTopEq =
										columnData && isSameSquarePalette(top, columnData.original);
									const isBotEq =
										columnData && isSameSquarePalette(bottom, columnData.original);
									const isRightEq =
										columnData && isSameSquarePalette(right, columnData.original);
									const isLeftEq =
										columnData && isSameSquarePalette(left, columnData.original);

									const allBoxesAreEqual = isTopEq && isRightEq && isLeftEq && isBotEq;

									return (
										<Box
											key={column + index}
											backgroundColor={
												shouldColor
													? columnData &&
													  columnData.ral &&
													  columnData.ral.rgb &&
													  `rgb(${columnData.ral.rgb})`
													: 'white'
											}
											fontSize={`${squareSize * 2}px`}
											border={{
												top: !shouldColor && createBorder(isTopEq),
												right: !shouldColor && createBorder(isRightEq),
												bottom: !shouldColor && createBorder(isBotEq),
												left: !shouldColor && createBorder(isLeftEq),
											}}>
											{!shouldColor &&
												!allBoxesAreEqual &&
												columnData &&
												columnData.ral &&
												columnData.ral.code}
										</Box>
									);
								})}
							</Row>
						);
					})) || <div>Empty data</div>}
			</div>
		</ColorbookContainer>
	);
};

const Row = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: ${props => props.rowWidth};
	height: ${props => props.rowHeight};
`;

const Box = styled.div`
	display: inline-block;
	flex-grow: 1;
	height: 100%;
	width: 100%;
	overflow: hidden;
	white-space: none;
	text-align: center;
	color: ${props => props.textColor};
	font-size: ${props => props.fontSize};
	background-color: ${props => props.backgroundColor};
	border-top: ${props => props.border.top};
	border-right: ${props => props.border.right};
	border-bottom: ${props => props.border.bottom};
	border-left: ${props => props.border.left};
`;

const ColorbookContainer = styled.div`
	width: 100%;
	height: 100%;
	overflow: auto;
	position: relative;
	.colorbook {
		position: absolute;
		border: 2px solid black;
	}
`;

export default Colorbook;

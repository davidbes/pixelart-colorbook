import React from 'react';
import styled from 'styled-components';

const ToggleColor = ({ toggle, updateToggle }) => (
	<ToggleButton toggled={toggle}>
		<div className='toggler' onClick={() => updateToggle(!toggle)}>
			<div className='switch' />
			<div className='txt'>
				<span className={toggle ? 'blue' : 'white'}>EMPTY</span>
				<span className={toggle ? 'white' : 'blue'}>FILLED</span>
			</div>
		</div>
	</ToggleButton>
);

export default ToggleColor;

const ToggleButton = styled.div`
	position: relative;
	height: 100%;
	width: 100%;

	.toggler {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 150px;
		height: 45px;
		cursor: pointer;
		border: 1px solid #204051;
		border-radius: 5px;
	}

	.switch {
		position: absolute;
		left: 0;
		top: 0;
		width: 50%;
		height: 100%;
		background: #204051;
		transition: 0.2s;
		transform: ${props => (props.toggled ? 'translateX(100%)' : '')};
		border-radius: ${props => (props.toggled ? '0 5px 5px 0 ' : '5px 0 0 5px')};
	}

	.txt {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: transparent;
		display: flex;
		justify-content: space-between;
		align-items: center;

		span {
			text-align: center;
			padding: 10px;
		}
	}

	.white {
		color: #e4e3e3;
		transition: color 0.2s;
		font-weight: bold;
	}

	.blue {
		transition: color 0.2s;
		color: #204051;
	}
`;

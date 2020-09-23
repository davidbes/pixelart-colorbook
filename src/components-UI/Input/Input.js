import React from 'react';
import './Input.scss';

export const Input = ({ title, subTitle, onChange, name, value }) => {
	return (
		<div className='col'>
			{title && <div className='col-title'>{title}</div>}
			<input name={name} type='number' value={value} onChange={onChange} />
			{subTitle && <div className='col-title'>{subTitle}</div>}
		</div>
	);
};

export default Input;

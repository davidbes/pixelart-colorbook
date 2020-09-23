import React, { useState, useEffect, useRef } from 'react';
import './Select.scss';

const useOutsideClick = (ref, callback) => {
	const handleClick = e => {
		if (ref.current && !ref.current.contains(e.target)) {
			callback();
		}
	};

	useEffect(() => {
		document.addEventListener('click', handleClick);

		return () => {
			document.removeEventListener('click', handleClick);
		};
	});
};

const Select = ({ selected, options, returnSelectedOption }) => {
	const [selectedOption, setSelectedOption] = useState(selected);
	const [listOpened, setListOpened] = useState(false);

	const ref = useRef();

	useOutsideClick(ref, () => {
		if (listOpened) setListOpened(false);
	});

	useEffect(() => {
		returnSelectedOption(selectedOption);
	}, [selectedOption]);

	return (
		<div className='select'>
			<div>
				<div
					onClick={() => {
						setListOpened(true);
					}}
					className='box'>
					{selectedOption.key}
				</div>
				<div className='value'>{`${selectedOption.width} x ${selectedOption.height}`}</div>
				<div className='unit'>MM</div>
			</div>
			{listOpened && (
				<>
					<div className='options-list-arrow' />
					<div className='options-list' ref={ref}>
						<div className='options-title'>Paper Sizes</div>
						{options.map(option => {
							return (
								<div
									className={
										option.key === selectedOption.key ? 'option selected' : 'option'
									}
									key={option.key}
									onClick={() => {
										setSelectedOption(option);
										setListOpened(false);
									}}>{`${option.key} - ${option.width} x ${option.height} mm`}</div>
							);
						})}
					</div>
				</>
			)}
		</div>
	);
};

export default Select;

import React from 'react';
import './Instructions.scss';

const Introduction = ({}) => {
	return (
		<div className='instructions-wrapper'>
			<p>
				If you are looking for a creative gift this is the place for you. Just upload any image
				of your choice and we will pixelate it, extract dominant colors and create a color by
				number sheet. If you enjoy our service, consider donating or even becoming a patreon.
			</p>
			<p>Better features coming soon :)</p>
		</div>
	);
};

export default Introduction;

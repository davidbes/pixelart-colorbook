import React, { useState } from 'react';
import './sass/global.scss';
import { Card, Divider } from './components-UI';
import {
	Instructions,
	ImageSelectionAndSettings,
	GeneratedPaletteAndColorBook,
} from './components';

function App() {
	const [data, setData] = useState(null);

	return (
		<div className='body-background'>
			<Card>
				<h1 className='title'>Create pixel art from any image</h1>
				<Instructions></Instructions>
				<Divider />
				<ImageSelectionAndSettings saveData={setData} />
				<Divider />
				{data && <GeneratedPaletteAndColorBook data={data} />}
			</Card>
		</div>
	);
}

export default App;

import React, { useState, useCallback } from 'react';
import './sass/global.scss';
import { Card, Divider } from './components-UI';
import { Instructions, ImageSelectionAndSettings } from './components';

function App() {
	const [dataLoading, setDataLoading] = useState(false);

	const getImageDataSettings = useCallback(data => {
		setDataLoading(true);
		console.log(data);
	}, []);

	return (
		<div className='body-background'>
			<Card>
				<h1 className='title'>Create pixel art from any image</h1>
				<Instructions></Instructions>
				<Divider />
				<ImageSelectionAndSettings
					processInProgress={dataLoading}
					saveData={getImageDataSettings}
				/>
				<Divider />

				{/* Intro and instructions */}
				{/* Image upload and settings */}
				{/* Generate */}
			</Card>
		</div>
	);
}

export default App;

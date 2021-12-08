import React from 'react';
import './App.scss';
import LoadedContentWrapper from '../LoadedContentWrapper/LoadedContentWrapper';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	
	
	return (
		<div className="App">
			<div className="displayTest">
				<LoadedContentWrapper />
			</div>
		</div>
	);
}

export default App;

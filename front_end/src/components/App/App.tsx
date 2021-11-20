import React from 'react';
import './App.scss';
import ScaleDetailsFormPartial from '../ScaleDetailsFormPartial/ScaleDetailsFormPartial';

function App() {
	
	const dummyEmpty = (x:any)=>console.log("here");
	
	return (
	<div className="App">
		<div className="displayTest">
			<ScaleDetailsFormPartial 
				name="test" 
				setName={dummyEmpty} 
				usesTimespans={true}
				setUsesTimespans={dummyEmpty}
				dayCount={7}
				setDayCount={dummyEmpty} />
		</div>
	</div>
	);
}

export default App;

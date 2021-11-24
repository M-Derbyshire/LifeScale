import React from 'react';
import './App.scss';
import TimespanFormPartial from '../TimespanFormPartial/TimespanFormPartial';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	const date = new Date();
	
	
	return (
	<div className="App">
		<div className="displayTest">
			<TimespanFormPartial startTime={date} endTime={date} setStartTime={dummyEmpty} setEndTime={dummyEmpty} />
		</div>
	</div>
	);
}

export default App;

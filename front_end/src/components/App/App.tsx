import React from 'react';
import './App.scss';
import TimespanFormPartial from '../TimespanFormPartial/TimespanFormPartial';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	
	
	return (
		<div className="App">
			<div className="displayTest">
				<TimespanFormPartial minutes={120} setMinutes={dummyEmpty} />
			</div>
		</div>
	);
}

export default App;

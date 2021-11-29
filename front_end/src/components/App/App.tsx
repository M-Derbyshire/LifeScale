import React from 'react';
import './App.scss';
import ActionStatistic from '../ActionStatistic/ActionStatistic';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	
	
	return (
		<div className="App">
			<div className="displayTest">
				<ActionStatistic label="test label" percentage={25} />
			</div>
		</div>
	);
}

export default App;

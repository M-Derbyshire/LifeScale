import React from 'react';
import './App.scss';
import ScaleBalanceDisplay from '../ScaleBalanceDisplay/ScaleBalanceDisplay';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	
	
	return (
		<div className="App">
			<div className="displayTest">
				<ScaleBalanceDisplay scaleItems={[
					{ label: "test1", weight: 1, color: "red" },
					{ label: "test2", weight: 2, color: "blue" },
					{ label: "test3", weight: 3, color: "green" },
				]} />
			</div>
		</div>
	);
}

export default App;

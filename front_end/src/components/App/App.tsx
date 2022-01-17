import React from 'react';
import './App.scss';
import ScalePrimaryDisplay from '../ScalePrimaryDisplay/ScalePrimaryDisplay';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	const dummySubmit = ()=>console.log("submitted");
	
	const balanceItems = [
		{ label: "test1", color: "red", weight: 1 },
		{ label: "test2", color: "blue", weight: 2 },
		{ label: "test3", color: "yellow", weight: 3 }
	];
	
	return (
		<div className="App">
			<ScalePrimaryDisplay 
				editScaleCallback={dummySubmit} 
				desiredBalanceItems={balanceItems} 
				currentBalanceItems={balanceItems} />
		</div>
	);
}

export default App;

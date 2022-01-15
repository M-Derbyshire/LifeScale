import React from 'react';
import './App.scss';
import ScaleStatisticDisplay from '../ScaleStatisticDisplay/ScaleStatisticDisplay';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	const dummySubmit = ()=>console.log("submitted");
	
	
	const statistics= [
		{ id:"test1", label: "test", percentage: 10, children: [
			{ label: "testChild1", percentage: 11, id: "testChild1" },
			{ label: "testChild2", percentage: 12, id: "testChild2" }
		]},
		{ id:"test2", label: "test", percentage: 10, children: [
			{ label: "testChild3", percentage: 11, id: "testChild3" },
			{ label: "testChild4", percentage: 12, id: "testChild4" }
		]}
	];
	
	return (
		<div className="App">
			<ScaleStatisticDisplay statistics={statistics} amendHistoryCallback={dummySubmit} />
		</div>
	);
}

export default App;

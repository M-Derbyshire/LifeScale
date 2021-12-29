import React from 'react';
import './App.scss';
import ActionHistoryItem from '../ActionHistoryItem/ActionHistoryItem';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	const dummySubmit = ()=>console.log("submitted");
	
	return (
		<div className="App">
			<ActionHistoryItem 
				categoryName="testCat" 
				actionName="actName" 
				timespan={{ date: new Date(), minuteCount: 60, id: "test" }}
				usesTimespan={true}
				deleteHandler={dummySubmit} />
		</div>
	);
}

export default App;

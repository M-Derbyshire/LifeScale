import React from 'react';
import './App.scss';
import RecordActionForm from '../RecordActionForm/RecordActionForm';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	const dummySubmit = ()=>console.log("submitted");
	
	const dummyCategories = [{id:"1", name:"1", color:"", desiredWeight:1, actions:[{id:"1", name:"1", weight:1, timespans:[]}, {id:"2", name:"1", weight:1, timespans:[]}]}, {id:"2", name:"2", color:"", desiredWeight:1, actions:[{id:"3", name:"1", weight:1, timespans:[]}, {id:"4", name:"1", weight:1, timespans:[]}]}];
	
	return (
		<div className="App">
			<RecordActionForm 
				categories={dummyCategories}
				selectedCategoryID={dummyCategories[1].id}
				setSelectedCategoryID={dummyEmpty}
				
				selectedActionID={dummyCategories[0].actions[0].id}
				setSelectedActionID={dummyEmpty}
				
				timespan={{id:"1", date: new Date(), minuteCount:1}}
				setTimespan={dummyEmpty}
				
				onSubmit={dummySubmit} />
		</div>
	);
}

export default App;

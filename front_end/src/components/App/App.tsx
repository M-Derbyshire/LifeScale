import React from 'react';
import './App.scss';
import RecordActionForm from '../RecordActionForm/RecordActionForm';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	const dummySubmit = ()=>console.log("submitted");
	
	
	return (
		<div className="App">
			<RecordActionForm 
				categories={[{id:"", name:"1", color:"", desiredWeight:1, actions:[]}, {id:"", name:"2", color:"", desiredWeight:1, actions:[]}]}
				selectedCategory={{id:"", name:"1", color:"", desiredWeight:1, actions:[]}}
				setSelectedCategory={dummyEmpty}
				
				actions={[{id:"", name:"1", weight:1, timespans:[]}, {id:"", name:"1", weight:1, timespans:[]}]}
				selectedAction={{id:"", name:"1", weight:1, timespans:[]}}
				setSelectedAction={dummyEmpty}
				
				timespan={{id:"1", date: new Date(), minuteCount:1}}
				setTimespan={dummyEmpty}
				
				onSubmit={dummySubmit} />
		</div>
	);
}

export default App;

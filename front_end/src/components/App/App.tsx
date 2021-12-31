import React from 'react';
import './App.scss';
import RecordActionForm from '../RecordActionForm/RecordActionForm';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	const dummySubmit = ()=>console.log("submitted");
	
	return (
		<div className="App">
			<RecordActionForm 
				categories={[{
					id:"klasjdja", 
					name:"1", 
					color:"red", 
					desiredWeight:1, 
					actions:[
						{id:"lksd", name:"1", weight:1, timespans:[]},
						{id:"sAS", name:"2", weight:2, timespans:[]},
						{id:"werwer", name:"3", weight:3, timespans:[]}
					]
				}]}
				selectedCategoryID={"klasjdja"}
				setSelectedCategoryID={dummyEmpty}
				
				selectedActionID="sAS"
				setSelectedActionID={dummyEmpty}
				
				usesTimespans={true}
				timespan={{ date: new Date("1970-01-01"), id: "test", minuteCount: 10 }}
				setTimespan={dummyEmpty}
				
				onSubmit={dummySubmit} />
		</div>
	);
}

export default App;

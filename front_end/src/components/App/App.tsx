import React from 'react';
import './App.scss';
import ScaleDetailsForm from '../ScaleDetailsForm/ScaleDetailsForm';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	const dummySubmit = ()=>console.log("submitted");
	
	return (
		<div className="App">
			<ScaleDetailsForm 
				scaleItem={{
					name: "testScale",
					setName: dummyEmpty,
					usesTimespans: true,
					setUsesTimespans: dummyEmpty,
					dayCount: 7,
					setDayCount: dummyEmpty,
					
					categories: [
						{
							id: "testcat1",
							name: "test cat 1",
							color: "red",
							desiredWeight: 1,
							actions: []
						},
						{
							id: "testcat2",
							name: "test cat 2",
							color: "red",
							desiredWeight: 1,
							actions: []
						}
					],
					
					onSubmit: dummySubmit,
					onDelete: dummySubmit,
					badSaveErrorMessage: "test bad save",
					goodSaveMessage: "test good save"
				}}
	
				headingText="test1"
				badLoadErrorMessage="test bad load"
				
				backButtonHandler={dummySubmit}
				disableSubmit={true} />
		</div>
	);
}

export default App;

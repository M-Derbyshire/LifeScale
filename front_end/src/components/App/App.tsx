import React from 'react';
import './App.scss';
import CategoryDetailsForm from '../CategoryDetailsForm/CategoryDetailsForm';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	const dummySubmit = ()=>console.log("submitted");
	
	return (
		<div className="App">
			<CategoryDetailsForm 
				categoryItem={{
					name: "Test category",
					setName: dummyEmpty,
					color: "Red",
					setColor: dummyEmpty,
					desiredWeight: 1,
					setDesiredWeight: dummyEmpty,
					
					newAction: {
						name: "test new act",
						setName: dummyEmpty,
						weight: 1,
						setWeight: dummyEmpty,
						onSubmit: dummySubmit,
						onDelete: dummySubmit,
						badSaveErrorMessage: "test bad save",
						goodSaveMessage: "test good save"
					},
					actions: [{
						name: "test act 1",
						setName: dummyEmpty,
						weight: 1,
						setWeight: dummyEmpty,
						onSubmit: dummySubmit,
						onDelete: dummySubmit,
						badSaveErrorMessage: "test bad save",
						goodSaveMessage: "test good save"
					}, {
						name: "test act 2",
						setName: dummyEmpty,
						weight: 1,
						setWeight: dummyEmpty,
						onSubmit: dummySubmit,
						onDelete: dummySubmit,
						badSaveErrorMessage: "test bad save",
						goodSaveMessage: "test good save"
					}],
					
					onSubmit: dummySubmit,
					onDelete: dummySubmit,
					badSaveErrorMessage: "Test bad save",
					goodSaveMessage: "Test good save"
				}}
	
				headingText={"test header"}
				
				backButtonHandler={dummySubmit}
				disableSubmit={true} />
		</div>
	);
}

export default App;

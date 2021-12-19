import React from 'react';
import './App.scss';
import UserDetailsForm from '../UserDetailsForm/UserDetailsForm';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	const dummySubmit = ()=>console.log("submitted");
	
	
	return (
		<div className="App">
			<UserDetailsForm 
				badLoadErrorMessage="test"
				setUser={dummyEmpty} onSubmit={dummySubmit} submitButtonText="Save" headingText="Edit User" />
		</div>
	);
}

export default App;

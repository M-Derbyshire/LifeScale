import React from 'react';
import './App.scss';
import UserDetailsForm from '../UserDetailsForm/UserDetailsForm';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	const dummySubmit = ()=>console.log("submitted");
	
	
	return (
		<div className="App">
			<UserDetailsForm 
				user={ {id:"test", email:"test@test.com", password:"test", forename:"test", surname: "test"} }
				setUser={dummyEmpty} onSubmit={dummySubmit} />
		</div>
	);
}

export default App;

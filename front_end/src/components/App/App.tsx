import React from 'react';
import './App.scss';
import CreateUserForm from '../CreateUserForm/CreateUserForm';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	const dummySubmit = ()=>console.log("submitted");
	
	
	return (
		<div className="App">
			<CreateUserForm 
				user={ {id:"test", email:"test@test.com", password:"test", forename:"test", surname: "test"} }
				setUser={dummyEmpty} onSubmit={dummySubmit} passwordIsConfirmed={true} setPasswordIsConfirmed={dummyEmpty} />
		</div>
	);
}

export default App;

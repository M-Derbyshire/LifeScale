import React from 'react';
import './App.scss';
import CreateUserForm from '../CreateUserForm/CreateUserForm';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	
	
	return (
		<div className="App">
			<CreateUserForm 
				user={ {id:"test", email:"test@test.com", password:"test", forename:"test", surname: "test"} }
				setUser={dummyEmpty} />
		</div>
	);
}

export default App;

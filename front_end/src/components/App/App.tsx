import React from 'react';
import './App.scss';
import RequestPasswordForm from '../RequestPasswordForm/RequestPasswordForm';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	const dummySubmit = ()=>console.log("submitted");
	
	return (
		<div className="App">
			<RequestPasswordForm 
				email="test@test.com"
				setEmail={dummyEmpty}
				onSubmit={dummySubmit} />
		</div>
	);
}

export default App;

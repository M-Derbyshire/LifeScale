import React from 'react';
import './App.scss';
import RequestPasswordForm from '../RequestPasswordForm/RequestPasswordForm';

function App() {
	
	const dummySetStrState = (x:string)=>console.log(x);
	
	return (
	<div className="App">
		<div className="displayTest">
			<RequestPasswordForm email="test@test.com" setEmail={dummySetStrState} onSubmit={()=>console.log("here")} />
		</div>
	</div>
	);
}

export default App;

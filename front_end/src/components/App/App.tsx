import React from 'react';
import './App.scss';
import RequestPasswordForm from '../RequestPasswordForm/RequestPasswordForm';

function App() {
	return (
	<div className="App">
		<div className="displayTest">
			<RequestPasswordForm email="test1@test.com" setEmail={(email:string)=>console.log("here")} onSubmit={()=>console.log("here")} />
		</div>
	</div>
	);
}

export default App;

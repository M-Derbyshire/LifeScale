import React from 'react';
import './App.scss';
import LoginForm from '../LoginForm/LoginForm';

function App() {
	return (
	<div className="App">
		<div className="displayTest">
			<LoginForm email="test1@test.com" password="password1" setEmail={(email:string)=>{}} setPassword={(password:string)=>{}} onSubmit={()=>console.log("here")} />
		</div>
	</div>
	);
}

export default App;

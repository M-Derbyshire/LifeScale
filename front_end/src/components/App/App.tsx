import React from 'react';
import './App.scss';
import LoginForm from '../LoginForm/LoginForm';

function App() {
	
	const dummySetStrState = (x:string)=>console.log(x);
	
	return (
	<div className="App">
		<div className="displayTest">
			<LoginForm email="test" setEmail={dummySetStrState} password="test" setPassword={dummySetStrState} onSubmit={()=>{}} />
		</div>
	</div>
	);
}

export default App;

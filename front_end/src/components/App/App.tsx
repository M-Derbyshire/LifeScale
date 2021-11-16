import React from 'react';
import './App.scss';
import PasswordFormPartial from '../PasswordFormPartial/PasswordFormPartial';

function App() {
	
	const dummySetStrState = (x:string)=>console.log(x);
	
	return (
	<div className="App">
		<div className="displayTest">
			<PasswordFormPartial password="test" setPassword={dummySetStrState} setPasswordIsConfirmed={(x:boolean)=>{}} />
		</div>
	</div>
	);
}

export default App;

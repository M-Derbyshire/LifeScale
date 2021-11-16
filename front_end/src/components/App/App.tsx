import React from 'react';
import './App.scss';
import UserDetailsFormPartial from '../UserDetailsFormPartial/UserDetailsFormPartial';

function App() {
	
	const dummySetStrState = (x:string)=>console.log(x);
	
	return (
	<div className="App">
		<div className="displayTest">
			<UserDetailsFormPartial email="email@email.com" setEmail={dummySetStrState} forename="testF" setForename={dummySetStrState} surname="testS" setSurname={dummySetStrState} />
		</div>
	</div>
	);
}

export default App;

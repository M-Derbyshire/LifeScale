import React from 'react';
import './App.scss';
import UserDetailsFormPartial from '../UserDetailsFormPartial/UserDetailsFormPartial';

function App() {
	
	const dummySetStrState = (x:string)=>console.log(x);
	
	return (
	<div className="App">
		<div className="displayTest">
			<UserDetailsFormPartial email="test@test.com" setEmail={dummySetStrState} forename="test@test.com" setForename={dummySetStrState} surname="test@test.com" setSurname={dummySetStrState} />
		</div>
	</div>
	);
}

export default App;

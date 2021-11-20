import React from 'react';
import './App.scss';
import ErrorMessageDisplay from '../ErrorMessageDisplay/ErrorMessageDisplay';

function App() {
	
	const dummyEmpty = (x:any)=>console.log("here");
	
	return (
	<div className="App">
		<div className="displayTest">
			<ErrorMessageDisplay message="Really long test error that happened ans was really bad and all and not reall that good and all that" />
		</div>
	</div>
	);
}

export default App;

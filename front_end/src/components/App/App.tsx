import React from 'react';
import './App.scss';
import CardDisplay from '../CardDisplay/CardDisplay';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	const dummySubmit = ()=>console.log("submitted");
	
	return (
		<div className="App">
			<CardDisplay emptyDisplayMessage="There are no categories created for this scale.">
			</CardDisplay>
		</div>
	);
}

export default App;

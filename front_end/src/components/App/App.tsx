import React from 'react';
import './App.scss';
import AddItemCard from '../AddItemCard/AddItemCard';

function App() {
	
	const dummyEmpty = ()=>console.log("here");
	
	return (
	<div className="App">
		<div className="displayTest">
			<AddItemCard onClick={dummyEmpty} />
		</div>
	</div>
	);
}

export default App;

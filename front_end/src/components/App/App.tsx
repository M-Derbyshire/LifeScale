import React from 'react';
import './App.scss';
import EditableItemCard from '../EditableItemCard/EditableItemCard';

function App() {
	
	const dummyEmpty = ()=>console.log("here");
	
	return (
	<div className="App">
		<div className="displayTest">
			<EditableItemCard name="test" editCallback={dummyEmpty} />
		</div>
	</div>
	);
}

export default App;

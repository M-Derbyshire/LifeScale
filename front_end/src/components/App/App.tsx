import React from 'react';
import './App.scss';
import BadSaveMessage from '../SaveMessage/BadSaveMessage';

function App() {
	return (
	<div className="App">
		<div className="displayTest">
			<BadSaveMessage message="test1" removeMessageCallback={()=>console.log("here")} />
		</div>
	</div>
	);
}

export default App;

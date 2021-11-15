import React from 'react';
import './App.scss';
import SaveMessage from '../SaveMessage/SaveMessage';

function App() {
	return (
	<div className="App">
		<div className="displayTest">
			<SaveMessage message="test1" removeMessageCallback={()=>console.log("here")} />
		</div>
	</div>
	);
}

export default App;

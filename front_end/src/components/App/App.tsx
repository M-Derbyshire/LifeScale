import React from 'react';
import './App.scss';
import GoodSaveMessage from '../SaveMessage/GoodSaveMessage';

function App() {
	return (
	<div className="App">
		<div className="displayTest">
			<GoodSaveMessage message="test1" removeMessageCallback={()=>console.log("here")} />
		</div>
	</div>
	);
}

export default App;

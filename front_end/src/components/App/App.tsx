import React from 'react';
import './App.scss';
import AmendActionHistoryPage from '../AmendActionHistoryPage/AmendActionHistoryPage';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	const dummySubmit = ()=>console.log("submitted");
	
	return (
		<div className="App">
			<AmendActionHistoryPage backButtonHandler={dummySubmit} scaleName="test" />
		</div>
	);
}

export default App;

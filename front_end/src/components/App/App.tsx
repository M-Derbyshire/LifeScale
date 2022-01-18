import React from 'react';
import './App.scss';
import DropdownContentBar from '../DropdownContentBar/DropdownContentBar';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	const dummySubmit = ()=>console.log("submitted");
	
	return (
		<div className="App">
			<DropdownContentBar>
				
			</DropdownContentBar>
		</div>
	);
}

export default App;

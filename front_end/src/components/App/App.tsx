import React from 'react';
import './App.scss';
import DropdownContentBar from '../DropdownContentBar/DropdownContentBar';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	const dummySubmit = ()=>console.log("submitted");
	
	return (
		<div className="App">
			<DropdownContentBar>
				<div>test1</div>
				<div>test2</div>
				<div>test3</div>
			</DropdownContentBar>
		</div>
	);
}

export default App;

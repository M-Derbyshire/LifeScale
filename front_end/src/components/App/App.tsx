import React from 'react';
import './App.scss';
import DropdownContentBar from '../DropdownContentBar/DropdownContentBar';
import UserNavBar from '../UserNavBar/UserNavBar';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	const dummySubmit = ()=>console.log("submitted");
	
	return (
		<div className="App">
			<DropdownContentBar>
				<UserNavBar scaleLinks={[]} editUserURL="/edit" logoutCallback={dummySubmit} createScaleURL="/create" />
			</DropdownContentBar>
		</div>
	);
}

export default App;

import React from 'react';
import './App.scss';
import UserNavBar from '../UserNavBar/UserNavBar';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	const dummySubmit = ()=>console.log("submitted");
	
	
	return (
		<div className="App">
			<UserNavBar scaleLinks={[{label:"test", url:"test"}]} editUserURL="/test" createScaleURL="/create" />
		</div>
	);
}

export default App;

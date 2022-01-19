import React from 'react';
import './App.scss';
import NavigatableContentWrapper from '../NavigatableContentWrapper/NavigatableContentWrapper';
import UserNavBar from '../UserNavBar/UserNavBar';
import ScaleStatisticDisplay from '../ScaleStatisticDisplay/ScaleStatisticDisplay';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	const dummySubmit = ()=>console.log("submitted");
	
	return (
		<div className="App">
			<NavigatableContentWrapper smallSreenWidthPixels={500} navigationBar={
				<UserNavBar scaleLinks={[]} editUserURL="/edit" logoutCallback={dummySubmit} createScaleURL="/create" />
			}>
				<ScaleStatisticDisplay amendHistoryCallback={dummySubmit} statistics={[]} />
			</NavigatableContentWrapper>
		</div>
	);
}

export default App;

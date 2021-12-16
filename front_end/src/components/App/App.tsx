import React from 'react';
import './App.scss';
import SingleActionForm from '../SingleActionForm/SingleActionForm';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	const dummySubmit = ()=>console.log("submitted");
	
	
	return (
		<div className="App">
			<SingleActionForm name={"test"} weight={1}
				setName={dummyEmpty} setWeight={dummyEmpty} onSubmit={dummySubmit} onDelete={dummySubmit} />
		</div>
	);
}

export default App;

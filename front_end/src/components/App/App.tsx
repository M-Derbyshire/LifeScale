import React from 'react';
import './App.scss';
import SingleActionForm from '../SingleActionForm/SingleActionForm';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	const dummySubmit = ()=>console.log("submitted");
	
	return (
		<div className="App">
			<SingleActionForm 
				name="test@test.com"
				setName={dummyEmpty}
				weight={1}
				setWeight={dummyEmpty}
				onSubmit={dummySubmit}
				onDelete={dummySubmit} />
		</div>
	);
}

export default App;

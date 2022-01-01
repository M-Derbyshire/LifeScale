import React from 'react';
import './App.scss';
import ActionsForm from '../ActionsForm/ActionsForm';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	const dummySubmit = ()=>console.log("submitted");
	
	return (
		<div className="App">
			<ActionsForm 
				actions={[{
					name: "test1",
					setName: dummyEmpty,
					weight: 2,
					setWeight: dummyEmpty,
					onSubmit: dummySubmit,
					onDelete: dummySubmit
				}, {
					name: "test2",
					setName: dummyEmpty,
					weight: 2,
					setWeight: dummyEmpty,
					onSubmit: dummySubmit,
					onDelete: dummySubmit
				}]}
				newAction={{
					name: "new",
					setName: dummyEmpty,
					weight: 2,
					setWeight: dummyEmpty,
					onSubmit: dummySubmit
				}} />
		</div>
	);
}

export default App;

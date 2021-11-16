import React from 'react';
import './App.scss';
import SingleActionForm from '../SingleActionForm/SingleActionForm';

function App() {
	
	const dummySetStrState = (x:string)=>console.log(x);
	const dummySetNumState = (x:number)=>console.log(x);
	
	return (
	<div className="App">
		<div className="displayTest">
			<SingleActionForm name="test" weight={1} setName={dummySetStrState} setWeight={dummySetNumState} onSubmit={()=>console.log("here")} />
		</div>
	</div>
	);
}

export default App;

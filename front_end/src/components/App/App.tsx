import React from 'react';
import './App.scss';
import CategoryDetailsFormPartial from '../CategoryDetailsFormPartial/CategoryDetailsFormPartial';

function App() {
	
	const dummySetStrState = (x:string)=>console.log(x);
	
	return (
	<div className="App">
		<div className="displayTest">
			<CategoryDetailsFormPartial name="test" setName={dummySetStrState} color="#000000" setColor={dummySetStrState} desiredWeight={1} setDesiredWeight={(x:number)=>{}} />
		</div>
	</div>
	);
}

export default App;

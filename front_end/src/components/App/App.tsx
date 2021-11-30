import React from 'react';
import './App.scss';
import ScalesNavList from '../ScalesNavList/ScalesNavList';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	
	
	return (
		<div className="App">
			<div className="displayTest">
				<ScalesNavList scaleLinks={[]} />
			</div>
		</div>
	);
}

export default App;

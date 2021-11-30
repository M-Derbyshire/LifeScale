import React from 'react';
import './App.scss';
import ScalesNavList from '../ScalesNavList/ScalesNavList';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	
	
	return (
		<div className="App">
			<div className="displayTest">
				<ScalesNavList scaleLinks={[
					{ label: "test1", url: "/test1" },
					{ label: "test2", url: "/test2" }
				]} />
			</div>
		</div>
	);
}

export default App;

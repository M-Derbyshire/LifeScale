import React from 'react';
import './App.scss';
import PasswordFormPartial from '../PasswordFormPartial/PasswordFormPartial';

function App() {
	return (
	<div className="App">
		<div className="displayTest">
			<PasswordFormPartial password="password" setPassword={(password)=>console.log(password)} />
		</div>
	</div>
	);
}

export default App;

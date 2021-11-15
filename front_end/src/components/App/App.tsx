import React, { useState } from 'react';
import './App.scss';
import PasswordFormPartial from '../PasswordFormPartial/PasswordFormPartial';

function App() {
	
	const [passwordState, setPassword] = useState("test");
	
	return (
	<div className="App">
		<div className="displayTest">
			<PasswordFormPartial password={passwordState} setPassword={setPassword} setPasswordIsConfirmed={(isConfirmed)=>console.log(isConfirmed)} />
		</div>
	</div>
	);
}

export default App;

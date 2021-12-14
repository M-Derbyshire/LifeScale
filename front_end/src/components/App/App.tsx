import React from 'react';
import './App.scss';
import LoginPage from '../LoginPage/LoginPage';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	
	
	return (
		<div className="App">
			<div className="displayTest">
				<LoginPage 
					email="test"
					password="test"
					setEmail={dummyEmpty}
					setPassword={dummyEmpty}
					loginHandler={() => dummyEmpty("none")}
					registerUserLinkPath="/register"
					forgotPasswordLinkPath="/forgot" />
			</div>
		</div>
	);
}

export default App;

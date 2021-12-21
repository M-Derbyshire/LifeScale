import React from 'react';
import './App.scss';
import UserDetailsForm from '../UserDetailsForm/UserDetailsForm';
import ChangePasswordFormPartial from '../ChangePasswordFormPartial/ChangePasswordFormPartial';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	const dummySubmit = ()=>console.log("submitted");
	
	
	return (
		<div className="App">
			<UserDetailsForm 
				user={ {id:"test", email:"test@test.com", password:"test", forename:"test", surname: "test"} }
				setUser={dummyEmpty} onSubmit={dummySubmit} submitButtonText="Save" headingText="Edit User"
				passwordForm={
					<ChangePasswordFormPartial 
						currentPassword="test" newPassword="test" newPasswordIsConfirmed={true} 
						setCurrentPassword={dummyEmpty} setNewPassword={dummyEmpty} 
						setNewPasswordIsConfirmed={dummyEmpty} />
				} />
		</div>
	);
}

export default App;

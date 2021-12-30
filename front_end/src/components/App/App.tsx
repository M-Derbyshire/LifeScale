import React from 'react';
import './App.scss';
import UserDetailsForm from '../UserDetailsForm/UserDetailsForm';
import ChangePasswordForm from '../ChangePasswordForm/ChangePasswordForm';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	const dummySubmit = ()=>console.log("submitted");
	
	return (
		<div className="App">
			<UserDetailsForm 
				setUser={dummyEmpty}
				user={{
					id:"hdaskjdakjsdkha",
					email:"test@test.com",
					forename:"test1",
					surname:"test2",
					scales:[]
				}}
				headingText="test"
				passwordForm={
					<ChangePasswordForm
						currentPassword="test"
						setCurrentPassword={dummyEmpty}
						newPassword="test"
						setNewPassword={dummyEmpty}
						setNewPasswordIsConfirmed={dummyEmpty}
						
						onSubmit={dummySubmit} />
				}
				onSubmit={dummySubmit}
				submitButtonText="Save" />
		</div>
	);
}

export default App;

import React, { FC, ReactElement } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.scss';
import UserHomeScreenLogicContainer from '../UserHomeScreen/UserHomeScreenLogicContainer';
import MockJSONServerUserService from '../../userServices/MockJSONServerUserService/MockJSONServerUserService';
import CategoryColorProvider from '../../utility_classes/CategoryColorProvider/CategoryColorProvider';
import LoginPageLogicContainer from '../LoginPage/LoginPageLogicContainer';

const userService = new MockJSONServerUserService(
	process.env.REACT_APP_API_PROTOCOL!,
	process.env.REACT_APP_API_DOMAIN!,
	process.env.REACT_APP_API_PORT!
);


//Call this, passing in a component at a route that requires auth, and you'll redirect if not logged in
const handlePrivateComponent = (element:ReactElement):ReactElement => {
	
	if(userService.isLoggedIn())
		return element;
	
	return <Navigate to="/login" />;
}



const App:FC = () => {
	
	return (
		<div className="App">
			
			<Routes>
				
				<Route 
					path="/login" 
					element={<LoginPageLogicContainer userService={userService} onSuccessfulLogin={()=>{}} registerPath="" forgotPasswordPath="" />} />
				
				
				
				<Route
					path="/user/edit"
					element={handlePrivateComponent(<div></div>)} />
				
				
					
				<Route
					path="/history"
					element={handlePrivateComponent(<div></div>)} />
				
				
					
				<Route
					path="/category/edit/:id"
					element={handlePrivateComponent(<div></div>)} />
				
				<Route
					path="/category/create"
					element={handlePrivateComponent(<div></div>)} />
				
				
				
				
				<Route
					path="/scale/edit/:id"
					element={handlePrivateComponent(<div></div>)} />
				
				<Route
					path="/scale/create"
					element={handlePrivateComponent(<div></div>)} />
				
				<Route
					path="/scale/:id"
					element={handlePrivateComponent(<div></div>)} />
				
				
				
				
				<Route
					path="/"
					element={handlePrivateComponent(<div></div>)} />
				
				<Route
					path="*"
					element={handlePrivateComponent(<Navigate to="/" />)} />
				
			</Routes>
		</div>
	);
}

export default App;

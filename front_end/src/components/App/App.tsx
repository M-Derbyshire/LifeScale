import React, { FC, ReactElement } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.scss';
import UserHomeScreenLogicContainer from '../UserHomeScreen/UserHomeScreenLogicContainer';
import MockJSONServerUserService from '../../userServices/MockJSONServerUserService/MockJSONServerUserService';
import CategoryColorProvider from '../../utility_classes/CategoryColorProvider/CategoryColorProvider';
import LoginPageLogicContainer from '../LoginPage/LoginPageLogicContainer';
import RequestPasswordPageLogicContainer from '../RequestPasswordPage/RequestPasswordPageLogicContainer';
import UserDetailsFormLogicContainer from '../UserDetailsForm/UserDetailsFormLogicContainer';

const userService = new MockJSONServerUserService(
	process.env.REACT_APP_API_PROTOCOL!,
	process.env.REACT_APP_API_DOMAIN!,
	process.env.REACT_APP_API_PORT!
);


//Returns a function that you call with a component that's at a route that requires auth. When that's called, if not logged in, user will
//be redirected to the login route that's provided
const getPrivateComponentHandler = (loginPageRoute:string) => (element:ReactElement):ReactElement => {
	
	if(userService.isLoggedIn())
		return element;
	
	return <Navigate to={loginPageRoute} />;
}



const App:FC = () => {
	
	const navigate = useNavigate();
	
	const loginPageRoute = "/login";
	const handlePrivateComponent = getPrivateComponentHandler(loginPageRoute);
	
	
	return (
		<div className="App">
			
			<Routes>
				
				<Route 
					path="/login" 
					element={<LoginPageLogicContainer 
									userService={userService} 
									onSuccessfulLogin={() => navigate("/")} 
									registerPath="/register" 
									forgotPasswordPath="/forgotpassword" />} />
				
				<Route 
					path="/forgotpassword" 
					element={<RequestPasswordPageLogicContainer userService={userService} backButtonHandler={() => navigate(loginPageRoute)} />} />
				
				<Route 
					path="/register" 
					element={<UserDetailsFormLogicContainer 
									userService={userService} 
									isNewUser={true}
									backButtonHandler={()=> navigate(loginPageRoute)} />} />
				
				
				
				
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
					element={handlePrivateComponent(<UserHomeScreenLogicContainer 
														userService={userService}
														selectedScaleID={""}
														scaleURLBase="scale"
														editUserURL="/"
														createScaleURL="/"
														onSuccessfulLogout={()=>{}}
														editScaleCallback={(scaleID:string)=>{}}
														amendHistoryCallback={(scaleID:string)=>{}}
														categoryColorProvider={new CategoryColorProvider()} />)} />
				
				<Route
					path="*"
					element={handlePrivateComponent(<Navigate to="/" />)} />
				
			</Routes>
		</div>
	);
}

export default App;

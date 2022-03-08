import React, { FC, ReactElement, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.scss';
import UserHomeScreenLogicContainer from '../UserHomeScreen/UserHomeScreenLogicContainer';
import MockJSONServerUserService from '../../userServices/MockJSONServerUserService/MockJSONServerUserService';
import CategoryColorProvider from '../../utility_classes/CategoryColorProvider/CategoryColorProvider';
import LoginPageLogicContainer from '../LoginPage/LoginPageLogicContainer';
import RequestPasswordPageLogicContainer from '../RequestPasswordPage/RequestPasswordPageLogicContainer';
import UserDetailsFormLogicContainer from '../UserDetailsForm/UserDetailsFormLogicContainer';
import IUserService from '../../interfaces/api_access/IUserService';



//Returns a function, that creates a function to redirect somewhere, based on the user's auth status.
//You can call the returned function with a component that's at a route that does/doesn't require auth. If user is/isnt logged in, they will
//then be redirected to the correct route. The given element will only be returned if the user has the correct auth status
const getRedirectHandler = (userService:IUserService, authIsRequired:boolean, redirectToRoute:string) => (element:ReactElement):ReactElement => {
	
	if(userService.isLoggedIn() === authIsRequired)
		return element;
	
	return <Navigate to={redirectToRoute} />;
}



const App:FC = () => {
	const navigate = useNavigate();
	
	//Need to use this as state, as if it's global its login status doesn't get reset after each test
	const [userService] = useState(new MockJSONServerUserService(
		process.env.REACT_APP_API_PROTOCOL!,
		process.env.REACT_APP_API_DOMAIN!,
		process.env.REACT_APP_API_PORT!
	));
	
	
	const loginPageRoute = "/login";
	const homePageRoute = "/";
	const handlePrivateComponent = getRedirectHandler(userService, true, loginPageRoute);
	const handleNoAuthComponent = getRedirectHandler(userService, false, homePageRoute);
	
	return (
		<div className="App">
			
			<Routes>
				
				<Route 
					path={loginPageRoute} 
					element={handleNoAuthComponent(<LoginPageLogicContainer 
									userService={userService} 
									onSuccessfulLogin={() => navigate("/")} 
									registerPath="/register" 
									forgotPasswordPath="/forgotpassword" />)} />
				
				<Route 
					path="/forgotpassword" 
					element={handleNoAuthComponent(<RequestPasswordPageLogicContainer 
									userService={userService} 
									backButtonHandler={() => navigate(loginPageRoute)} />)} />
				
				<Route 
					path="/register" 
					element={handleNoAuthComponent(<UserDetailsFormLogicContainer 
									userService={userService} 
									isNewUser={true}
									backButtonHandler={()=> navigate(loginPageRoute)} />)} />
				
				
				
				
				<Route
					path="/user/edit"
					element={handlePrivateComponent(<UserDetailsFormLogicContainer 
						userService={userService} 
						isNewUser={false}
						backButtonHandler={()=> navigate(homePageRoute)} />)} />
				
				
					
					
					
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
					path={homePageRoute}
					element={handlePrivateComponent(<UserHomeScreenLogicContainer 
														userService={userService}
														selectedScaleID={""}
														scaleURLBase="scale"
														editUserURL="/user/edit"
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

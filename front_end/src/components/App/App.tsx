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
import AmendActionHistoryPageLogicContainer from '../AmendActionHistoryPage/AmendActionHistoryPageLogicContainer';
import CategoryDetailsFormLogicContainer from '../CategoryDetailsForm/CategoryDetailsFormLogicContainer';
import ScaleDetailsFormLogicContainer from '../ScaleDetailsForm/ScaleDetailsFormLogicContainer';



//Returns a function that can be used to redirect somewhere, based on the user's auth status.
//You can call the returned function with a component that's at a route that does/doesn't require auth. If user is/isnt logged in, they will
//then be redirected to the correct route. The given element (element parameter) will only be returned if the user has the correct auth status, 
//otherwise the redirecting Navigate component will be returned.
const getRedirectHandler = (userService:IUserService, authIsRequired:boolean, redirectToRoute:string) => (element:ReactElement):ReactElement => {
	
	if(userService.isLoggedIn() === authIsRequired)
		return element;
	
	return <Navigate to={redirectToRoute} />;
}




/*
	Entry point for application (that being said, this needs to be wrapped in a router component, in the index.tsx file).
	
	This will handle the display of components, based on the current route. It will also handle the redirecting when a user is 
	at a route they shouldn't be on, based on their auth status.
*/
const App:FC = () => {
	
	const navigate = useNavigate();
	
	
	//Using this technique, instead of a hook in the individual components,
	//so the ID can be known here, and the individual screen components don't have to 
	//handle it (the logic container components are all class-based anyway, and I don't believe
	//this.props.match.params.* is valid anymore)
	const pathnameParams = window.location.pathname.split("/").filter(param => param !== ""); //May get empty string at start, so remove
	
	
	
	//Need to use this as state, as if it's global its login status doesn't get reset after each test
	const [userService] = useState(new MockJSONServerUserService(
		process.env.REACT_APP_API_PROTOCOL!,
		process.env.REACT_APP_API_DOMAIN!,
		process.env.REACT_APP_API_PORT!
	));
	
	
	const [categoryColorProvider] = useState(new CategoryColorProvider());
	
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
					path="/scale/history/:id"
					element={handlePrivateComponent(<AmendActionHistoryPageLogicContainer 
						scaleID={pathnameParams[2]}
						userService={userService}
						backButtonHandler={()=> navigate(`/scale/${pathnameParams[2]}`)} />)} />
				
				
				
				<Route
					path="/category/edit/:scaleid/:categoryid"
					element={handlePrivateComponent(<CategoryDetailsFormLogicContainer 
						scaleID={pathnameParams[2]}
						categoryID={pathnameParams[3]}
						userService={userService}
						onSuccessfulDeleteHandler={()=>navigate(`/scale/edit/${pathnameParams[2]}`)}
						backButtonHandler={()=>navigate(`/scale/edit/${pathnameParams[2]}`)}
						categoryColorProvider={categoryColorProvider} />)} />
				
				<Route
					path="/category/create/:scaleid"
					element={handlePrivateComponent(<CategoryDetailsFormLogicContainer 
						scaleID={pathnameParams[2]}
						userService={userService}
						onSuccessfulCreateHandler={()=>navigate(`/scale/edit/${pathnameParams[2]}`)}
						backButtonHandler={()=> navigate(`/scale/edit/${pathnameParams[2]}`)}
						categoryColorProvider={categoryColorProvider} />)} />
				
				
				
				
				
				<Route
					path="/scale/edit/:id"
					element={handlePrivateComponent(<ScaleDetailsFormLogicContainer 
						scaleID={pathnameParams[2]}
						userService={userService}
						backButtonHandler={()=>navigate(`/scale/${pathnameParams[2]}`)}
						editCategoryHandler={(categoryID:string)=>navigate(`/category/edit/${pathnameParams[2]}/${categoryID}`)}
						addCategoryHandler={() => navigate(`/category/create/${pathnameParams[2]}`)}
						onSuccessfulDeleteHandler={() => navigate(`/`)} />)} />
				
				<Route
					path="/scale/create"
					element={handlePrivateComponent(<ScaleDetailsFormLogicContainer 
						userService={userService}
						onSuccessfulCreateHandler={scaleID=>navigate(`/scale/${scaleID}`)}
						backButtonHandler={()=>navigate(`/`)}
						editCategoryHandler={(categoryID:string)=>navigate(`/category/edit/unknown/${categoryID}`)} //We won't display CardDisplay anyway
						addCategoryHandler={() => navigate(`/category/create/unknown`)}  />)} /> 
				
				<Route
					path="/scale/:id"
					element={handlePrivateComponent(<UserHomeScreenLogicContainer 
						userService={userService}
						selectedScaleID={pathnameParams[1]}
						scaleURLBase="scale"
						editUserURL="/user/edit"
						createScaleURL="/scale/create"
						onSuccessfulLogout={()=>navigate(loginPageRoute)}
						editScaleCallback={(scaleID:string)=>navigate(`/scale/edit/${scaleID}`)}
						amendHistoryCallback={(scaleID:string)=>navigate(`/scale/history/${scaleID}`)}
						categoryColorProvider={categoryColorProvider} />)} />
				
				
				
				
				
				
				<Route
					path={homePageRoute}
					element={handlePrivateComponent(<UserHomeScreenLogicContainer 
						userService={userService}
						selectedScaleID={undefined}
						scaleURLBase="scale"
						editUserURL="/user/edit"
						createScaleURL="/scale/create"
						onSuccessfulLogout={()=>navigate(loginPageRoute)}
						editScaleCallback={(scaleID:string)=>navigate(`/scale/edit/${scaleID}`)}
						amendHistoryCallback={(scaleID:string)=>navigate(`/scale/history/${scaleID}`)}
						categoryColorProvider={categoryColorProvider} />)} />
				
				<Route
					path="*"
					element={handlePrivateComponent(<Navigate to="/" />)} />
				
			</Routes>
		</div>
	);
}

export default App;

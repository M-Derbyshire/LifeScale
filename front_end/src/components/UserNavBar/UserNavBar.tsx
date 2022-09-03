import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import './UserNavBar.scss';
import IScaleLink from '../../interfaces/UI/IScaleLink';
import ScalesNavList from '../ScalesNavList/ScalesNavList';
import BadSaveMessage from '../SaveMessage/BadSaveMessage';

interface IUserNavBarProps {
	scaleLinks:IScaleLink[]; //The links to the user's scales
	editUserURL:string;
	createScaleURL:string;
	logoutCallback:()=>void;
	failedLogoutErrorMessage?:string;
}


/*
	The navigation bar. This provides links to edit the user's details, create new scales, and view current scales.
	If the scales list is still being loaded, the scaleLinks prop should be an empty array.
	
	See UserNavBarLogicContainer component.
*/
const UserNavBar:FC<IUserNavBarProps> = (props) => {
	
	
	return (
		<nav className="UserNavBar">
			
			<NavLink className="editUserLink stdLink" to={props.editUserURL}>Edit My Details</NavLink>
			
			<span className="userLogoutSpan stdLink" onClick={props.logoutCallback}>Logout</span>
			
			{props.failedLogoutErrorMessage && <BadSaveMessage message={props.failedLogoutErrorMessage} />}
			
			<hr/>
			
			<NavLink className="createScaleLink stdLink" to={props.createScaleURL}>Create New Scale</NavLink>
			
			<ScalesNavList scaleLinks={props.scaleLinks} />
			
		</nav>
	);
	
};

export default UserNavBar;
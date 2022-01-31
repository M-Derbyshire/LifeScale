import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import './UserNavBar.scss';
import IScaleLink from '../../interfaces/UI/IScaleLink';
import ScalesNavList from '../ScalesNavList/ScalesNavList';
import BadSaveMessage from '../SaveMessage/BadSaveMessage';

interface IUserNavBarProps {
	scaleLinks:IScaleLink[];
	editUserURL:string;
	createScaleURL:string;
	logoutCallback:()=>void;
	failedLogoutErrorMessage?:string;
}


/*
	Navigation, once logged into the app. This provides links to edit user details, create scales, and view 
	scales.
	
	If the scales list is still being loaded, the scaleLinks prop should be an empty array
*/
const UserNavBar:FC<IUserNavBarProps> = (props) => {
	
	
	return (
		<div className="UserNavBar">
			
			<NavLink className="editUserLink stdLink" to={props.editUserURL}>Edit My Details</NavLink>
			
			<span className="userLogoutSpan stdLink" onClick={props.logoutCallback}>Logout</span>
			
			{props.failedLogoutErrorMessage && <BadSaveMessage message={props.failedLogoutErrorMessage} />}
			
			<hr/>
			
			<NavLink className="createScaleLink stdLink" to={props.createScaleURL}>Create New Scale</NavLink>
			
			<ScalesNavList scaleLinks={props.scaleLinks} />
			
		</div>
	);
	
};

export default UserNavBar;
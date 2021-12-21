import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import './UserNavBar.scss';
import IScaleLink from '../../interfaces/UI/IScaleLink';
import ScalesNavList from '../ScalesNavList/ScalesNavList';

interface IUserNavBarProps {
	scaleLinks:IScaleLink[];
	editUserURL:string;
	createScaleURL:string;
}


/*
	Navigation, once logged into the app. This provides links to edit user details, create scales, and view 
	scales.
	
	If the scales list is still being loaded, the scaleLinks prop should be an empty array
*/
const UserNavBar:FC<IUserNavBarProps> = (props) => {
	
	
	return (
		<div className="UserNavBar">
			
			<Link className="editUserLink stdLink" to={props.editUserURL}>Edit My Details</Link>
			
			<hr/>
			
			<Link className="createScaleLink stdLink" to={props.createScaleURL}>Create New Scale</Link>
			
			<ScalesNavList scaleLinks={props.scaleLinks} />
			
		</div>
	);
	
};

export default UserNavBar;
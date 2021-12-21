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



const UserNavBar:FC<IUserNavBarProps> = (props) => {
	
	
	return (
		<div className="UserNavBar">
			
			<Link className="editUserLink" to={props.editUserURL}>Edit My Details</Link>
			
			<hr/>
			
			<Link className="createScaleLink" to={props.createScaleURL}>Create New Scale</Link>
			
			<ScalesNavList scaleLinks={props.scaleLinks} />
			
		</div>
	);
	
};

export default UserNavBar;
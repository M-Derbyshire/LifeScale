import React, { FC } from 'react';
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
			
			<ScalesNavList scaleLinks={props.scaleLinks} />
			
		</div>
	);
	
};

export default UserNavBar;
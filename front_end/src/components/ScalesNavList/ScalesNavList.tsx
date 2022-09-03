import React, { Component, ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import './ScalesNavList.scss';
import IScaleLink from '../../interfaces/UI/IScaleLink';

interface IScalesNavListProps {
	scaleLinks:IScaleLink[];
}

/*
	Takes an array of IScaleLink objects and creates a ul of react-router <NavLink> components.
	See the UserNavBar and UserNavBarLogicContainer components for usage/logic.
*/
class ScalesNavList extends Component<IScalesNavListProps> {
	
	// map IScaleLink to <li>, with <NavLink> in it
	mapScaleLinkToLi(scaleLink:IScaleLink):ReactElement
	{
		return (
			<li key={`${scaleLink.label}-${scaleLink.url}`}>
				<NavLink to={scaleLink.url}>{scaleLink.label}</NavLink>
			</li>
		);
	}
	
	
	render()
	{
		
		return (
			<div className="ScalesNavList">
				<ul>
					{this.props.scaleLinks.map(this.mapScaleLinkToLi)}
				</ul>
			</div>
		);
	}
	
}

export default ScalesNavList;
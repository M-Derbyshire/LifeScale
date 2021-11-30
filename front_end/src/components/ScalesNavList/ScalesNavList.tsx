import React, { Component, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import './ScalesNavList.scss';


interface IScaleLink {
	label:string;
	url:string;
}

interface IScalesNavListProps {
	scaleLinks:IScaleLink[];
}

/*
	Takes an array of IScaleLink objects (defined in this file) and creates a ul of react-router Links
*/
class ScalesNavList extends Component<IScalesNavListProps> {
	
	
	mapScaleLinkToLi(scaleLink:IScaleLink):ReactElement
	{
		return (
			<li key={`${scaleLink.label}-${scaleLink.url}`}>
				<Link to={scaleLink.url}>{scaleLink.label}</Link>
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
export type { IScaleLink };
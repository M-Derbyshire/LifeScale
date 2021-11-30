import React, { Component } from 'react';
import './ScalesNavList.scss';


interface IScaleLink {
	label:string;
	url:string;
}

interface IScalesNavListProps {
	scaleLinks:IScaleLink[];
}

class ScalesNavList extends Component<IScalesNavListProps> {
	
	
	
	render()
	{
		
		return (
			<div className="ScalesNavList">
				
			</div>
		);
	}
	
}

export default ScalesNavList;
export type { IScaleLink };
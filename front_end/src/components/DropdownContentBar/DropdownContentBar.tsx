import React, { FC, ReactChild, useState } from 'react';
import './DropdownContentBar.scss';
import { ReactComponent as ListIcon } from '../../icons/svg/list.svg';

interface IDropdownContentBarProps {
	children?: ReactChild | ReactChild[];
}

/*
	Displays a bar that will expand, as a drop-down, to display its children
*/
const DropdownContentBar:FC<IDropdownContentBarProps> = (props) => {
	
	const barExpanded = useState(false);
	
	return (
		<div className="DropdownContentBar">
			<div className="dropdownBarHead">
				<ListIcon/>
			</div>
		</div>
	);
	
};

export default DropdownContentBar;
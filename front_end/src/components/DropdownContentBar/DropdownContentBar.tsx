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
	
	const [barExpanded, setBarExpanded] = useState(false);
	const hiddenContentClass = "contentHidden";
	
	return (
		<div className="DropdownContentBar">
			
			<div className="dropdownBarHead">
				<ListIcon data-test="dropdownToggleIcon" onClick={() => setBarExpanded(!barExpanded)} />
			</div>
			
			<div className={`dropdownContent ${ (!barExpanded) ? hiddenContentClass : "" }`}>
				{props.children}
			</div>
			
		</div>
	);
	
};

export default DropdownContentBar;
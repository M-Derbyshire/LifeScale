import React, { FC, ReactChild, useState } from 'react';
import './DropdownContentBar.scss';
import { ReactComponent as ListIcon } from '../../icons/svg/list.svg';

interface IDropdownContentBarProps {
	children?: ReactChild | ReactChild[];
}


const DropdownContentBar:FC<IDropdownContentBarProps> = (props) => {
	
	const barExpanded = useState(false);
	
	return (
		<div className="DropdownContentBar">
			
		</div>
	);
	
};

export default DropdownContentBar;
import DropdownContentBar from './DropdownContentBar';
import { render, screen, fireEvent } from '@testing-library/react';

test("DropdownContentBar will render the given children", () => {
	
	render(<DropdownContentBar>
		<div>test1</div>
		<div>test2</div>
		<div>test3</div>
	</DropdownContentBar>);
	
	expect(screen.getByText("test1")).not.toBeNull();
	expect(screen.getByText("test2")).not.toBeNull();
	expect(screen.getByText("test3")).not.toBeNull();
	
});
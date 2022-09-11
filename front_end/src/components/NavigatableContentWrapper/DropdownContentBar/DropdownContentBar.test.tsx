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

test("DropdownContentBar will toggle the class of the content container, when the svg is clicked", () => {
	
	const hiddenClass = "contentHidden";
	const containerClass = "dropdownContent";
	
	const { container } = render(<DropdownContentBar>
		<div>test1</div>
	</DropdownContentBar>);
	
	const content = container.querySelector(`.${containerClass}`);
	
	expect(content.classList.contains(hiddenClass)).toBeTruthy();
	
	const icon = container.querySelector("svg");
	fireEvent.click(icon);
	
	expect(content.classList.contains(hiddenClass)).toBeFalsy();
	
	fireEvent.click(icon);
	
	expect(content.classList.contains(hiddenClass)).toBeTruthy();
	
});
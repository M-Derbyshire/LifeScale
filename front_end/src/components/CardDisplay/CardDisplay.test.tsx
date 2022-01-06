import CardDisplay from './CardDisplay';
import { render, screen } from '@testing-library/react';

test.each([
	["test1"],
	["test2"]
])("If no children are passed to CardDisplay, the given message will be displayed instead", (message) => {
	
	render(<CardDisplay emptyDisplayMessage={message} />);
	
	const messageDisplay = screen.getByText(message);
	
	expect(messageDisplay).not.toBeNull();
	
});

test("If children are passed to CardDisplay, an empty message will not be displayed", () => {
	
	const message = "test";
	
	render(<CardDisplay emptyDisplayMessage={message}>
		<div>test1</div>
		<div>test2</div>
	</CardDisplay>);
	
	const messageDisplays = screen.queryAllByText(message);
	
	expect(messageDisplays.length).toBe(0);
	
});
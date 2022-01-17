import EmptyContentMessage from './EmptyContentMessage';
import { render, screen } from '@testing-library/react';

test.each([
	["test1"],
	["test2"]
])("EmptyContentMessage will display the given message", (message) => {
	
	render(<EmptyContentMessage message={message} />);
	
	const messageDisplay = screen.getByText(message);
	
	expect(messageDisplay).not.toBeNull();
	
});
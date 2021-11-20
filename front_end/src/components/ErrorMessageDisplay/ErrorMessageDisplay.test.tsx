import ErrorMessageDisplay from './ErrorMessageDisplay';
import { render, screen } from '@testing-library/react';

test.each([
	["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur placerat vel eros nec aliquet. Maecenas ut ante turpis. Maecenas consectetur."],
	["Phasellus erat turpis, ornare in accumsan id, posuere nec est. Duis elementum orci ut auctor gravida. Interdum et malesuada fames."]
])("ErrorMessageDisplay display the provided message prop", (message) => {
	
	render(<ErrorMessageDisplay message={message} />);
	
	const messageDisplay = screen.getByText(message);
	
	expect(messageDisplay).not.toBeNull();
	
});
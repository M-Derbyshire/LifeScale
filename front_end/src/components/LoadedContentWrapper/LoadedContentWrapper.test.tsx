import LoadedContentWrapper from './LoadedContentWrapper';
import { render, fireEvent } from '@testing-library/react';

test.each([
	["test123"],
	["test456"],
	["test789"]
])("LoadedContentWrapper will render an ErrorMessageDisplay, with the given message, if passed an errorMessage prop", (message) => {
	
	const { container } = render(<LoadedContentWrapper errorMessage={message} />);
	
	const errorDisplay = container.querySelector(".ErrorMessageDisplay");
	
	expect(errorDisplay).not.toBeNull();
	expect(errorDisplay.textContent).toEqual(expect.stringContaining(message));
	
});

test("LoadedContentWrapper will render the given render prop, if given one", () => {
	
	
	const childClassName = "testChild";
	const { container } = render(<LoadedContentWrapper render={<div className={childClassName}>test</div>} />);
	
	const childElem = container.querySelector(`.${childClassName}`);
	
	expect(childElem).not.toBeNull();
	
});
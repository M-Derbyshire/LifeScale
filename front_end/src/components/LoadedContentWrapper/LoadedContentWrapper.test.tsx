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

test("LoadedContentWrapper will not render a 'currently loading' display, when passed an errorMessage prop", () => {
	
	const { container } = render(<LoadedContentWrapper errorMessage={"test"} />);
	
	const currentlyLoadingDisplay = container.querySelector(".currentlyLoadingDisplay");
	
	expect(currentlyLoadingDisplay).toBeNull();
	
});




test("LoadedContentWrapper will render the given render prop, if given one", () => {
	
	
	const childClassName = "testChild";
	const { container } = render(<LoadedContentWrapper render={<div className={childClassName}>test</div>} />);
	
	const childElem = container.querySelector(`.${childClassName}`);
	
	expect(childElem).not.toBeNull();
	
});

test("LoadedContentWrapper will not render a 'currently loading' display, when given a render prop", () => {
	
	const { container } = render(<LoadedContentWrapper render={<div>test</div>} />);
	
	const currentlyLoadingDisplay = container.querySelector(".currentlyLoadingDisplay");
	
	expect(currentlyLoadingDisplay).toBeNull();
	
});




test("LoadedContentWrapper will render the 'currently loading' display, if no props given", ()=> {
	
	const { container } = render(<LoadedContentWrapper />);
	
	const currentlyLoadingDisplay = container.querySelector(".currentlyLoadingDisplay");
	
	expect(currentlyLoadingDisplay).not.toBeNull();
	
});
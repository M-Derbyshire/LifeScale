import AmendActionHistoryPage from './AmendActionHistoryPage';
import { render, fireEvent } from '@testing-library/react';

const dummyBackButtonHandler = ()=>{};

test.each([
	["test1"],
	["test2"]
])("AmendActionHistoryPage will pass the loading error message to LoadedContentWrapper to be displayed", (message) => {
	
	const { container } = render(<AmendActionHistoryPage 
									backButtonHandler={dummyBackButtonHandler} 
									loadingError={message} />);
	
	const contentWrapper = container.querySelector(".LoadedContentWrapper");
	
	expect(contentWrapper).not.toBeNull();
	expect(contentWrapper.textContent).toEqual(expect.stringContaining(message));
	
});

test.each([
	["test1"],
	["test2"]
])("AmendActionHistoryPage will display the scaleName prop in a header", (name) => {
	
	const { container } = render(<AmendActionHistoryPage 
									backButtonHandler={dummyBackButtonHandler} 
									scaleName={name} />);
	
	const heading = container.querySelector("h1");
	
	expect(heading).not.toBeNull();
	expect(heading.textContent).toEqual(expect.stringContaining(name));
	
});



test("AmendActionHistoryPage will call the backButtonHandler prop when back button is clicked", () => {
	
	const mockBackHandler = jest.fn();
	const { container } = render(<AmendActionHistoryPage backButtonHandler={mockBackHandler} />);
	
	const backButton = container.querySelector(".actionHistoryBackButton");
	fireEvent.click(backButton);
	
	expect(mockBackHandler).toHaveBeenCalled();
	
});
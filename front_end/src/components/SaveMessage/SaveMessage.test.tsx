import React from 'react';
import SaveMessage from './SaveMessage';
import { render, fireEvent } from '@testing-library/react';

const dummyOnCloseCB = ()=>{};

test.each([
	["message1"],
	["message2"]
])("SaveMessage will display the provided message", (messageText) => {
	
	const { container } = render(<SaveMessage message={messageText} removeMessageCallback={dummyOnCloseCB} />);
	
	const msg = container.querySelector(".message");
	
	expect(msg).not.toBeNull();
	expect(msg.textContent).toEqual(messageText);
	
});

test("SaveMessage close button will call the given removeMessageCallback when clicked", () => {
	
	const mockCB = jest.fn();
	
	const { container } = render(<SaveMessage message="test" removeMessageCallback={mockCB} />);
	
	const close = container.querySelector(".close");
	
	expect(close).not.toBeNull();
	
	fireEvent.click(close);
	
	expect(mockCB).toHaveBeenCalled();
});
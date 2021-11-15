import React from 'react';
import SaveMessage from './SaveMessage';
import GoodSaveMessage from './GoodSaveMessage';
import BadSaveMessage from './BadSaveMessage';
import { render } from '@testing-library/react';

test.each([
	[GoodSaveMessage],
	[BadSaveMessage]
])("Subclasses will inherit from SaveMessage", (Sub) => {
	
	expect(SaveMessage.isPrototypeOf(Sub)).toBeTruthy();
	
});

test.each([
	[GoodSaveMessage],
	[BadSaveMessage]
])("Subclasses will use render method from SaveMessage", (Sub) => {
	
	expect(Sub.prototype.render).toEqual(SaveMessage.prototype.render);
	
});

test.each([
	[GoodSaveMessage, "GoodSaveMessage"],
	[BadSaveMessage, "BadSaveMessage"]
])("Subclasses will have the correct className, as well as SaveMessage", (Sub, name) => {
	
	const { container } = render(<Sub message="test" />);
	
	const saveMessage = container.firstChild;
	
	expect(saveMessage).toHaveClass(".SaveMessage");
	expect(saveMessage).toHaveClass(`.${name}`);
	
});
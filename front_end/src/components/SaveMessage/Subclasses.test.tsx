import React from 'react';
import SaveMessage from './SaveMessage';
import GoodSaveMessage from './GoodSaveMessage';

test.each([
	[GoodSaveMessage]
])("Subclasses will inherit from SaveMessage", (Sub) => {
	
	expect(SaveMessage.isPrototypeOf(Sub)).toBeTruthy();
	
});

test.each([
	[GoodSaveMessage]
])("Subclasses will use render method from SaveMessage", (Sub) => {
	
	expect(Sub.prototype.render).toEqual(SaveMessage.prototype.render);
	
});
import ActionHistoryItem from './ActionHistoryItem';
import { render, fireEvent } from '@testing-library/react';

const dummyDeleteHandler = () => {};
const dummyTimespan = { date: new Date(), minuteCount: 60, id: "test" };
const dummyAction = {
	categoryName: "test",
	actionName: "test",
	timespan: dummyTimespan,
	deleteHandler: dummyDeleteHandler
};

test.each([
	["test1"],
	["test2"]
])("ActionHistoryItem will display the given categoryName", (catName) => {
	
	const { container } = render(<ActionHistoryItem
									actionHistoryItem={{...dummyAction, categoryName: catName}} />);
	
	const categoryDisplay = container.querySelector(".itemCategoryNameDisplay");
	
	expect(categoryDisplay.textContent).toEqual(expect.stringContaining(catName));
	
});


test.each([
	["test1"],
	["test2"]
])("ActionHistoryItem will display the given actionName", (actName) => {
	
	const { container } = render(<ActionHistoryItem
									actionHistoryItem={{...dummyAction, actionName: actName}} />);
	
	const actionDisplay = container.querySelector(".itemActionNameDisplay");
	
	expect(actionDisplay.textContent).toEqual(expect.stringContaining(actName));
	
});


test.each([
	["1/1/2021", "1/1/2021"], //These are in the date format that should be displayed
	["12/29/2021", "29/12/2021"]
])("ActionHistoryItem will display the given timespan date in the right format", (dateIn, dateDisplayed) => {
	
	const { container } = render(<ActionHistoryItem
									actionHistoryItem={
										{...dummyAction, timespan: { ...dummyTimespan, date: new Date(dateIn) } }
									} />);
	
	const dateDisplay = container.querySelector(".itemDateDisplay");
	
	expect(dateDisplay.textContent).toEqual(expect.stringContaining(dateDisplayed));
	
});



test.each([
	[undefined],
	[false]
])("If usesTimespan prop is false or undefined, the minute/hour displays will not be displayed", (usesTimespan) => {
	
	const { container } = render(<ActionHistoryItem actionHistoryItem={dummyAction} />);
	
	const minuteDisplay = container.querySelector(".itemMinutesDisplay");
	expect(minuteDisplay).toBeNull();
	
	const hourDisplay = container.querySelector(".itemHoursDisplay");
	expect(hourDisplay).toBeNull();
	
});

test("If usesTimespan prop is true, the minute/hour displays will be displayed", () => {
	
	const { container } = render(<ActionHistoryItem
									actionHistoryItem={dummyAction}
									usesTimespan={true} />);
	
	const minuteDisplay = container.querySelector(".itemMinutesDisplay");
	expect(minuteDisplay).not.toBeNull();
	
	const hourDisplay = container.querySelector(".itemHoursDisplay");
	expect(hourDisplay).not.toBeNull();
	
});

test.each([
	[1],
	[60]
])("If usesTimespan prop is true, the minute count will be will be displayed", (minCount) => {
	
	const { container } = render(<ActionHistoryItem
									actionHistoryItem={
										{...dummyAction, timespan: { ...dummyTimespan, minuteCount: minCount } }
									}
									usesTimespan={true} />);
	
	const minuteDisplay = container.querySelector(".itemMinutesDisplay");
	
	expect(minuteDisplay.textContent).toEqual(expect.stringContaining(minCount.toString()));
	
});

test.each([
	[1],
	[2.5],
	[2.555]
])("If usesTimespan prop is true, the hour count will be will be displayed (rounded to 2 decimal places)", (hourCount) => {
	
	const { container } = render(<ActionHistoryItem
									actionHistoryItem={
										{...dummyAction, timespan: { ...dummyTimespan, minuteCount: hourCount * 60 } }
									}
									usesTimespan={true} />);
	
	const hourDisplay = container.querySelector(".itemHoursDisplay");
	
	expect(hourDisplay.textContent).toEqual(expect.stringContaining(hourCount.toFixed(2)));
	
});



test("ActionHistoryItem delete button will call the given deleteHandler", () => {
	
	const mockDeleteHandler = jest.fn();
	
	const { container } = render(<ActionHistoryItem
									actionHistoryItem={{...dummyAction, deleteHandler: mockDeleteHandler}} />);
	
	const deleteButton = container.querySelector("button");
	fireEvent.click(deleteButton);
	
	expect(mockDeleteHandler).toHaveBeenCalled();
	
});



test.each([
	["test1"],
	["test2"]
])("ActionHistoryItem will display a BadSaveMessage with the given delete error text, if passed that value in the actionHistoryItem prop", (message) => {
	
	const { container } = render(<ActionHistoryItem
									actionHistoryItem={{...dummyAction, deleteErrorMessage: message}} />);
	
	const errorMessageDisplay = container.querySelector(".BadSaveMessage");
	expect(errorMessageDisplay).not.toBeNull();
	expect(errorMessageDisplay.textContent).toEqual(expect.stringContaining(message));
	
});
import AmendActionHistoryPage from './AmendActionHistoryPage';
import { render, fireEvent } from '@testing-library/react';

const dummyBackButtonHandler = ()=>{};

const dummyDeleteHandler = () => {};
const dummyTimespan = { date: new Date(), minuteCount: 60, id: "test" };
const dummyAction = {
	id: "test-act1",
	categoryName: "test",
	actionName: "test",
	timespan: dummyTimespan,
	deleteHandler: dummyDeleteHandler
};

const dummyItems = [
	{ ...dummyAction, categoryName: "test-item1", timespan: { ...dummyTimespan, id: "test1" } },
	{ ...dummyAction, categoryName: "test-item2", timespan: { ...dummyTimespan, id: "test2" }  }
];

const dummyNewRecordedAction = {
	categories: [{
		id: "test-cat1",
		name:"test cat",
		color:"red",
		desiredWeight:1,
		actions:[dummyAction]
	}],
	selectedCategoryID:"test-cat1",
	setSelectedCategoryID:(category:string)=>{},
	
	selectedActionID: dummyAction.id,
	setSelectedActionID:(action:string)=>{},
	
	timespan: dummyTimespan,
	setTimespan:(timespan:ITimespan)=>{},
	
	onSubmit:()=>{}
};




test.each([
	["test1"],
	["test2"]
])("AmendActionHistoryPage will pass the loading error message to LoadedContentWrapper to be displayed", (message) => {
	
	const { container } = render(<AmendActionHistoryPage 
									backButtonHandler={dummyBackButtonHandler} 
									loadingError={message}
									newRecordedAction={dummyNewRecordedAction} />);
	
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
									scaleName={name}
									newRecordedAction={dummyNewRecordedAction} />);
	
	const heading = container.querySelector("h1");
	
	expect(heading).not.toBeNull();
	expect(heading.textContent).toEqual(expect.stringContaining(name));
	
});



test("AmendActionHistoryPage will call the backButtonHandler prop when back button is clicked", () => {
	
	const mockBackHandler = jest.fn();
	const { container } = render(<AmendActionHistoryPage 
									backButtonHandler={mockBackHandler}
									newRecordedAction={dummyNewRecordedAction} />);
	
	const backButton = container.querySelector(".actionHistoryBackButton");
	fireEvent.click(backButton);
	
	expect(mockBackHandler).toHaveBeenCalled();
	
});

test("AmendActionHistoryPage will list the given items as ActionHistoryItem components", () => {
	
	const { container } = render(<AmendActionHistoryPage 
									backButtonHandler={dummyBackButtonHandler}
									items={dummyItems}
									newRecordedAction={dummyNewRecordedAction} />);
	
	const historyItems = container.querySelectorAll(".ActionHistoryItem");
	
	expect(historyItems.length).not.toBe(0);
	
	historyItems.forEach(
		(item, i) => expect(item.textContent).toEqual(expect.stringContaining(dummyItems[i].categoryName))
	);
	
});

test.each([
	[undefined],
	[false],
	[true]
])("AmendActionHistoryPage will pass on the scaleUsesTimespans prop to ActionHistoryItem components", (isUsed) => {
	
	const { container } = render(<AmendActionHistoryPage 
									backButtonHandler={dummyBackButtonHandler}
									items={dummyItems}
									scaleUsesTimespans={isUsed}
									newRecordedAction={dummyNewRecordedAction} />);
	
	const historyItems = container.querySelectorAll(".ActionHistoryItem");
	
	expect(historyItems.length).not.toBe(0);
	
	historyItems.forEach(
		(item, i) => {
			if (!!isUsed) 
				expect(item.textContent).toEqual(expect.stringContaining(dummyItems[i].timespan.minuteCount.toString()))
			else
				expect(item.textContent).not.toEqual(expect.stringContaining(dummyItems[i].timespan.minuteCount.toString()))
		}
	);
	
});

test("AmendActionHistoryPage will display a message if items is empty", () => {
	
	const { container } = render(<AmendActionHistoryPage 
									backButtonHandler={dummyBackButtonHandler}
									items={[]}
									newRecordedAction={dummyNewRecordedAction} />);
	
	const messageDisplay = container.querySelector(".noHistoryItemsMessage");
	
	expect(messageDisplay).not.toBeNull();
});
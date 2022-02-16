import AmendActionHistoryPageLogicContainer from './AmendActionHistoryPageLogicContainer';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import TestingDummyUserService from '../../userServices/TestingDummyUserService/TestingDummyUserService';



const dummyScale = {
	id: "testScale1",
	name: "testScale",
	usesTimespans: true,
	displayDayCount: 7,
	categories: [{
		id: "testCat23132948284",
		name: "testcat",
		color: "red",
		desiredWeight: 1,
		actions: [{
			id: "testact3298294848",
			name: "testAct",
			weight: 1,
			timespans: [ //These are purposefully added in date order, with years increasing
				{
					id: "testTS427347289374",
					date: new Date("2021-01-01"),
					minuteCount: 60
				},
				{
					id: "testTS8527482374287",
					date: new Date("2022-01-01"),
					minuteCount: 60
				},
				{
					id: "testTS2394890384",
					date: new Date("2023-01-01"),
					minuteCount: 60
				}
			]
		}]
	}]
};


const dummyUserService = new TestingDummyUserService();
dummyUserService.getScale = scaleID => dummyScale;
dummyUserService.getScaleTimespans = 
	(scale, reverseOrder) => dummyScale.categories[0].actions[0].timespans.map((timespan) => {
		return { timespan, category: dummyScale.categories[0], action: dummyScale.categories[0].actions[0] };
	}).sort((a, b) => {
		
		const aDate = a.timespan.date.getTime();
		const bDate = b.timespan.date.getTime();
		
		if(reverseOrder) 
			return bDate - aDate;
		else
			return aDate - bDate;
	});


test("AmendActionHistoryPageLogicContainer will render an AmendActionHistoryPage, and pass in the scale and userService", () => {
	
	const mockUserService = { ...dummyUserService };
	mockUserService.createTimespan = jest.fn().mockResolvedValue(dummyScale.categories[0].actions[0].timespans[0]);
	mockUserService.getAction = jest.fn().mockResolvedValue(dummyScale.categories[0].actions[0]);
	mockUserService.getCategory = jest.fn().mockResolvedValue(dummyScale.categories[0]);
	
	const { container } = render(<AmendActionHistoryPageLogicContainer
									scaleID={dummyScale.id}
									userService={mockUserService}
									backButtonHandler={()=>{}} />);
	
	expect(container.querySelector(".AmendActionHistoryPage")).not.toBeNull();
	
	//Is the scale data properly loaded
	const firstCatergoryID = dummyScale.categories[0].id;
	const firstActionID = dummyScale.categories[0].actions[0].id;
	const recordFormSelects = container.querySelectorAll(".RecordActionForm select");
	expect(
		recordFormSelects[0].value === firstCatergoryID || recordFormSelects[0].value === firstActionID
	).toBeTruthy();
	
	
	const recordForm = container.querySelector(".RecordActionForm form");
	fireEvent.submit(recordForm);
	
	expect(mockUserService.createTimespan).toHaveBeenCalled();
	
});

test("AmendActionHistoryPageLogicContainer will pass in a loading error, if issues finding the scale", () => {
	
	const message = "Unable to find the selected scale.";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.getScale = () => undefined;
	
	const { container } = render(<AmendActionHistoryPageLogicContainer
									scaleID={dummyScale.id}
									userService={mockUserService}
									backButtonHandler={()=>{}} />);
	
	const historyPage = container.querySelector(".AmendActionHistoryPage");
	expect(historyPage.textContent).toEqual(expect.stringContaining(message));
	
});


test("AmendActionHistoryPageLogicContainer will pass through the back button handler", () => {
	
	const mockBackHandler = jest.fn();
	
	const { container } = render(<AmendActionHistoryPageLogicContainer
									scaleID={dummyScale.id}
									userService={dummyUserService}
									backButtonHandler={mockBackHandler} />);
	
	const backButton = screen.getByRole("button", { name: /back/i });
	fireEvent.click(backButton);
	
	expect(mockBackHandler).toHaveBeenCalled();
	
});



test("AmendActionHistoryPageLogicContainer will load the history items in reverse order, and pass through", () => {
	
	const { container } = render(<AmendActionHistoryPageLogicContainer
									scaleID={dummyScale.id}
									userService={dummyUserService}
									backButtonHandler={()=>{}} />);
	
	const items = container.querySelectorAll(".AmendActionHistoryPage .ActionHistoryItem");
	const timespans = dummyScale.categories[0].actions[0].timespans;
	
	//These, if reversed, should be in the opposite order of how the timespans are listed
	//(as dates are potentially formatted in different ways, we have to use the year for this)
	expect(items[0].textContent).toEqual(expect.stringContaining(timespans[2].date.getFullYear().toString()));
	expect(items[1].textContent).toEqual(expect.stringContaining(timespans[1].date.getFullYear().toString()));
	expect(items[2].textContent).toEqual(expect.stringContaining(timespans[0].date.getFullYear().toString()));
	
});

test("AmendActionHistoryPageLogicContainer will pass in an error if issue loading history items", () => {
	
	const message = "Unable to load the timescales for the selected scale.";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.getScale = scaleID => dummyScale;
	mockUserService.getScaleTimespans = (scale, reverseOrder) => undefined;
	
	const { container } = render(<AmendActionHistoryPageLogicContainer
									scaleID={dummyScale.id}
									userService={mockUserService}
									backButtonHandler={()=>{}} />);
	
	const historyPage = container.querySelector(".AmendActionHistoryPage");
	expect(historyPage.textContent).toEqual(expect.stringContaining(message));
	
});


//will update item list on create
test("AmendActionHistoryPageLogicContainer will update the list of history items, after creating one", async () => {
	
	const mockUserService = { ...dummyUserService };
	
	//Old date, so comes first in refreshed list (our mock will only return in ascending order)
	const timespanToCreate = {
		id: "testidnew",
		date: new Date("1971-01-02"), 
		minuteCount: 1
	};
	
	mockUserService.createTimespan = jest.fn().mockResolvedValue(timespanToCreate);
	mockUserService.getAction = jest.fn().mockResolvedValue(dummyScale.categories[0].actions[0]);
	mockUserService.getCategory = jest.fn().mockResolvedValue(dummyScale.categories[0]);
	
	const { container } = render(<AmendActionHistoryPageLogicContainer
									scaleID={dummyScale.id}
									userService={mockUserService}
									backButtonHandler={()=>{}} />);
	
	const originalHistoryItems = container.querySelectorAll(".AmendActionHistoryPage .ActionHistoryItem");
	expect(originalHistoryItems[0].textContent)
		.not.toEqual(expect.stringContaining(timespanToCreate.date.getFullYear().toString()));
	
	
	//Just changing the return value of getScaleTimespans, to include the new one
	//We'll change this to only sort in ascending order as well, so we know our new one is first
	const currentScaleTSResult = mockUserService.getScaleTimespans(dummyScale, false);
	mockUserService.getScaleTimespans = 
		(scale, reverseOrder) => [
				...currentScaleTSResult.map(tsDetails => tsDetails.timespan), //Whatever we're already returning
				timespanToCreate
			].map((timespan) => {
			return { timespan, category: dummyScale.categories[0], action: dummyScale.categories[0].actions[0] };
		}).sort((a, b) => {
			const aDate = a.timespan.date.getTime();
			const bDate = b.timespan.date.getTime();
			return aDate - bDate;
		});
	
	
	//Trigger a save (doesn't matter about the actual data, as we're mocking it in the return)
	const recordForm = container.querySelector(".RecordActionForm form");
	fireEvent.submit(recordForm);
	
	await waitFor(() => {
		const newHistoryItems = container.querySelectorAll(".AmendActionHistoryPage .ActionHistoryItem");
		
		expect(newHistoryItems[0].textContent)
			.toEqual(expect.stringContaining(timespanToCreate.date.getFullYear().toString()));
	});
	
	
});



test("AmendActionHistoryPageLogicContainer will pass through delete handlers for history items, and update the list on delete", async () => {
	
	const mockUserService = { ...dummyUserService };
	mockUserService.getAction = jest.fn().mockResolvedValue(dummyScale.categories[0].actions[0]);
	mockUserService.getCategory = jest.fn().mockResolvedValue(dummyScale.categories[0]);
	
	
	const currentTSList = dummyScale.categories[0].actions[0].timespans.sort((a, b) => {
		const aDate = new Date(a.date).getTime();
		const bDate = new Date(b.date).getTime();
		return bDate - aDate; //reverse order
	}); 
	
	//We're testing the second in the list
	mockUserService.deleteTimespan = jest.fn().mockResolvedValue(currentTSList);
	
	
	
	const { container } = render(<AmendActionHistoryPageLogicContainer
									scaleID={dummyScale.id}
									userService={mockUserService}
									backButtonHandler={()=>{}} />);
	
	const originalItems = container.querySelectorAll(".AmendActionHistoryPage .ActionHistoryItem");
	expect(originalItems.length).toBe(currentTSList.length)
	currentTSList.forEach((ts, i) => {
		expect(originalItems[i].textContent)
			.toEqual(expect.stringContaining(ts.date.getFullYear().toString()))
	});
	
	
	const deleteButtons = screen.getAllByRole("button", { name: /delete/i })
	expect(deleteButtons.length).toBe(currentTSList.length);
	
	
	
	//before delete, mock a removal of the middle one
	mockUserService.getScaleTimespans = 
		(scale, reverseOrder) => scale.categories[0].actions[0].timespans
			.filter(
				ts => ts !== scale.categories[0].actions[0].timespans[1]
			).map((timespan) => {
				return { timespan, category: scale.categories[0], action: scale.categories[0].actions[0] };
			}).sort((a, b) => {
			
				const aDate = new Date(a.date).getTime();
				const bDate = new Date(b.date).getTime();
				
				if(reverseOrder) 
					return bDate - aDate;
				else
					return aDate - bDate;
			});
	
	
	fireEvent.click(deleteButtons[1]);
	
	
	await waitFor(() => {
		
		expect(mockUserService.deleteTimespan).toHaveBeenCalledWith(
			dummyScale, 
			dummyScale.categories[0], 
			dummyScale.categories[0].actions[0], 
			dummyScale.categories[0].actions[0].timespans[1]
		);
		
		const currentItemList = container.querySelectorAll(".AmendActionHistoryPage .ActionHistoryItem");
		
		expect(currentItemList.length).toBe(currentTSList.length - 1);
		
		//Second item here should now be the third item from the orignal list
		expect(currentItemList[1].textContent)
			.toEqual(expect.stringContaining(currentTSList[2].date.getFullYear().toString()));
	});
	
});


test("AmendActionHistoryPageLogicContainer will pass through error message if error on delete for history items", async () => {
	
	const message = "Error while deleting... testtestetst";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.getAction = jest.fn().mockResolvedValue(dummyScale.categories[0].actions[0]);
	mockUserService.getCategory = jest.fn().mockResolvedValue(dummyScale.categories[0]);
	
	//We're testing the second in the list
	mockUserService.deleteTimespan = jest.fn().mockRejectedValue(new Error(message));
	
	
	
	const { container } = render(<AmendActionHistoryPageLogicContainer
									scaleID={dummyScale.id}
									userService={mockUserService}
									backButtonHandler={()=>{}} />);
	
	const deleteButtons = screen.getAllByRole("button", { name: /delete/i })
	
	
	fireEvent.click(deleteButtons[0]);
	
	
	await waitFor(() => {
		const currentItemList = container.querySelectorAll(".AmendActionHistoryPage .ActionHistoryItem");
		
		expect(currentItemList[0].textContent).toEqual(expect.stringContaining(message));
	});
	
});
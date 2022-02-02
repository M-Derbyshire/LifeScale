import AmendActionHistoryPageLogicContainer from './AmendActionHistoryPageLogicContainer';
import { render, fireEvent, screen } from '@testing-library/react';
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
		return { ...timespan, category: dummyScale.categories[0], action: dummyScale.categories[0].actions[0] };
	}).sort((a, b) => {
		
		const aDate = new Date(a.date).getTime();
		const bDate = new Date(b.date).getTime();
		
		if(reverseOrder) 
			return bDate - aDate;
		else
			return aDate - bDate;
	});


test("AmendActionHistoryPageLogicContainer will render an AmendActionHistoryPage, and pass in the scale and userService", () => {
	
	const mockUserService = { ...dummyUserService };
	mockUserService.createTimespan = jest.fn().mockResolvedValue(dummyScale.categories[0].actions[0].timespans[0]);
	mockUserService.getAction = jest.fn().mockResolvedValue(dummyScale.categories[0].actions[0]);
	
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

//will pass onDelete to history items, and update item list on delete

//Will display delete error message if unable to delete
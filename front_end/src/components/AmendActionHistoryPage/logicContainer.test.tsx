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
			timespans: [{
				id: "testTS427347289374",
				date: new Date(),
				minuteCount: 60
			}]
		}]
	}]
};


const dummyUserService = new TestingDummyUserService();
dummyUserService.getScale = scaleID => dummyScale;


test("AmendActionHistoryPageLogicContainer will render an AmendActionHistoryPage, and pass in the scale and userService", () => {
	
	const mockUserService = new TestingDummyUserService();
	mockUserService.getScale = scaleID => dummyScale;
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
	
	const mockUserService = new TestingDummyUserService();
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
import CategoryDetailsFormLogicContainer from './CategoryDetailsFormLogicContainer';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TestingDummyUserService from '../../userServices/TestingDummyUserService/TestingDummyUserService';


const dummyBackHandler = ()=>{};

const dummyScaleID = "testScaleID";

const dummyCategory = {
	id: "testCat23132948284",
	name: "testcat",
	color: "red",
	desiredWeight: 1,
	actions: [{
		id: "testact3298294848",
		name: "testAct",
		weight: 1,
		timespans: []
	}]
}

const dummyCategoryNoActions = { ...dummyCategory, actions: [] };

const dummyUserService = new TestingDummyUserService();
dummyUserService.getCategory = (catID, scaleID) => dummyCategory;


test("CategoryDetailsFormLogicContainer will display a CategoryDetailsForm", () => {
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScaleID}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={dummyUserService} />);
	
	expect(container.querySelector(".CategoryDetailsForm")).not.toBeNull();
	
});

test("CategoryDetailsFormLogicContainer will pass in the actionsForm prop, if categoryID is provided", () => {
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScaleID}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={dummyUserService} />);
	
	expect(container.querySelector(".ActionsFormLogicContainer")).not.toBeNull();
	
});

test("CategoryDetailsFormLogicContainer will not pass in the actionsForm prop, if no categoryID is provided", () => {
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScaleID}
									backButtonHandler={dummyBackHandler}
									userService={dummyUserService} />);
	
	expect(container.querySelector(".ActionsFormLogicContainer")).toBeNull();
	
});

test("CategoryDetailsFormLogicContainer will pass in the delete handler, if categoryID is provided", () => {
	
	//No actions, so no delete buttons for those
	const mockUserService = { ...dummyUserService };
	mockUserService.getCategory = (catID, scaleID) => dummyCategoryNoActions;
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScaleID}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={mockUserService} />);
	
	expect(screen.queryByRole("button", { name: /delete/i })).not.toBeNull();
	
});

test("CategoryDetailsFormLogicContainer will not pass in the delete handler, if no categoryID is provided", () => {
	
	//No actions, so no delete buttons for those
	const mockUserService = { ...dummyUserService };
	mockUserService.getCategory = (catID, scaleID) => dummyCategoryNoActions;
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScaleID}
									backButtonHandler={dummyBackHandler}
									userService={mockUserService} />);
	
	expect(screen.queryByRole("button", { name: /delete/i })).toBeNull();
	
});


test("CategoryDetailsFormLogicContainer will load the category with the given scale and category IDs", () => {
	
	const mockUserService = { ...dummyUserService };
	mockUserService.getCategory = jest.fn().mockReturnValue(dummyCategory);
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScaleID}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={mockUserService} />);
	
	expect(mockUserService.getCategory).toHaveBeenCalledWith(dummyCategory.id, dummyScaleID);
	
});

test("CategoryDetailsFormLogicContainer will pass the category name within the headingText, if categoryID is provided", () => {
	
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScaleID}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={dummyUserService} />);
	
	const heading = container.querySelector(".CategoryDetailsForm header");
	
	expect(heading.textContent).toEqual(expect.stringContaining(dummyCategory.name));
	
});

// loads scale on create

// loads scale and category on edit

// badLoadErrorMessage on bad scale load

//badLoadErrorMessage on bad category load

// badLoadErrorMessage to category form on bad load callback from actionform

// handles form state

// back button handler

// save creating

// save updating

// error message on bad create

// error message on bad update

// save message on good create

// save message on good update

// disable submit while creating, re-enable when done

// disable submit while updating, re-enable when done

// re-enable submit after bad create

// re-enable submit after bad update

// calls delete on user service, on delete button

// displays bad save message on bad delete

// call onSuccessfulDeleteHandler after good delete
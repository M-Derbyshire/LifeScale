import CategoryDetailsFormLogicContainer from './CategoryDetailsFormLogicContainer';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import TestingDummyUserService from '../../userServices/TestingDummyUserService/TestingDummyUserService';


const dummyBackHandler = ()=>{};

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

const dummyScale = {
	id: "testScale38312772389",
	name: "testscale",
	usesTimespans: true,
	displayDayCount: 7,
	categories: [dummyCategory]
}

const dummyCategoryNoActions = { ...dummyCategory, actions: [] };

const dummyUserService = new TestingDummyUserService();
dummyUserService.getCategory = (catID, scaleID) => dummyCategory;
dummyUserService.getScale = (scaleID) => dummyScale;



const scaleLoadErrorMessage = "Unable to load the requested scale.";
const categoryLoadErrorMessage = "Unable to load the requested category.";



test("CategoryDetailsFormLogicContainer will display a CategoryDetailsForm", () => {
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={dummyUserService} />);
	
	expect(container.querySelector(".CategoryDetailsForm")).not.toBeNull();
	
});

test("CategoryDetailsFormLogicContainer will pass in the actionsForm prop, if categoryID is provided", () => {
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={dummyUserService} />);
	
	expect(container.querySelector(".ActionsFormLogicContainer")).not.toBeNull();
	
});

test("CategoryDetailsFormLogicContainer will not pass in the actionsForm prop, if no categoryID is provided", () => {
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									backButtonHandler={dummyBackHandler}
									userService={dummyUserService} />);
	
	expect(container.querySelector(".ActionsFormLogicContainer")).toBeNull();
	
});

test("CategoryDetailsFormLogicContainer will pass in the delete handler, if categoryID is provided", () => {
	
	//No actions, so no delete buttons for those
	const mockUserService = { ...dummyUserService };
	mockUserService.getCategory = (catID, scaleID) => dummyCategoryNoActions;
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
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
									scaleID={dummyScale.id}
									backButtonHandler={dummyBackHandler}
									userService={mockUserService} />);
	
	expect(screen.queryByRole("button", { name: /delete/i })).toBeNull();
	
});

test("CategoryDetailsFormLogicContainer will pass the category name within the headingText, if categoryID is provided", () => {
	
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={dummyUserService} />);
	
	const heading = container.querySelector(".CategoryDetailsForm header");
	
	expect(heading.textContent).toEqual(expect.stringContaining(dummyCategory.name));
	
});


test("CategoryDetailsFormLogicContainer will load the category and scale with the given scale and category IDs, if a category id is provided", () => {
	
	const mockUserService = { ...dummyUserService };
	mockUserService.getCategory = jest.fn().mockReturnValue(dummyCategory);
	mockUserService.getScale = jest.fn().mockReturnValue(dummyScale);
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={mockUserService} />);
	
	expect(mockUserService.getCategory).toHaveBeenCalledWith(dummyCategory.id, dummyScale.id);
	expect(mockUserService.getScale).toHaveBeenCalledWith(dummyScale.id);
	
});

test("CategoryDetailsFormLogicContainer will load just the scale with the given scale ID, if no category id is provided", () => {
	
	const mockUserService = { ...dummyUserService };
	mockUserService.getCategory = jest.fn().mockReturnValue(dummyCategory);
	mockUserService.getScale = jest.fn().mockReturnValue(dummyScale);
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									backButtonHandler={dummyBackHandler}
									userService={mockUserService} />);
	
	expect(mockUserService.getCategory).not.toHaveBeenCalled();
	expect(mockUserService.getScale).toHaveBeenCalledWith(dummyScale.id);
	
});

test("CategoryDetailsFormLogicContainer will pass a badLoadErrorMessage on bad scale load", () => {
	
	const errorMessage = scaleLoadErrorMessage;
	
	const mockUserService = { ...dummyUserService };
	mockUserService.getCategory = jest.fn().mockReturnValue(dummyCategory);
	mockUserService.getScale = jest.fn().mockReturnValue(undefined);
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={mockUserService} />);
	
	const categoryForm = container.querySelector(".CategoryDetailsForm");
	expect(within(categoryForm).queryByText(errorMessage)).not.toBeNull();
	
});

test("CategoryDetailsFormLogicContainer will pass a badLoadErrorMessage on bad category load", () => {
	
	const errorMessage = categoryLoadErrorMessage;
	
	const mockUserService = { ...dummyUserService };
	mockUserService.getCategory = jest.fn().mockReturnValue(undefined);
	mockUserService.getScale = jest.fn().mockReturnValue(dummyScale);
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={mockUserService} />);
	
	const categoryForm = container.querySelector(".CategoryDetailsForm");
	expect(within(categoryForm).queryByText(errorMessage)).not.toBeNull();
	
});

// badLoadErrorMessage to category form on bad load callback from actionform
test("CategoryDetailsFormLogicContainer will pass a badLoadErrorMessage to CategoryDetailsForm on bad load callback from ActionsForm", () => {
	
	const errorMessage = categoryLoadErrorMessage;
	
	const mockUserService = { ...dummyUserService };
	mockUserService.getScale = jest.fn().mockReturnValue(dummyScale);
	
	//Only the once, so ActionsForm fails
	mockUserService.getCategory = jest.fn().mockReturnValueOnce(dummyCategory).mockReturnValue(undefined);
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={mockUserService} />);
	
	const categoryForm = container.querySelector(".CategoryDetailsForm");
	expect(within(categoryForm).queryByText(errorMessage)).not.toBeNull();
	
});

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
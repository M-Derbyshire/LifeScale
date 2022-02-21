import ScaleDetailsFormLogicContainer from './ScaleDetailsFormLogicContainer';
import { render, fireEvent, screen, within } from '@testing-library/react';
import TestingDummyUserService from '../../userServices/TestingDummyUserService/TestingDummyUserService';
import IAction from '../../interfaces/IAction';
import IScale from '../../interfaces/IScale';


const dummyBackHandler = ()=>{};
const dummyEditCategoryHandler = (id)=>{};
const dummyAddCategoryHandler = ()=>{};

const dummyCategory1 = {
	id: "testCat23132948284",
	name: "testcat1",
	color: "",
	desiredWeight: 1,
	actions: new Array<IAction>()
};

const dummyCategory2 = {
	id: "testCatd3482384092348",
	name: "testcat2",
	color: "",
	desiredWeight: 1,
	actions: new Array<IAction>()
};

const dummyCategory3 = {
	id: "testCat32482934809438",
	name: "testcat3",
	color: "",
	desiredWeight: 1,
	actions: new Array<IAction>()
}

const dummyScale = {
	id: "testScale38312772389",
	name: "testscale",
	usesTimespans: true,
	displayDayCount: 7,
	categories: [dummyCategory1, dummyCategory2, dummyCategory3]
}



const dummyUserService = new TestingDummyUserService();
dummyUserService.getScale = (scaleID) => dummyScale;


const scaleLoadErrorMessage = "Unable to load the requested scale.";


test("ScaleDetailsFormLogicContainer will display a ScaleDetailsForm", () => {
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									scaleID={dummyScale.id}
									userService={dummyUserService}
									backButtonHandler={dummyBackHandler}
									editCategoryHandler={dummyEditCategoryHandler}
									addCategoryHandler={dummyAddCategoryHandler} />);
	
	const detailsForm = container.querySelector(".ScaleDetailsForm");
	expect(detailsForm).not.toBeNull();
	
});


test("ScaleDetailsFormLogicContainer will pass in the delete handler, if scaleID is provided", () => {
	
	render(<ScaleDetailsFormLogicContainer
		scaleID={dummyScale.id}
		userService={dummyUserService}
		backButtonHandler={dummyBackHandler}
		editCategoryHandler={dummyEditCategoryHandler}
		addCategoryHandler={dummyAddCategoryHandler} />);
	
	expect(screen.queryByRole("button", { name: /delete/i })).not.toBeNull();
	
});


test("ScaleDetailsFormLogicContainer will not pass in the delete handler, if no scaleID is provided", () => {
	
	render(<ScaleDetailsFormLogicContainer
			userService={dummyUserService}
			backButtonHandler={dummyBackHandler}
			editCategoryHandler={dummyEditCategoryHandler}
			addCategoryHandler={dummyAddCategoryHandler} />);
	
	expect(screen.queryByRole("button", { name: /delete/i })).toBeNull();
	
});



test("ScaleDetailsFormLogicContainer will not display the CardDisplay, if no scaleID is provided", () => {
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									userService={dummyUserService}
									backButtonHandler={dummyBackHandler}
									editCategoryHandler={dummyEditCategoryHandler}
									addCategoryHandler={dummyAddCategoryHandler} />);
	
	expect(container.querySelector(".CardDisplay")).toBeNull();
	
});

test("ScaleDetailsFormLogicContainer will display the CardDisplay, with the categories passed in, if a scaleID is provided", () => {
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									scaleID={dummyScale.id}
									userService={dummyUserService}
									backButtonHandler={dummyBackHandler}
									editCategoryHandler={dummyEditCategoryHandler}
									addCategoryHandler={dummyAddCategoryHandler} />);
	
	const cardDisplay = container.querySelector(".CardDisplay");
	expect(cardDisplay).not.toBeNull();

	dummyScale.categories.forEach(cat => expect(screen.getByText(cat.name)).not.toBeNull());
	
});



test("ScaleDetailsFormLogicContainer will load the scale with the given scale ID, if a scale id is provided", () => {
	
	const mockUserService = { ...dummyUserService };
	mockUserService.getScale = jest.fn().mockReturnValue(dummyScale);
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									scaleID={dummyScale.id}
									userService={mockUserService}
									backButtonHandler={dummyBackHandler}
									editCategoryHandler={dummyEditCategoryHandler}
									addCategoryHandler={dummyAddCategoryHandler} />);
	
	expect(mockUserService.getScale).toHaveBeenCalledWith(dummyScale.id);
	
});

test("ScaleDetailsFormLogicContainer will pass a badLoadErrorMessage on bad scale load", () => {
	
	const errorMessage = scaleLoadErrorMessage;
	
	const mockUserService = { ...dummyUserService };
	mockUserService.getScale = jest.fn().mockReturnValue(undefined);
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									scaleID={dummyScale.id}
									userService={mockUserService}
									backButtonHandler={dummyBackHandler}
									editCategoryHandler={dummyEditCategoryHandler}
									addCategoryHandler={dummyAddCategoryHandler} />);
	
	const scaleForm = container.querySelector(".ScaleDetailsForm");
	expect(within(scaleForm).queryByText(errorMessage)).not.toBeNull();
	
});


test("ScaleDetailsFormLogicContainer will pass the editCategoryCallback to the form", () => {
	
	const mockEditHandler = jest.fn();
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									scaleID={dummyScale.id}
									userService={dummyUserService}
									backButtonHandler={dummyBackHandler}
									editCategoryHandler={mockEditHandler}
									addCategoryHandler={dummyAddCategoryHandler} />);
	
	const cardDisplay = container.querySelector(".CardDisplay");
	const editButtons = within(cardDisplay).queryAllByRole("button", { name: /edit/i });
	expect(editButtons.length).toBe(dummyScale.categories.length);
	
	//We don't care what order the cards are displayed in
	editButtons.forEach(button => fireEvent.click(button));
	
	dummyScale.categories.forEach(cat => expect(mockEditHandler).toHaveBeenCalledWith(cat.id));
	
});

test("ScaleDetailsFormLogicContainer will pass the addCategoryCallback to the form", () => {
	
	const mockAddHandler = jest.fn();
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									scaleID={dummyScale.id}
									userService={dummyUserService}
									backButtonHandler={dummyBackHandler}
									editCategoryHandler={dummyEditCategoryHandler}
									addCategoryHandler={mockAddHandler} />);
	
	const cardDisplay = container.querySelector(".CardDisplay");
	const addButton = within(cardDisplay).queryByText("+");
	
	fireEvent.click(addButton);
	
	expect(mockAddHandler).toHaveBeenCalled();
	
});



test("ScaleDetailsFormLogicContainer will pass the scale name within the headingText, if scaleID is provided", () => {
	
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									scaleID={dummyScale.id}
									userService={dummyUserService}
									backButtonHandler={dummyBackHandler}
									editCategoryHandler={dummyEditCategoryHandler}
									addCategoryHandler={dummyAddCategoryHandler} />);
	
	const heading = container.querySelector(".ScaleDetailsForm header");
	
	expect(heading.textContent).toEqual(expect.stringContaining(dummyScale.name));
	
});



test("ScaleDetailsFormLogicContainer will handle the form state", () => {
	
	const mockUserService = { ...dummyUserService };
	const originalScale = { ...dummyScale, name: "test", usesTimespans: true, displayDayCount: 7 };
	mockUserService.getScale = (scaleID) => originalScale;
	
	const newName = "testNewTest";
	const newUsesTimespans = false
	const newDayCount = 13467;
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									scaleID={dummyScale.id}
									userService={mockUserService}
									backButtonHandler={dummyBackHandler}
									editCategoryHandler={dummyEditCategoryHandler}
									addCategoryHandler={dummyAddCategoryHandler} />);
	
	const nameInput = screen.getByDisplayValue(originalScale.name);
	
	//may be more checkboxes in the future, so being explicit
	const usesTimespansInput = container.querySelector(".scaleUsesTimespansInput");
	expect(usesTimespansInput).toBeChecked();
	
	const dayCountInput = screen.getByDisplayValue(originalScale.displayDayCount);
	
	
	fireEvent.change(nameInput, { target: { value: newName } });
	fireEvent.click(usesTimespansInput);
	fireEvent.change(dayCountInput, { target: { value: newDayCount } });
	
	expect(nameInput.value).toBe(newName);
	expect(usesTimespansInput).not.toBeChecked();
	expect(Number(dayCountInput.value)).toBe(newDayCount);
	
});

// ScaleDetailsFormLogicContainer will not change the header when changing the name state

// ScaleDetailsFormLogicContainer will pass down the backButtonHandler prop

// ScaleDetailsFormLogicContainer will save new records with the apiAccessor, and then change to editing mode

// ScaleDetailsFormLogicContainer will update existing records with the apiAccessor

// ScaleDetailsFormLogicContainer will change the header after saving an update with name change

// ScaleDetailsFormLogicContainer will display an error message on bad create save

// ScaleDetailsFormLogicContainer will display an error message on bad update save

// ScaleDetailsFormLogicContainer will display a good save message on good create save

// ScaleDetailsFormLogicContainer will display a good save message on good update save

// ScaleDetailsFormLogicContainer will clear good save message after a bad update save

// ScaleDetailsFormLogicContainer will clear error save message after a good create save

// ScaleDetailsFormLogicContainer will clear error save message after a good update save

// ScaleDetailsFormLogicContainer will disable submit button when creating, then re-enable when done

// ScaleDetailsFormLogicContainer will disable submit button when updating, then re-enable when done

// ScaleDetailsFormLogicContainer will re-enable submit button after a error during create

// ScaleDetailsFormLogicContainer will re-enable submit button after a error during update

// ScaleDetailsFormLogicContainer will use userService deletescale method to delete (passing original scale)

// ScaleDetailsFormLogicContainer will display error if bad save during delete

// ScaleDetailsFormLogicContainer will call onSuccessfulDeleteHandler after successful delete


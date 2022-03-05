import ScaleDetailsFormLogicContainer from './ScaleDetailsFormLogicContainer';
import { render, fireEvent, screen, within, waitFor } from '@testing-library/react';
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
dummyUserService.abortRequests = () => {};


const scaleLoadErrorMessage = "Unable to load the requested scale.";
const stdGoodSaveMessage = "Scale saved successfully.";


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



test("ScaleDetailsFormLogicContainer will not change the header when changing the name state", () => {
	
	const newName = "aaaaaaabbbbbbbbbbccccccccc";
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									scaleID={dummyScale.id}
									userService={dummyUserService}
									backButtonHandler={dummyBackHandler}
									editCategoryHandler={dummyEditCategoryHandler}
									addCategoryHandler={dummyAddCategoryHandler} />);
	
	const nameInput = screen.getByDisplayValue(dummyScale.name);
	expect(nameInput.value).not.toBe(newName);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	
	const header = container.querySelector(".ScaleDetailsForm header");
	expect(header.textContent).toEqual(expect.stringContaining(dummyScale.name));
	
});


test("ScaleDetailsFormLogicContainer will pass down the backButtonHandler prop", () => {
	
	const mockBackButtonHandler = jest.fn();
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									scaleID={dummyScale.id}
									userService={dummyUserService}
									backButtonHandler={mockBackButtonHandler}
									editCategoryHandler={dummyEditCategoryHandler}
									addCategoryHandler={dummyAddCategoryHandler} />);
	
	const scaleDetailsForm = container.querySelector(".ScaleDetailsForm");
	const backButton = within(scaleDetailsForm).getByRole("button", { name: /back/i })
	
	fireEvent.click(backButton);
	
	expect(mockBackButtonHandler).toHaveBeenCalled();
	
});



test("ScaleDetailsFormLogicContainer will save new records with the apiAccessor, and then change to editing mode", async () => {
	
	const newName = "testNewTest";
	const newUsesTimespans = false;
	const newDayCount = 13467;
	
	const scaleToCreate = { 
		name: newName, 
		usesTimespans: newUsesTimespans, 
		displayDayCount: newDayCount,
		categories: [{
			name: "testCat1",
			id: "1",
			color: "red",
			desiredWeight: 1,
			actions: []
		}, {
			name: "testCat2",
			id: "2",
			color: "red",
			desiredWeight: 1,
			actions: []
		},
		{
			name: "testCat3",
			id: "3",
			color: "red",
			desiredWeight: 1,
			actions: []
		}]
	};
	
	const mockUserService = { ...dummyUserService };
	mockUserService.createScale = jest.fn().mockResolvedValue({ ...scaleToCreate, id: "testID" });
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									userService={mockUserService}
									backButtonHandler={dummyBackHandler}
									editCategoryHandler={dummyEditCategoryHandler}
									addCategoryHandler={dummyAddCategoryHandler} />);
	
	
	// ----------- Set the values -----------------
	
	//empty string, so being explicit with selector
	const nameInput = container.querySelector(".scaleNameInput");
	
	//may be more checkboxes in the future, so being explicit with selector
	const usesTimespansInput = container.querySelector(".scaleUsesTimespansInput");
	
	const dayCountInput = container.querySelector(".scaleDayCountInput");
	
	
	fireEvent.change(nameInput, { target: { value: newName } });
	fireEvent.change(dayCountInput, { target: { value: newDayCount } });
	if(usesTimespansInput.checked !== newUsesTimespans)
		fireEvent.click(usesTimespansInput);
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".ScaleDetailsForm form");
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(mockUserService.createScale)
			.toHaveBeenCalledWith({ ...scaleToCreate, categories: [] });
		
		//Check we're now in editing mode
		const scaleDetailsForm = container.querySelector(".ScaleDetailsForm form");
		expect(within(scaleDetailsForm).queryByRole("button", { name: /delete/i })).not.toBeNull();
		expect(container.querySelector(".ScaleDetailsForm header").textContent)
			.toEqual(expect.stringContaining(newName));
		
		//Are we displaying categories as well
		scaleToCreate.categories.forEach(cat => expect(screen.queryByText(cat.name)).not.toBeNull());
	});
	
});


test("ScaleDetailsFormLogicContainer will update existing records with the apiAccessor", async () => {
	
	const newName = "testNewTest";
	const newUsesTimespans = !dummyScale.usesTimespans;
	const newDayCount = 13467;
	
	const scaleToReturn = { 
		id: dummyScale.id,
		name: newName, 
		usesTimespans: newUsesTimespans, 
		displayDayCount: newDayCount,
		categories: dummyScale.categories
	};
	
	const mockUserService = { ...dummyUserService };
	mockUserService.updateScale = jest.fn().mockResolvedValue(scaleToReturn);
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									scaleID={dummyScale.id}
									userService={mockUserService}
									backButtonHandler={dummyBackHandler}
									editCategoryHandler={dummyEditCategoryHandler}
									addCategoryHandler={dummyAddCategoryHandler} />);
	
	
	// ----------- Set the values -----------------
	
	//empty string, so being explicit with selector
	const nameInput = container.querySelector(".scaleNameInput");
	
	//may be more checkboxes in the future, so being explicit with selector
	const usesTimespansInput = container.querySelector(".scaleUsesTimespansInput");
	
	const dayCountInput = container.querySelector(".scaleDayCountInput");
	
	
	fireEvent.change(nameInput, { target: { value: newName } });
	fireEvent.change(dayCountInput, { target: { value: newDayCount } });
	if(usesTimespansInput.checked !== newUsesTimespans)
		fireEvent.click(usesTimespansInput);
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".ScaleDetailsForm form");
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(mockUserService.updateScale)
			.toHaveBeenCalledWith(dummyScale, scaleToReturn);
	});
	
});



test("ScaleDetailsFormLogicContainer will change the header after saving an update with name change", async () => {
	
	const newName = "testNewTest";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.updateScale = jest.fn().mockResolvedValue({ ...dummyScale, name: newName });
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									scaleID={dummyScale.id}
									userService={mockUserService}
									backButtonHandler={dummyBackHandler}
									editCategoryHandler={dummyEditCategoryHandler}
									addCategoryHandler={dummyAddCategoryHandler} />);
	
	
	// ----------- Set the values -----------------
	
	
	const nameInput = screen.getByDisplayValue(dummyScale.name);
	expect(nameInput.value).not.toBe(newName);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".ScaleDetailsForm form");
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(container.querySelector(".ScaleDetailsForm header").textContent)
			.toEqual(expect.stringContaining(newName));
	});
	
});





test("ScaleDetailsFormLogicContainer will display an error message on bad create save", async () => {
	
	const errorMessage = "Unable to save during creating";
	
	const newName = "testNewTest";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.createScale = jest.fn().mockRejectedValue(new Error(errorMessage));
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									userService={mockUserService}
									backButtonHandler={dummyBackHandler}
									editCategoryHandler={dummyEditCategoryHandler}
									addCategoryHandler={dummyAddCategoryHandler} />);
	
	
	// ----------- Set the values -----------------
	
	const nameInput = container.querySelector(".scaleNameInput");
	expect(nameInput.value).not.toBe(newName);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".ScaleDetailsForm form");
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(container.querySelector(".ScaleDetailsForm").textContent)
			.toEqual(expect.stringContaining(errorMessage));
	});
	
});

test("ScaleDetailsFormLogicContainer will display an error message on bad update save", async () => {
	
	const errorMessage = "Unable to save during updating";
	
	const newName = "testNewTest";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.updateScale = jest.fn().mockRejectedValue(new Error(errorMessage));
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									scaleID={dummyScale.id}
									userService={mockUserService}
									backButtonHandler={dummyBackHandler}
									editCategoryHandler={dummyEditCategoryHandler}
									addCategoryHandler={dummyAddCategoryHandler} />);
	
	
	// ----------- Set the values -----------------
	
	const nameInput = screen.getByDisplayValue(dummyScale.name);
	expect(nameInput.value).not.toBe(newName);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".ScaleDetailsForm form");
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(container.querySelector(".ScaleDetailsForm").textContent)
			.toEqual(expect.stringContaining(errorMessage));
	});
	
});

test("ScaleDetailsFormLogicContainer will display a good save message on good create save", async () => {
	
	const message = stdGoodSaveMessage;
	
	const newName = "testNewTest";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.createScale = jest.fn().mockResolvedValue({ ...dummyScale, name: newName });
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									userService={mockUserService}
									backButtonHandler={dummyBackHandler}
									editCategoryHandler={dummyEditCategoryHandler}
									addCategoryHandler={dummyAddCategoryHandler} />);
	
	
	// ----------- Set the values -----------------
	
	const nameInput = container.querySelector(".scaleNameInput");
	expect(nameInput.value).not.toBe(newName);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".ScaleDetailsForm form");
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(container.querySelector(".ScaleDetailsForm").textContent)
			.toEqual(expect.stringContaining(message));
	});
	
});

test("ScaleDetailsFormLogicContainer will display a good save message on good update save", async () => {
	
	const message = stdGoodSaveMessage;
	
	const newName = "testNewTest";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.updateScale = jest.fn().mockResolvedValue({ ...dummyScale, name: newName });
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									scaleID={dummyScale.id}
									userService={mockUserService}
									backButtonHandler={dummyBackHandler}
									editCategoryHandler={dummyEditCategoryHandler}
									addCategoryHandler={dummyAddCategoryHandler} />);
	
	
	// ----------- Set the values -----------------
	
	const nameInput = screen.getByDisplayValue(dummyScale.name);
	expect(nameInput.value).not.toBe(newName);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".ScaleDetailsForm form");
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(container.querySelector(".ScaleDetailsForm").textContent)
			.toEqual(expect.stringContaining(message));
	});
	
});

test("ScaleDetailsFormLogicContainer will clear good save message after a bad update save", async () => {
	
	const message = stdGoodSaveMessage;
	const errorMessage = "Test error";
	
	const newName = "testNewTest";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.updateScale = jest.fn().mockResolvedValue({ ...dummyScale, name: newName });
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									scaleID={dummyScale.id}
									userService={mockUserService}
									backButtonHandler={dummyBackHandler}
									editCategoryHandler={dummyEditCategoryHandler}
									addCategoryHandler={dummyAddCategoryHandler} />);
	
	
	// ----------- Set the values -----------------
	
	const nameInput = screen.getByDisplayValue(dummyScale.name);
	expect(nameInput.value).not.toBe(newName);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".ScaleDetailsForm form");
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(container.querySelector(".ScaleDetailsForm").textContent)
			.toEqual(expect.stringContaining(message));
	});
	
	//Now change to reject
	mockUserService.updateScale = jest.fn().mockRejectedValue(new Error(errorMessage));
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(container.querySelector(".ScaleDetailsForm").textContent)
			.not.toEqual(expect.stringContaining(message));
	});
	
});

test("ScaleDetailsFormLogicContainer will clear error save message after a good create save", async () => {
	
	const message = stdGoodSaveMessage;
	const errorMessage = "Test error";
	
	const newName = "testNewTest";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.createScale = jest.fn().mockRejectedValue(new Error(errorMessage));
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									userService={mockUserService}
									backButtonHandler={dummyBackHandler}
									editCategoryHandler={dummyEditCategoryHandler}
									addCategoryHandler={dummyAddCategoryHandler} />);
	
	
	// ----------- Set the values -----------------
	
	const nameInput = container.querySelector(".scaleNameInput");
	expect(nameInput.value).not.toBe(newName);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".ScaleDetailsForm form");
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(container.querySelector(".ScaleDetailsForm").textContent)
			.toEqual(expect.stringContaining(errorMessage));
	});
	
	//Now change to reject
	mockUserService.createScale = jest.fn().mockResolvedValue({ ...dummyScale, name: newName });
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(container.querySelector(".ScaleDetailsForm").textContent)
			.not.toEqual(expect.stringContaining(errorMessage));
	});
	
});

test("ScaleDetailsFormLogicContainer will clear error save message after a good update save", async () => {
	
	const message = stdGoodSaveMessage;
	const errorMessage = "Test error";
	
	const newName = "testNewTest";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.updateScale = jest.fn().mockRejectedValue(new Error(errorMessage));
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									scaleID={dummyScale.id}
									userService={mockUserService}
									backButtonHandler={dummyBackHandler}
									editCategoryHandler={dummyEditCategoryHandler}
									addCategoryHandler={dummyAddCategoryHandler} />);
	
	
	// ----------- Set the values -----------------
	
	const nameInput = screen.getByDisplayValue(dummyScale.name);
	expect(nameInput.value).not.toBe(newName);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".ScaleDetailsForm form");
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(container.querySelector(".ScaleDetailsForm").textContent)
			.toEqual(expect.stringContaining(errorMessage));
	});
	
	//Now change to reject
	mockUserService.updateScale = jest.fn().mockResolvedValue({ ...dummyScale, name: newName });
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(container.querySelector(".ScaleDetailsForm").textContent)
			.not.toEqual(expect.stringContaining(errorMessage));
	});
	
});



test("ScaleDetailsFormLogicContainer will disable submit button when creating, then re-enable when done", async () => {
	
	const newName = "testNewTest";
	const newUsesTimespans = !dummyScale.usesTimespans;
	const newDayCount = 13467;
	
	const scaleToReturn = { 
		id: dummyScale.id,
		name: newName, 
		usesTimespans: newUsesTimespans, 
		displayDayCount: newDayCount,
		categories: dummyScale.categories
	};
	
	
	const mockUserService = { ...dummyUserService };
	mockUserService.createScale = jest.fn().mockResolvedValue(scaleToReturn);
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									userService={mockUserService}
									backButtonHandler={dummyBackHandler}
									editCategoryHandler={dummyEditCategoryHandler}
									addCategoryHandler={dummyAddCategoryHandler} />);
	
	
	// ----------- Set the values -----------------
	
	const nameInput = container.querySelector(".scaleNameInput");
	expect(nameInput.value).not.toBe(newName);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".ScaleDetailsForm form");
	const submitButton = container.querySelector(".ScaleDetailsForm form input[type=submit]");
	expect(submitButton).not.toBeDisabled();
	
	fireEvent.submit(form);
	
	expect(submitButton).toBeDisabled();
	
	//Re-enable
	await waitFor(() => {
		expect(submitButton).not.toBeDisabled();
	});
	
});

// ScaleDetailsFormLogicContainer will disable submit button when updating, then re-enable when done
test("ScaleDetailsFormLogicContainer will disable submit button when creating, then re-enable when done", async () => {
	
	const newName = "testNewTest";
	const newUsesTimespans = !dummyScale.usesTimespans;
	const newDayCount = 13467;
	
	const scaleToReturn = { 
		id: dummyScale.id,
		name: newName, 
		usesTimespans: newUsesTimespans, 
		displayDayCount: newDayCount,
		categories: dummyScale.categories
	};
	
	
	const mockUserService = { ...dummyUserService };
	mockUserService.updateScale = jest.fn().mockResolvedValue(scaleToReturn);
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									scaleID={dummyScale.id}
									userService={mockUserService}
									backButtonHandler={dummyBackHandler}
									editCategoryHandler={dummyEditCategoryHandler}
									addCategoryHandler={dummyAddCategoryHandler} />);
	
	
	// ----------- Set the values -----------------
	
	const nameInput = container.querySelector(".scaleNameInput");
	expect(nameInput.value).not.toBe(newName);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".ScaleDetailsForm form");
	const submitButton = container.querySelector(".ScaleDetailsForm form input[type=submit]");
	expect(submitButton).not.toBeDisabled();
	
	fireEvent.submit(form);
	
	expect(submitButton).toBeDisabled();
	
	//Re-enable
	await waitFor(() => {
		expect(submitButton).not.toBeDisabled();
	});
	
});

test("ScaleDetailsFormLogicContainer will re-enable submit button after a error during create", async () => {
	
	const newName = "testNewTest";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.createScale = jest.fn().mockRejectedValue(new Error("test"));
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									userService={mockUserService}
									backButtonHandler={dummyBackHandler}
									editCategoryHandler={dummyEditCategoryHandler}
									addCategoryHandler={dummyAddCategoryHandler} />);
	
	
	// ----------- Set the values -----------------
	
	const nameInput = container.querySelector(".scaleNameInput");
	expect(nameInput.value).not.toBe(newName);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".ScaleDetailsForm form");
	const submitButton = container.querySelector(".ScaleDetailsForm form input[type=submit]");
	expect(submitButton).not.toBeDisabled();
	
	fireEvent.submit(form);
	
	expect(submitButton).toBeDisabled();
	
	//Re-enable
	await waitFor(() => {
		expect(submitButton).not.toBeDisabled();
	});
	
});

test("ScaleDetailsFormLogicContainer will re-enable submit button after a error during update", async () => {
	
	const newName = "testNewTest";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.updateScale = jest.fn().mockRejectedValue(new Error("test"));
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									scaleID={dummyScale.id}
									userService={mockUserService}
									backButtonHandler={dummyBackHandler}
									editCategoryHandler={dummyEditCategoryHandler}
									addCategoryHandler={dummyAddCategoryHandler} />);
	
	
	// ----------- Set the values -----------------
	
	const nameInput = container.querySelector(".scaleNameInput");
	expect(nameInput.value).not.toBe(newName);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".ScaleDetailsForm form");
	const submitButton = container.querySelector(".ScaleDetailsForm form input[type=submit]");
	expect(submitButton).not.toBeDisabled();
	
	fireEvent.submit(form);
	
	expect(submitButton).toBeDisabled();
	
	//Re-enable
	await waitFor(() => {
		expect(submitButton).not.toBeDisabled();
	});
	
});




test("ScaleDetailsFormLogicContainer will use userService deletescale method to delete (passing original scale)", async () => {
	
	const mockUserService = { ...dummyUserService };
	mockUserService.deleteScale = jest.fn().mockResolvedValue([]);
	
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									scaleID={dummyScale.id}
									userService={mockUserService}
									backButtonHandler={dummyBackHandler}
									editCategoryHandler={dummyEditCategoryHandler}
									addCategoryHandler={dummyAddCategoryHandler} />);
	
	
	const deleteButton = screen.getByRole("button", { name: /delete/i });
	
	fireEvent.click(deleteButton);
	
	
	await waitFor(() => {
		expect(mockUserService.deleteScale).toHaveBeenCalledWith(dummyScale);
	});
	
});

test("ScaleDetailsFormLogicContainer will display error if bad save during delete", async () => {
	
	const errorMessage = "test error on delete";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.deleteScale = jest.fn().mockRejectedValue(new Error(errorMessage));
	
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									scaleID={dummyScale.id}
									userService={mockUserService}
									backButtonHandler={dummyBackHandler}
									editCategoryHandler={dummyEditCategoryHandler}
									addCategoryHandler={dummyAddCategoryHandler} />);
	
	
	const deleteButton = screen.getByRole("button", { name: /delete/i });
	
	fireEvent.click(deleteButton);
	
	
	await waitFor(() => {
		expect(container.querySelector(".ScaleDetailsForm").textContent)
			.toEqual(expect.stringContaining(errorMessage));
	});
	
});

test("ScaleDetailsFormLogicContainer will call onSuccessfulDeleteHandler after successful delete", async () => {
	
	const mockUserService = { ...dummyUserService };
	mockUserService.deleteScale = jest.fn().mockResolvedValue([]);
	
	const mockDeleteCallback = jest.fn();
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									scaleID={dummyScale.id}
									userService={mockUserService}
									backButtonHandler={dummyBackHandler}
									editCategoryHandler={dummyEditCategoryHandler}
									addCategoryHandler={dummyAddCategoryHandler}
									onSuccessfulDeleteHandler={mockDeleteCallback} />);
	
	
	const deleteButton = screen.getByRole("button", { name: /delete/i });
	
	fireEvent.click(deleteButton);
	
	await waitFor(() => {
		expect(mockDeleteCallback).toHaveBeenCalled();
	});
	
});



test("ScaleDetailsFormLogicContainer will call userService abortRequests method on unmount", () => {
	
	const mockUserService = new TestingDummyUserService();
	mockUserService.abortRequests = jest.fn();
	
	const { container, unmount } = render(<ScaleDetailsFormLogicContainer
		scaleID={dummyScale.id}
		userService={mockUserService}
		backButtonHandler={dummyBackHandler}
		editCategoryHandler={dummyEditCategoryHandler}
		addCategoryHandler={dummyAddCategoryHandler} />);
	
	
	unmount();
	
	expect(mockUserService.abortRequests).toHaveBeenCalled();
	
});
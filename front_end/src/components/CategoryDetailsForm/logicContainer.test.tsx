import CategoryDetailsFormLogicContainer from './CategoryDetailsFormLogicContainer';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TestingDummyUserService from '../../userServices/TestingDummyUserService/TestingDummyUserService';
import TestCategoryColorProvider from '../../utility_classes/CategoryColorProvider/TestCategoryColorProvider';


const dummyBackHandler = ()=>{};

const dummyColorList = [
	{ colorName: "red", colorRealValue: "#ff5555", colorLabel: "RedLabel" },
	{ colorName: "green", colorRealValue: "#55ff55", colorLabel: "GreenLabel" },
	{ colorName: "blue", colorRealValue: "#5555ff", colorLabel: "BlueLabel" }
];

const dummyColorProvider = new TestCategoryColorProvider(dummyColorList);



const dummyCategory = {
	id: "testCat23132948284",
	name: "testcat",
	color: dummyColorList[0].colorName,
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
dummyUserService.abortRequests = ()=>{}; // had to define explicitly



const scaleLoadErrorMessage = "Unable to load the requested scale.";
const categoryLoadErrorMessage = "Unable to load the requested category.";

const stdGoodSaveMessage = "Category saved successfully.";


test("CategoryDetailsFormLogicContainer will display a CategoryDetailsForm", () => {
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={dummyUserService}
									categoryColorProvider={dummyColorProvider} />);
	
	expect(container.querySelector(".CategoryDetailsForm")).not.toBeNull();
	
});

test("CategoryDetailsFormLogicContainer will pass in the actionsForm prop, if categoryID is provided", () => {
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={dummyUserService}
									categoryColorProvider={dummyColorProvider} />);
	
	expect(container.querySelector(".ActionsFormLogicContainer")).not.toBeNull();
	
});

test("CategoryDetailsFormLogicContainer will not pass in the actionsForm prop, if no categoryID is provided", () => {
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									backButtonHandler={dummyBackHandler}
									userService={dummyUserService}
									categoryColorProvider={dummyColorProvider} />);
	
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
									userService={mockUserService}
									categoryColorProvider={dummyColorProvider} />);
	
	expect(screen.queryByRole("button", { name: /delete/i })).not.toBeNull();
	
});

test("CategoryDetailsFormLogicContainer will not pass in the delete handler, if no categoryID is provided", () => {
	
	//No actions, so no delete buttons for those
	const mockUserService = { ...dummyUserService };
	mockUserService.getCategory = (catID, scaleID) => dummyCategoryNoActions;
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									backButtonHandler={dummyBackHandler}
									userService={mockUserService}
									categoryColorProvider={dummyColorProvider} />);
	
	expect(screen.queryByRole("button", { name: /delete/i })).toBeNull();
	
});

test("CategoryDetailsFormLogicContainer will pass the category name within the headingText, if categoryID is provided", () => {
	
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={dummyUserService}
									categoryColorProvider={dummyColorProvider} />);
	
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
									userService={mockUserService}
									categoryColorProvider={dummyColorProvider} />);
	
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
									userService={mockUserService}
									categoryColorProvider={dummyColorProvider} />);
	
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
									userService={mockUserService}
									categoryColorProvider={dummyColorProvider} />);
	
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
									userService={mockUserService}
									categoryColorProvider={dummyColorProvider} />);
	
	const categoryForm = container.querySelector(".CategoryDetailsForm");
	expect(within(categoryForm).queryByText(errorMessage)).not.toBeNull();
	
});


test("CategoryDetailsFormLogicContainer will handle the form state", () => {
	
	const newName = "testNewTest";
	const newColor = dummyColorList[1].colorName;
	const newWeight = 13467;
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={dummyUserService}
									categoryColorProvider={dummyColorProvider} />);
	
	const nameInput = screen.getByDisplayValue(dummyCategory.name);
	expect(nameInput.value).not.toBe(newName);
	
	//We can't use getByDisplayValue for selects
	const colorInput = container.querySelector(".CategoryDetailsForm select"); 
	expect(colorInput.value).not.toBe(dummyColorProvider.getRealColorFromName(newColor));
	
	// value shows up too often to use getByDisplayValue
	const weightInput = container.querySelector(".CategoryDetailsForm input[type=number]");
	expect(Number(weightInput.value)).not.toBe(newWeight);
	
	
	fireEvent.change(nameInput, { target: { value: newName } });
	userEvent.selectOptions(colorInput, dummyColorProvider.getRealColorFromName(newColor));
	fireEvent.change(weightInput, { target: { value: newWeight } });
	
	expect(nameInput.value).toBe(newName);
	expect(colorInput.value).toBe(dummyColorProvider.getRealColorFromName(newColor));
	expect(Number(weightInput.value)).toBe(newWeight);
	
});

test("CategoryDetailsFormLogicContainer will not change the header when changing the name state", () => {
	
	const newName = "aaaaaaabbbbbbbbbbccccccccc";
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={dummyUserService}
									categoryColorProvider={dummyColorProvider} />);
	
	const nameInput = screen.getByDisplayValue(dummyCategory.name);
	expect(nameInput.value).not.toBe(newName);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	
	const header = container.querySelector(".CategoryDetailsForm header");
	expect(header.textContent).toEqual(expect.stringContaining(dummyCategory.name));
	
});

test("CategoryDetailsFormLogicContainer will pass down the backButtonHandler prop", () => {
	
	const mockBackButtonHandler = jest.fn();
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id}
									backButtonHandler={mockBackButtonHandler}
									userService={dummyUserService}
									categoryColorProvider={dummyColorProvider} />);
	
	const categoryDetailsForm = container.querySelector(".CategoryDetailsForm");
	const backButton = within(categoryDetailsForm).getByRole("button", { name: /back/i })
	
	fireEvent.click(backButton);
	
	expect(mockBackButtonHandler).toHaveBeenCalled();
	
});

test("CategoryDetailsFormLogicContainer will save new records with the apiAccessor, and then change to editing mode", async () => {
	
	const newName = "testNewTest";
	const newColor = dummyColorList[1].colorName;
	const newWeight = 13467;
	
	const catToCreate = { 
		name: newName, 
		color: newColor, 
		desiredWeight: newWeight,
		actions: []
	};
	
	const mockUserService = { ...dummyUserService };
	mockUserService.createCategory = jest.fn().mockResolvedValue({ ...catToCreate, id: "testID" });
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									backButtonHandler={dummyBackHandler}
									userService={mockUserService}
									categoryColorProvider={dummyColorProvider} />);
	
	
	// ----------- Set the values -----------------
	
	//Can't use getByDisplayValue, as empty string
	const nameInput = container.querySelector(".CategoryDetailsForm input[type=text]");
	expect(nameInput.value).not.toBe(newName);
	
	//We can't use getByDisplayValue for selects
	const colorInput = container.querySelector(".CategoryDetailsForm select"); 
	expect(colorInput.value).not.toBe(dummyColorProvider.getRealColorFromName(newColor));
	
	// value shows up too often to use getByDisplayValue
	const weightInput = container.querySelector(".CategoryDetailsForm input[type=number]");
	expect(Number(weightInput.value)).not.toBe(newWeight);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	userEvent.selectOptions(colorInput, dummyColorProvider.getRealColorFromName(newColor));
	fireEvent.change(weightInput, { target: { value: newWeight } });
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".CategoryDetailsForm form");
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(mockUserService.createCategory)
			.toHaveBeenCalledWith(dummyScale, catToCreate);
		
		//Check we're now in editing mode
		const categoryDetailsForm = container.querySelector(".CategoryDetailsForm form");
		expect(within(categoryDetailsForm).queryByRole("button", { name: /delete/i })).not.toBeNull();
		expect(container.querySelector(".CategoryDetailsForm header").textContent)
			.toEqual(expect.stringContaining(newName));
	});
	
});

test("CategoryDetailsFormLogicContainer will update existing records with the apiAccessor", async () => {
	
	const newName = "testNewTest";
	const newColor = dummyColorList[1].colorName;
	const newWeight = 13467;
	
	const catToReturn = { 
		id: dummyCategory.id,
		name: newName, 
		color: newColor, 
		desiredWeight: newWeight,
		actions: dummyCategory.actions
	};
	
	const mockUserService = { ...dummyUserService };
	mockUserService.updateCategory = jest.fn().mockResolvedValue(catToReturn);
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={mockUserService}
									categoryColorProvider={dummyColorProvider} />);
	
	
	// ----------- Set the values -----------------
	
	
	const nameInput = screen.getByDisplayValue(dummyCategory.name);
	expect(nameInput.value).not.toBe(newName);
	
	//We can't use getByDisplayValue for selects
	const colorInput = container.querySelector(".CategoryDetailsForm select"); 
	expect(colorInput.value).not.toBe(dummyColorProvider.getRealColorFromName(newColor));
	
	// value shows up too often to use getByDisplayValue
	const weightInput = container.querySelector(".CategoryDetailsForm input[type=number]");
	expect(Number(weightInput.value)).not.toBe(newWeight);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	userEvent.selectOptions(colorInput, dummyColorProvider.getRealColorFromName(newColor));
	fireEvent.change(weightInput, { target: { value: newWeight } });
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".CategoryDetailsForm form");
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(mockUserService.updateCategory)
			.toHaveBeenCalledWith(dummyScale, dummyCategory, catToReturn);
	});
	
});


test("CategoryDetailsFormLogicContainer will change the header after saving an update with name change", async () => {
	
	const newName = "testNewTest";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.updateCategory = jest.fn().mockResolvedValue({ ...dummyCategory, name: newName });
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={mockUserService}
									categoryColorProvider={dummyColorProvider} />);
	
	
	// ----------- Set the values -----------------
	
	
	const nameInput = screen.getByDisplayValue(dummyCategory.name);
	expect(nameInput.value).not.toBe(newName);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".CategoryDetailsForm form");
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(container.querySelector(".CategoryDetailsForm header").textContent)
			.toEqual(expect.stringContaining(newName));
	});
	
});


test("CategoryDetailsFormLogicContainer will display an error message on bad create save", async () => {
	
	const errorMessage = "Unable to save during creating";
	
	const newName = "testNewTest";
	const newColor = dummyColorList[1].colorName;
	const newWeight = 13467;
	
	const mockUserService = { ...dummyUserService };
	mockUserService.createCategory = jest.fn().mockRejectedValue(new Error(errorMessage));
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									backButtonHandler={dummyBackHandler}
									userService={mockUserService}
									categoryColorProvider={dummyColorProvider} />);
	
	
	// ----------- Set the values -----------------
	
	//Can't use getByDisplayValue, as empty string
	const nameInput = container.querySelector(".CategoryDetailsForm input[type=text]");
	expect(nameInput.value).not.toBe(newName);
	
	//We can't use getByDisplayValue for selects
	const colorInput = container.querySelector(".CategoryDetailsForm select"); 
	expect(colorInput.value).not.toBe(dummyColorProvider.getRealColorFromName(newColor));
	
	// value shows up too often to use getByDisplayValue
	const weightInput = container.querySelector(".CategoryDetailsForm input[type=number]");
	expect(Number(weightInput.value)).not.toBe(newWeight);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	userEvent.selectOptions(colorInput, dummyColorProvider.getRealColorFromName(newColor));
	fireEvent.change(weightInput, { target: { value: newWeight } });
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".CategoryDetailsForm form");
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(container.querySelector(".CategoryDetailsForm").textContent)
			.toEqual(expect.stringContaining(errorMessage));
	});
	
});

test("CategoryDetailsFormLogicContainer will display an error message on bad update save", async () => {
	
	const errorMessage = "Unable to save during creating";
	
	const newName = "testNewTest";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.updateCategory = jest.fn().mockRejectedValue(new Error(errorMessage));
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={mockUserService}
									categoryColorProvider={dummyColorProvider} />);
	
	
	// ----------- Set the values -----------------
	
	//Can't use getByDisplayValue, as empty string
	const nameInput = container.querySelector(".CategoryDetailsForm input[type=text]");
	expect(nameInput.value).not.toBe(newName);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".CategoryDetailsForm form");
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(container.querySelector(".CategoryDetailsForm").textContent)
			.toEqual(expect.stringContaining(errorMessage));
	});
	
});

test("CategoryDetailsFormLogicContainer will display a good save message on good create save", async () => {
	
	const message = stdGoodSaveMessage;
	
	const newName = "testNewTest";
	const newColor = dummyColorList[1].colorName;
	const newWeight = 13467;
	
	const catToReturn = { 
		id: "testID",
		name: newName, 
		color: newColor, 
		desiredWeight: newWeight,
		actions: dummyCategory.actions
	};
	
	const mockUserService = { ...dummyUserService };
	mockUserService.createCategory = jest.fn().mockResolvedValue(catToReturn);
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									backButtonHandler={dummyBackHandler}
									userService={mockUserService}
									categoryColorProvider={dummyColorProvider} />);
	
	
	// ----------- Set the values -----------------
	
	//Can't use getByDisplayValue, as empty string
	const nameInput = container.querySelector(".CategoryDetailsForm input[type=text]");
	expect(nameInput.value).not.toBe(newName);
	
	//We can't use getByDisplayValue for selects
	const colorInput = container.querySelector(".CategoryDetailsForm select"); 
	expect(colorInput.value).not.toBe(dummyColorProvider.getRealColorFromName(newColor));
	
	// value shows up too often to use getByDisplayValue
	const weightInput = container.querySelector(".CategoryDetailsForm input[type=number]");
	expect(Number(weightInput.value)).not.toBe(newWeight);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	userEvent.selectOptions(colorInput, dummyColorProvider.getRealColorFromName(newColor));
	fireEvent.change(weightInput, { target: { value: newWeight } });
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".CategoryDetailsForm form");
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(container.querySelector(".CategoryDetailsForm").textContent)
			.toEqual(expect.stringContaining(message));
	});
	
});

test("CategoryDetailsFormLogicContainer will display a good save message on good save", async () => {
	
	const message = stdGoodSaveMessage;
	
	const newName = "testNewTest";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.updateCategory = jest.fn().mockResolvedValue({ ...dummyCategory, name: newName });
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={mockUserService}
									categoryColorProvider={dummyColorProvider} />);
	
	
	// ----------- Set the values -----------------
	
	//Can't use getByDisplayValue, as empty string
	const nameInput = container.querySelector(".CategoryDetailsForm input[type=text]");
	expect(nameInput.value).not.toBe(newName);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".CategoryDetailsForm form");
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(container.querySelector(".CategoryDetailsForm").textContent)
			.toEqual(expect.stringContaining(message));
	});
	
});

test("CategoryDetailsFormLogicContainer will clear good save message after a bad update save", async () => {
	
	const message = stdGoodSaveMessage;
	const errorMessage = "Test error";
	
	const newName = "testNewTest";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.updateCategory = jest.fn().mockResolvedValue({ ...dummyCategory, name: newName });
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={mockUserService}
									categoryColorProvider={dummyColorProvider} />);
	
	
	// ----------- Set the values -----------------
	
	//Can't use getByDisplayValue, as empty string
	const nameInput = container.querySelector(".CategoryDetailsForm input[type=text]");
	expect(nameInput.value).not.toBe(newName);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".CategoryDetailsForm form");
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(container.querySelector(".CategoryDetailsForm").textContent)
			.toEqual(expect.stringContaining(message));
	});
	
	//Now change to reject
	mockUserService.updateCategory = jest.fn().mockRejectedValue(new Error(errorMessage));
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(container.querySelector(".CategoryDetailsForm").textContent)
			.not.toEqual(expect.stringContaining(message));
	});
	
});


test("CategoryDetailsFormLogicContainer will clear error save message after a good create save", async () => {
	
	const errorMessage = "Test error";
	
	const newName = "testNewTest";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.createCategory = jest.fn().mockRejectedValue(new Error(errorMessage));
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									backButtonHandler={dummyBackHandler}
									userService={mockUserService}
									categoryColorProvider={dummyColorProvider} />);
	
	
	// ----------- Set the values -----------------
	
	//Can't use getByDisplayValue, as empty string
	const nameInput = container.querySelector(".CategoryDetailsForm input[type=text]");
	expect(nameInput.value).not.toBe(newName);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".CategoryDetailsForm form");
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(container.querySelector(".CategoryDetailsForm").textContent)
			.toEqual(expect.stringContaining(errorMessage));
	});
	
	//Now change to reject (in editing mode)
	mockUserService.createCategory = jest.fn().mockResolvedValue({ ...dummyCategory, name: newName });
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(container.querySelector(".CategoryDetailsForm").textContent)
			.not.toEqual(expect.stringContaining(errorMessage));
	});
	
});

test("CategoryDetailsFormLogicContainer will clear error save message after a good update save", async () => {
	
	const errorMessage = "Test error";
	
	const newName = "testNewTest";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.updateCategory = jest.fn().mockRejectedValue(new Error(errorMessage));
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={mockUserService}
									categoryColorProvider={dummyColorProvider} />);
	
	
	// ----------- Set the values -----------------
	
	//Can't use getByDisplayValue, as empty string
	const nameInput = container.querySelector(".CategoryDetailsForm input[type=text]");
	expect(nameInput.value).not.toBe(newName);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".CategoryDetailsForm form");
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(container.querySelector(".CategoryDetailsForm").textContent)
			.toEqual(expect.stringContaining(errorMessage));
	});
	
	//Now change to reject
	mockUserService.updateCategory = jest.fn().mockResolvedValue({ ...dummyCategory, name: newName });
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(container.querySelector(".CategoryDetailsForm").textContent)
			.not.toEqual(expect.stringContaining(errorMessage));
	});
	
});



test("CategoryDetailsFormLogicContainer will disable submit button when creating, then re-enable when done", async () => {
	
	const newName = "testNewTest";
	const newColor = dummyColorList[1].colorName;
	const newWeight = 13467;
	
	const catToReturn = { 
		id: "testID",
		name: newName, 
		color: newColor, 
		desiredWeight: newWeight,
		actions: dummyCategory.actions
	};
	
	
	const mockUserService = { ...dummyUserService };
	mockUserService.createCategory = jest.fn().mockResolvedValue(catToReturn);
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									backButtonHandler={dummyBackHandler}
									userService={mockUserService}
									categoryColorProvider={dummyColorProvider} />);
	
	
	// ----------- Set the values -----------------
	
	//Can't use getByDisplayValue, as empty string
	const nameInput = container.querySelector(".CategoryDetailsForm input[type=text]");
	expect(nameInput.value).not.toBe(newName);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".CategoryDetailsForm form");
	const submitButton = container.querySelector(".CategoryDetailsForm form input[type=submit]");
	expect(submitButton).not.toBeDisabled();
	
	fireEvent.submit(form);
	
	expect(submitButton).toBeDisabled();
	
	//Re-enable
	await waitFor(() => {
		expect(submitButton).not.toBeDisabled();
	});
	
});

test("CategoryDetailsFormLogicContainer will disable submit button when updating, then re-enable when done", async () => {
	
	const newName = "testNewTest";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.updateCategory = jest.fn().mockResolvedValue({ ...dummyCategory, name: newName });
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={mockUserService}
									categoryColorProvider={dummyColorProvider} />);
	
	
	// ----------- Set the values -----------------
	
	//Can't use getByDisplayValue, as empty string
	const nameInput = container.querySelector(".CategoryDetailsForm input[type=text]");
	expect(nameInput.value).not.toBe(newName);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".CategoryDetailsForm form");
	const submitButton = container.querySelector(".CategoryDetailsForm form input[type=submit]");
	expect(submitButton).not.toBeDisabled();
	
	fireEvent.submit(form);
	
	expect(submitButton).toBeDisabled();
	
	//Re-enable
	await waitFor(() => {
		expect(submitButton).not.toBeDisabled();
	});
	
});

test("CategoryDetailsFormLogicContainer will re-enable submit button after a error during create", async () => {
	
	const newName = "testNewTest";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.createCategory = jest.fn().mockRejectedValue(new Error("error"));
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									backButtonHandler={dummyBackHandler}
									userService={mockUserService}
									categoryColorProvider={dummyColorProvider} />);
	
	
	// ----------- Set the values -----------------
	
	//Can't use getByDisplayValue, as empty string
	const nameInput = container.querySelector(".CategoryDetailsForm input[type=text]");
	expect(nameInput.value).not.toBe(newName);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".CategoryDetailsForm form");
	const submitButton = container.querySelector(".CategoryDetailsForm form input[type=submit]");
	
	fireEvent.submit(form);
	
	//Re-enable
	await waitFor(() => {
		expect(submitButton).not.toBeDisabled();
	});
	
});

test("CategoryDetailsFormLogicContainer will re-enable submit button after a error during update", async () => {
	
	const newName = "testNewTest";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.updateCategory = jest.fn().mockRejectedValue(new Error("error"));
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={mockUserService}
									categoryColorProvider={dummyColorProvider} />);
	
	
	// ----------- Set the values -----------------
	
	//Can't use getByDisplayValue, as empty string
	const nameInput = container.querySelector(".CategoryDetailsForm input[type=text]");
	expect(nameInput.value).not.toBe(newName);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	
	
	// ---------- Now save it -----------------
	
	const form = container.querySelector(".CategoryDetailsForm form");
	const submitButton = container.querySelector(".CategoryDetailsForm form input[type=submit]");
	
	fireEvent.submit(form);
	
	//Re-enable
	await waitFor(() => {
		expect(submitButton).not.toBeDisabled();
	});
	
});





test("CategoryDetailsFormLogicContainer will use userService deleteCategory method to delete (passing original category)", async () => {
	
	const mockUserService = { ...dummyUserService };
	
	//so no delete buttons displayed for actions
	mockUserService.getCategory = (catID, scaleID) => dummyCategoryNoActions;
	mockUserService.deleteCategory = jest.fn().mockResolvedValue([]);
	
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={mockUserService}
									categoryColorProvider={dummyColorProvider} />);
	
	
	//Just change the name, to make sure we're not passing changed category to delete handler
	const newName = "testNewTest";
	const nameInput = screen.getByDisplayValue(dummyCategoryNoActions.name);
	expect(nameInput.value).not.toBe(newName);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	
	
	const deleteButton = screen.getByRole("button", { name: /delete/i });
	
	fireEvent.click(deleteButton);
	
	
	await waitFor(() => {
		expect(mockUserService.deleteCategory).toHaveBeenCalledWith(dummyScale, dummyCategoryNoActions);
	});
	
});

test("CategoryDetailsFormLogicContainer will use display error if bad save during delete", async () => {
	
	const errorMessage = "test error on delete";
	
	const mockUserService = { ...dummyUserService };
	
	//so no delete buttons displayed for actions
	mockUserService.getCategory = (catID, scaleID) => dummyCategoryNoActions;
	mockUserService.deleteCategory = jest.fn().mockRejectedValue(new Error(errorMessage));
	
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={mockUserService}
									categoryColorProvider={dummyColorProvider} />);
	
	
	const deleteButton = screen.getByRole("button", { name: /delete/i });
	
	fireEvent.click(deleteButton);
	
	await waitFor(() => {
		expect(container.querySelector(".CategoryDetailsForm").textContent)
			.toEqual(expect.stringContaining(errorMessage));
	});
	
});

test("CategoryDetailsFormLogicContainer will call onSuccessfulDeleteHandler after successful delete", async () => {
	
	const mockUserService = { ...dummyUserService };
	
	//so no delete buttons displayed for actions
	mockUserService.getCategory = (catID, scaleID) => dummyCategoryNoActions;
	mockUserService.deleteCategory = jest.fn().mockResolvedValue([]);
	
	
	const mockDeleteCallback = jest.fn();
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={mockUserService}
									onSuccessfulDeleteHandler={mockDeleteCallback}
									categoryColorProvider={dummyColorProvider} />);
	
	
	const deleteButton = screen.getByRole("button", { name: /delete/i });
	
	fireEvent.click(deleteButton);
	
	await waitFor(() => {
		expect(mockDeleteCallback).toHaveBeenCalled();
	});
	
});


test("CategoryDetailsFormLogicContainer will call userService abortRequests method on unmount", () => {
	
	const mockUserService = { ...dummyUserService };
	mockUserService.abortRequests = jest.fn();
	
	const { container, unmount } = render(<CategoryDetailsFormLogicContainer
		scaleID={dummyScale.id}
		categoryID={dummyCategory.id}
		backButtonHandler={dummyBackHandler}
		userService={mockUserService}
		categoryColorProvider={dummyColorProvider} />);
	
	
	unmount();
	
	expect(mockUserService.abortRequests).toHaveBeenCalled();
	
});
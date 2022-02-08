import ActionsFormLogicContainer from './ActionsFormLogicContainer';
import { render, fireEvent, waitFor, screen, within } from '@testing-library/react';
import TestingDummyUserService from '../../userServices/TestingDummyUserService/TestingDummyUserService';

const dummyCategory = {
	id: "testcat",
	name: "test-category",
	color: "red",
	desiredWeight: 1,
	actions: [
		{
			id: "testact1",
			name: "test-action-1",
			weight: 1,
			timespans: []
		},
		{
			id: "testact2",
			name: "test-action-2",
			weight: 2,
			timespans: []
		},
		{
			id: "testact3",
			name: "test-action-3",
			weight: 3,
			timespans: []
		}
	]
};

const dummyCategoryNoActions = {
	...dummyCategory,
	actions: []
};

const dummyScale = {
	id: "testscale",
	name: "test-scale",
	usesTimespans: false,
	displayDayCount: 7,
	categories: [dummyCategory]
};


const dummyUserService = new TestingDummyUserService();
dummyUserService.getCategory = (catID, scaleID) => dummyCategory;



test("ActionsFormLogicContainer will render a ActionsForm", () => {
	
	const { container } = render(<ActionsFormLogicContainer
									userService={dummyUserService}
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id} />)
	
	expect(container.querySelector(".ActionsForm")).not.toBeNull();
	
});


test("ActionsFormLogicContainer will load the categories with the correct scale/category ids", () => {
	
	const mockUserService = { ...dummyUserService };
	mockUserService.getCategory = jest.fn();
	
	const { container } = render(<ActionsFormLogicContainer
									userService={mockUserService}
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id} />)
	
	expect(mockUserService.getCategory).toHaveBeenCalledWith(dummyCategory.id, dummyScale.id);
	
});

test("ActionsFormLogicContainer will load the category and display the actions as SingleActionForm", () => {
	
	const { container } = render(<ActionsFormLogicContainer
									userService={dummyUserService}
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id} />);
	
	const singleActionForms = container.querySelectorAll(".SingleActionForm");
	expect(singleActionForms.length).toBe(dummyCategory.actions.length);
	
	dummyCategory.actions.forEach(
		(act, i) => expect(within(singleActionForms[i]).getByDisplayValue(act.name)).not.toBeNull()
	);
	
});


test("ActionsFormLogicContainer will handle the state of the actions", () => {
	
	const newNames = dummyCategory.actions.map(act => act.name + "new");
	const newWeights = dummyCategory.actions.map(act => act.weight + 10);
	
	const { container } = render(<ActionsFormLogicContainer
									userService={dummyUserService}
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id} />)
	
	
	const singleActionForms = container.querySelectorAll(".SingleActionForm");
	expect(singleActionForms.length).toBe(dummyCategory.actions.length);
	
	dummyCategory.actions.forEach((act, i) => {
		const nameInput = within(singleActionForms[i]).getByDisplayValue(act.name);
		const weightInput = within(singleActionForms[i]).getByDisplayValue(act.weight);
		
		fireEvent.change(nameInput, { target: { value: newNames[i] } });
		expect(nameInput.value).toEqual(newNames[i]);
		
		fireEvent.change(weightInput, { target: { value: newWeights[i] } });
		expect(Number(weightInput.value)).toEqual(newWeights[i]);
	});
	
});


test("ActionsFormLogicContainer will give the current actions delete handlers", () => {
	
	const mockUserService = { ...dummyUserService };
	mockUserService.deleteAction = jest.fn().mockResolvedValue([]);
	
	const { container } = render(<ActionsFormLogicContainer
									userService={mockUserService}
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id} />)
	
	const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
	expect(deleteButtons.length).toBe(dummyCategory.actions.length);
	
	dummyCategory.actions.forEach((act, i) => {
		fireEvent.click(deleteButtons[i]);
		expect(mockUserService.deleteAction).toHaveBeenCalledWith(dummyCategory, dummyCategory.actions[i]);
	});
	
});

test("ActionsFormLogicContainer will give the current actions submit handlers", () => {
	
	const newName = "testChange";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.updateAction = jest.fn().mockResolvedValue(dummyCategory.actions[0]);
	
	const { container } = render(<ActionsFormLogicContainer
									userService={mockUserService}
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id} />)
	
	const forms = container.querySelectorAll(".SingleActionForm form");
	expect(forms.length).toBe(dummyCategory.actions.length);
	
	forms.forEach((form, i) => {
		const action = dummyCategory.actions[i];
		
		const nameInput = within(form).getByDisplayValue(action.name);
		fireEvent.change(nameInput, { target: { value: newName } });
		
		fireEvent.submit(form);
		expect(mockUserService.updateAction).toHaveBeenCalledWith(action, {
			...action,
			name: newName
		});
	});
	
});



test("ActionsFormLogicContainer will refresh the actions list after a delete", async () => {
	
	const mockUserService = { ...dummyUserService };
	mockUserService.deleteAction = jest.fn().mockResolvedValue([]);
	mockUserService.getCategory = jest.fn().mockReturnValue(dummyCategory);
	
	const { container } = render(<ActionsFormLogicContainer
									userService={mockUserService}
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id} />)
	
	
	const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
	const actionForms = container.querySelectorAll(".SingleActionForm");
	expect(actionForms.length).toBe(dummyCategory.actions.length);
	
	//Change the getCategory to not include the first action
	mockUserService.getCategory = jest.fn().mockReturnValue({ 
		...dummyCategory, 
		actions: dummyCategory.actions.slice(1)
	});
	
	
	fireEvent.click(deleteButtons[0]);
	
	await waitFor(() => {
		const actionForms2 = container.querySelectorAll(".SingleActionForm");
		expect(actionForms2.length).toBe(dummyCategory.actions.length - 1);
	});
	
});



test("ActionsFormLogicContainer will pass in a badSaveErrorMessage if an error during delete", async () => {
	
	const errorMessage = "Unable to delete action";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.deleteAction = jest.fn().mockRejectedValue(new Error(errorMessage));
	mockUserService.getCategory = jest.fn().mockReturnValue({ 
		...dummyCategory, 
		actions: [dummyCategory.actions[0]] // just get one
	});
	
	const { container } = render(<ActionsFormLogicContainer
									userService={mockUserService}
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id} />)
	
	
	const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
	
	fireEvent.click(deleteButtons[0]);
	
	await waitFor(() => {
		const actionForms = container.querySelectorAll(".SingleActionForm");
		expect(actionForms[0].textContent).toEqual(expect.stringContaining(errorMessage));
	});
	
});

test("ActionsFormLogicContainer will pass in a badSaveErrorMessage if an error during update", async () => {
	
	const errorMessage = "Unable to update action";
	const action = dummyCategory.actions[0];
	
	const mockUserService = { ...dummyUserService };
	mockUserService.updateAction = jest.fn().mockRejectedValue(new Error(errorMessage));
	mockUserService.getCategory = jest.fn().mockReturnValue({ 
		...dummyCategory, 
		actions: [action] // just get one
	});
	
	const { container } = render(<ActionsFormLogicContainer
									userService={mockUserService}
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id} />)
	
	
	const nameInput = screen.getByDisplayValue(action.name);
	fireEvent.change(nameInput, { target: { value: action.name + "testchange" } });
	
	
	const forms = container.querySelectorAll(".SingleActionForm form");
	fireEvent.submit(forms[0]);
	
	
	await waitFor(() => {
		const actionForms = container.querySelectorAll(".SingleActionForm");
		expect(actionForms[0].textContent).toEqual(expect.stringContaining(errorMessage));
	});
	
});


test("ActionsFormLogicContainer will pass in a goodSaveMessage after successful update", async () => {
	
	const message = "Action Saved Successfully.";
	const action = { ...dummyCategory.actions[0] };
	const newName = "testChange";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.updateAction = jest.fn().mockResolvedValue({ ...action, name: newName });
	mockUserService.getCategory = jest.fn().mockReturnValue({ 
		...dummyCategory, 
		actions: [action] // just get one
	});
	
	const { container } = render(<ActionsFormLogicContainer
									userService={mockUserService}
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id} />)
	
	
	const nameInput = screen.getByDisplayValue(action.name);
	fireEvent.change(nameInput, { target: { value: newName } });
	
	
	const forms = container.querySelectorAll(".SingleActionForm form");
	fireEvent.submit(forms[0]);
	
	
	await waitFor(() => {
		const actionForms = container.querySelectorAll(".SingleActionForm");
		expect(actionForms[0].textContent).toEqual(expect.stringContaining(message));
	});
	
});


test("ActionsFormLogicContainer will not call onCategoryLoadError prop if no error", () => {
	
	const mockCallback = jest.fn();
	
	render(<ActionsFormLogicContainer
				userService={dummyUserService}
				scaleID={dummyScale.id}
				categoryID={dummyCategory.id}
				onCategoryLoadError={mockCallback} />);
	
	expect(mockCallback).not.toHaveBeenCalled();
	
});

test("ActionsFormLogicContainer will call onCategoryLoadError prop if issue getting categories", () => {
	
	const mockCallback = jest.fn();
	
	const mockUserService = { ...dummyUserService };
	mockUserService.getCategory = jest.fn().mockReturnValue(undefined);
	
	render(<ActionsFormLogicContainer
		userService={mockUserService}
		scaleID={dummyScale.id}
		categoryID={dummyCategory.id}
		onCategoryLoadError={mockCallback} />);
	
	expect(mockCallback).toHaveBeenCalled();
	
});




// ----- New action form -------------------------------------------------


test("ActionsFormLogicContainer will handle the state of the new action form", () => {
	
	const mockUserService = { ...dummyUserService };
	mockUserService.getCategory = (catID, scaleID) => dummyCategoryNoActions;
	
	const newName = "testNameChange";
	const newWeight = 150;
	
	const { container } = render(<ActionsFormLogicContainer
									userService={mockUserService}
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id} />);
	
	const addButton = screen.getByRole("button", { name: /new/i });
	fireEvent.click(addButton)
	
	const actionForms = container.querySelectorAll(".SingleActionForm form");
	expect(actionForms.length).toBe(1);
	
	const nameInput = container.querySelector("input[type=text]");
	expect(nameInput.value).not.toBe(newName);
	const weightInput = container.querySelector("input[type=number]");
	expect(weightInput.value).not.toBe(newWeight);
	
	fireEvent.change(nameInput, { target: { value: newName } });
	fireEvent.change(weightInput, { target: { value: newWeight } });
	
	expect(nameInput.value).toBe(newName);
	expect(Number(weightInput.value)).toBe(newWeight);
	
});


test("ActionsFormLogicContainer will not pass a delete handler to the new action form", () => {
	
	const mockUserService = { ...dummyUserService };
	mockUserService.getCategory = (catID, scaleID) => dummyCategoryNoActions;
	
	const { container } = render(<ActionsFormLogicContainer
									userService={mockUserService}
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id} />);
	
	const addButton = screen.getByRole("button", { name: /new/i });
	fireEvent.click(addButton)
	
	const actionForms = container.querySelectorAll(".SingleActionForm form");
	expect(actionForms.length).toBe(1);
	
	expect(within(actionForms[0]).queryByRole("button", { name: /delete/i })).toBeNull();
	
});


test("ActionsFormLogicContainer will give the new action a submit handler that creates", () => {
	
	const newAction = {
		name: "testNameChange",
		weight: 150,
		timespans: []
	};
	
	const mockUserService = { ...dummyUserService };
	mockUserService.getCategory = (catID, scaleID) => dummyCategoryNoActions;
	mockUserService.createAction = jest.fn().mockResolvedValue({ ...newAction, id: "testID" });
	
	const { container } = render(<ActionsFormLogicContainer
									userService={mockUserService}
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id} />)
	
	const addButton = screen.getByRole("button", { name: /new/i });
	fireEvent.click(addButton)
	
	const actionForms = container.querySelectorAll(".SingleActionForm form");
	expect(actionForms.length).toBe(1);
	
	const nameInput = container.querySelector("input[type=text]");
	expect(nameInput.value).not.toBe(newAction.name);
	const weightInput = container.querySelector("input[type=number]");
	expect(weightInput.value).not.toBe(newAction.weight);
	
	fireEvent.change(nameInput, { target: { value: newAction.name } });
	fireEvent.change(weightInput, { target: { value: newAction.weight } });
	
	fireEvent.submit(actionForms[0]);
	
	expect(mockUserService.createAction).toHaveBeenCalledWith(dummyCategoryNoActions, newAction);
	
});

test("ActionsFormLogicContainer will refresh the actions list after a create", async () => {
	
	const newAction = {
		name: "testNameChange",
		weight: 150,
		timespans: []
	};
	const newActionID = "testID";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.getCategory = (catID, scaleID) => dummyCategoryNoActions;
	mockUserService.createAction = jest.fn().mockResolvedValue({ ...newAction, id: newActionID });
	
	
	const { container } = render(<ActionsFormLogicContainer
									userService={mockUserService}
									scaleID={dummyScale.id}
									categoryID={dummyCategory.id} />)
	
	const addButton = screen.getByRole("button", { name: /new/i });
	fireEvent.click(addButton)
	
	
	const actionForms = container.querySelectorAll(".SingleActionForm form");
	expect(actionForms.length).toBe(1); //extra is the create form
	
	
	const nameInput = container.querySelector("input[type=text]");
	expect(nameInput.value).not.toBe(newAction.name);
	const weightInput = container.querySelector("input[type=number]");
	expect(weightInput.value).not.toBe(newAction.weight);
	
	fireEvent.change(nameInput, { target: { value: newAction.name } });
	fireEvent.change(weightInput, { target: { value: newAction.weight } });
	
	//We should be displaying the 
	mockUserService.getCategory = (catID, scaleID) => { 
		return { dummyCategoryNoActions, actions: [{ ...newAction, id: newActionID }] } 
	};
	
	fireEvent.submit(actionForms[0]);
	
	await waitFor(() => expect(container.querySelectorAll(".SingleActionForm").length).toBe(2));
	
});


// good save message on new action

// badSaveMessage

// hides actions form after save
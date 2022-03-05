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
dummyUserService.abortRequests = ()=>{}; // had to define explicitly


test("ActionsFormLogicContainer will render a ActionsForm", () => {
	
	const { container } = render(<ActionsFormLogicContainer
									userService={dummyUserService}
									scale={dummyScale}
									category={dummyCategory} />)
	
	expect(container.querySelector(".ActionsForm")).not.toBeNull();
	
});

test("ActionsFormLogicContainer will set the ActionsForm to display the new action form, after clicking the add new button", () => {
	
	const { container } = render(<ActionsFormLogicContainer
									userService={dummyUserService}
									scale={dummyScale}
									category={dummyCategoryNoActions} />)
	
	
	expect(container.querySelector(".SingleActionForm")).toBeNull();
	
	const addButton = screen.getByRole("button", { name: /new/i });
	fireEvent.click(addButton);
	
	expect(screen.queryByRole("button", { name: /new/i })).toBeNull();
	expect(container.querySelectorAll(".SingleActionForm").length).toBe(1);
	
});



test("ActionsFormLogicContainer will load the category and display the actions as SingleActionForm", () => {
	
	const { container } = render(<ActionsFormLogicContainer
									userService={dummyUserService}
									scale={dummyScale}
									category={dummyCategory} />);
	
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
									scale={dummyScale}
									category={dummyCategory} />)
	
	
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
									scale={dummyScale}
									category={dummyCategory} />)
	
	const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
	expect(deleteButtons.length).toBe(dummyCategory.actions.length);
	
	dummyCategory.actions.forEach((act, i) => {
		fireEvent.click(deleteButtons[i]);
		expect(mockUserService.deleteAction).toHaveBeenCalledWith(dummyScale, dummyCategory, dummyCategory.actions[i]);
	});
	
});

test("ActionsFormLogicContainer will give the current actions submit handlers", () => {
	
	const newName = "testChange";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.updateAction = jest.fn().mockResolvedValue(dummyCategory.actions[0]);
	
	const { container } = render(<ActionsFormLogicContainer
									userService={mockUserService}
									scale={dummyScale}
									category={dummyCategory} />)
	
	const forms = container.querySelectorAll(".SingleActionForm form");
	expect(forms.length).toBe(dummyCategory.actions.length);
	
	forms.forEach((form, i) => {
		const action = dummyCategory.actions[i];
		
		const nameInput = within(form).getByDisplayValue(action.name);
		fireEvent.change(nameInput, { target: { value: newName } });
		
		fireEvent.submit(form);
		expect(mockUserService.updateAction).toHaveBeenCalledWith(dummyScale, dummyCategory, action, {
			...action,
			name: newName
		});
	});
	
});



test("ActionsFormLogicContainer will refresh the actions list after a delete", async () => {
	
	const mockUserService = { ...dummyUserService };
	mockUserService.deleteAction = jest.fn().mockResolvedValue([]);
	
	let mockCategory = { ...dummyCategory };
	
	const { container } = render(<ActionsFormLogicContainer
									userService={mockUserService}
									scale={dummyScale}
									category={mockCategory} />)
	
	
	const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
	const actionForms = container.querySelectorAll(".SingleActionForm");
	expect(actionForms.length).toBe(dummyCategory.actions.length);
	
	//Change the category to not include any actions (so we know they're getting refreshed)
	mockCategory.actions = [];
	
	
	fireEvent.click(deleteButtons[0]);
	
	await waitFor(() => {
		const actionForms2 = container.querySelectorAll(".SingleActionForm");
		expect(actionForms2.length).toBe(0);
	});
	
});



test("ActionsFormLogicContainer will pass in a badSaveErrorMessage if an error during delete", async () => {
	
	const errorMessage = "Unable to delete action";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.deleteAction = jest.fn().mockRejectedValue(new Error(errorMessage));
	
	const { container } = render(<ActionsFormLogicContainer
									userService={mockUserService}
									scale={dummyScale}
									category={dummyCategory} />)
	
	
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
	
	const { container } = render(<ActionsFormLogicContainer
									userService={mockUserService}
									scale={dummyScale}
									category={dummyCategory} />)
	
	
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
	
	const { container } = render(<ActionsFormLogicContainer
									userService={mockUserService}
									scale={dummyScale}
									category={dummyCategory} />)
	
	
	const nameInput = screen.getByDisplayValue(action.name);
	fireEvent.change(nameInput, { target: { value: newName } });
	
	
	const forms = container.querySelectorAll(".SingleActionForm form");
	fireEvent.submit(forms[0]);
	
	
	await waitFor(() => {
		const actionForms = container.querySelectorAll(".SingleActionForm");
		expect(actionForms[0].textContent).toEqual(expect.stringContaining(message));
	});
	
});




// ----- New action form -------------------------------------------------


test("ActionsFormLogicContainer will handle the state of the new action form", () => {
	
	const newName = "testNameChange";
	const newWeight = 150;
	
	const { container } = render(<ActionsFormLogicContainer
									userService={dummyUserService}
									scale={dummyScale}
									category={dummyCategoryNoActions} />);
	
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
	
	const { container } = render(<ActionsFormLogicContainer
									userService={dummyUserService}
									scale={dummyScale}
									category={dummyCategoryNoActions} />);
	
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
	mockUserService.createAction = jest.fn().mockResolvedValue({ ...newAction, id: "testID" });
	
	const { container } = render(<ActionsFormLogicContainer
									userService={mockUserService}
									scale={dummyScale}
									category={dummyCategoryNoActions} />)
	
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
	
	expect(mockUserService.createAction).toHaveBeenCalledWith(dummyScale, dummyCategoryNoActions, newAction);
	
});

test("ActionsFormLogicContainer will refresh the actions list after a create", async () => {
	
	const newAction = {
		name: "testNameChange",
		weight: 150,
		timespans: []
	};
	const newActionID = "testID";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.createAction = jest.fn().mockResolvedValue({ ...newAction, id: newActionID });
	
	let mockCategory = { ...dummyCategory, actions: [] };
	
	const { container } = render(<ActionsFormLogicContainer
									userService={mockUserService}
									scale={dummyScale}
									category={mockCategory} />)
	
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
	
	
	mockCategory = { ...dummyCategory, actions: [{ ...newAction, id: newActionID }] };
	
	fireEvent.submit(actionForms[0]);
	
	//If this fails, make sure the functionality that hides the new action form on save is working
	await waitFor(() => expect(container.querySelectorAll(".SingleActionForm").length).toBe(1));
	
});

test("ActionsFormLogicContainer will pass a badSaveErrorMessage to new action if problem saving", async () => {
	
	const errorMessage = "test error message";
	
	const newAction = {
		name: "testNameChange",
		weight: 150,
		timespans: []
	};
	
	const mockUserService = { ...dummyUserService };
	mockUserService.createAction = jest.fn().mockRejectedValue(new Error(errorMessage));
	
	
	const { container } = render(<ActionsFormLogicContainer
									userService={mockUserService}
									scale={dummyScale}
									category={dummyCategoryNoActions} />)
	
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
	
	await waitFor(
		() => expect(container.querySelectorAll(".SingleActionForm")[0].textContent)
				.toEqual(expect.stringContaining(errorMessage))
	);
	
});


test("ActionsFormLogicContainer will not display the new actions form after a create", async () => {
	
	const newAction = {
		name: "testNameChange",
		weight: 150,
		timespans: []
	};
	const newActionID = "testID";
	
	const mockUserService = { ...dummyUserService };
	mockUserService.createAction = jest.fn().mockResolvedValue({ ...newAction, id: newActionID });
	
	
	const { container } = render(<ActionsFormLogicContainer
									userService={mockUserService}
									scale={dummyScale}
									category={dummyCategoryNoActions} />)
	
	const addButton = screen.getByRole("button", { name: /new/i });
	fireEvent.click(addButton)
	
	
	const actionForms = container.querySelectorAll(".SingleActionForm form");
	expect(actionForms.length).toBe(1); // new action form
	
	
	const nameInput = container.querySelector("input[type=text]");
	expect(nameInput.value).not.toBe(newAction.name);
	const weightInput = container.querySelector("input[type=number]");
	expect(weightInput.value).not.toBe(newAction.weight);
	
	fireEvent.change(nameInput, { target: { value: newAction.name } });
	fireEvent.change(weightInput, { target: { value: newAction.weight } });
	
	
	fireEvent.submit(actionForms[0]);
	
	// still returning no actions, so no existing action forms to display either
	await waitFor(() => expect(container.querySelectorAll(".SingleActionForm").length).toBe(0));
	
});


test("ActionsFormLogicContainer will call userService abortRequests method on unmount", () => {
	
	const mockUserService = { ...dummyUserService };
	mockUserService.abortRequests = jest.fn();
	
	const { container, unmount } = render(<ActionsFormLogicContainer
		userService={mockUserService}
		scale={dummyScale}
		category={dummyCategoryNoActions} />);
	
	
	unmount();
	
	expect(mockUserService.abortRequests).toHaveBeenCalled();
	
});
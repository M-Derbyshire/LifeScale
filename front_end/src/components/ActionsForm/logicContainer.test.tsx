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

// delete error message

// save message on save

// onCategoryLoadError prop
// - for category load
// - for accessing actions

// new action stuff
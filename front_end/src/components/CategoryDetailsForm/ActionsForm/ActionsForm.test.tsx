import ActionsForm from './ActionsForm';
import { render, fireEvent, screen, within } from '@testing-library/react';


const dummySetState = (x)=>{};
const dummySubmit = ()=>{};
const dummySetDisplayAddForm = ()=>{};

const dummyActions = [{
	id:"test1",
	name: "test1",
	setName: dummySetState,
	weight: 2,
	setWeight: dummySetState,
	onSubmit: dummySubmit,
	onDelete: dummySubmit,
	goodSaveMessage: "test good message 1",
	badSaveErrorMessage: "test bad message 1"
}, {
	id: "test2",
	name: "test2",
	setName: dummySetState,
	weight: 3,
	setWeight: dummySetState,
	onSubmit: dummySubmit,
	onDelete: dummySubmit,
	goodSaveMessage: "test good message 2",
	badSaveErrorMessage: "test bad message 2"
}];

test.each([
	["MockNewAction1"],
	["MockNewAction2"]
])("ActionsForm will display a SingleActionForm with the given new action data, and not the add new action button, when the displayNewActionForm prop is true", (name) => {
	
	const mockNewAction = {
		name,
		setName: dummySetState,
		weight: 5,
		setWeight: dummySetState,
		onSubmit: dummySubmit,
		onDelete: dummySubmit
	};
	
	const { container } = render(<ActionsForm 
									actions={[]} 
									newAction={mockNewAction} 
									displayNewActionForm={true}
									setDisplayNewActionForm={dummySetDisplayAddForm} />);
	
	expect(screen.queryByRole("button", { name: /new/i })).toBeNull();
	
	//No actions passed in, so should be the only one
	const actionsForm = container.querySelector(".SingleActionForm");
	
	expect(actionsForm).not.toBeNull();
	expect(screen.getByDisplayValue(name)).not.toBeNull();
});

test("ActionsForm will render the new action button, if displayNewActionForm is false", () => {
	
	const mockNewAction = {
		name: "test",
		setName: dummySetState,
		weight: 5,
		setWeight: dummySetState,
		onSubmit: dummySubmit,
		onDelete: dummySubmit
	};
	
	const { container } = render(<ActionsForm 
									actions={[]} 
									newAction={mockNewAction} 
									displayNewActionForm={false}
									setDisplayNewActionForm={dummySetDisplayAddForm} />);
	
	
	expect(screen.queryByRole("button", { name: /new/i })).not.toBeNull();
	
	//No actions passed in, so shouldn't be one
	const actionsForm = container.querySelector(".SingleActionForm");
	expect(actionsForm).toBeNull();
});

test("ActionsForm will pass the setDisplayNewActionForm prop to the new action button as onClick", () => {
	
	const mockNewAction = {
		name: "test",
		setName: dummySetState,
		weight: 5,
		setWeight: dummySetState,
		onSubmit: dummySubmit,
		onDelete: dummySubmit
	};
	
	const mockCallback = jest.fn();
	
	const { container } = render(<ActionsForm 
									actions={[]} 
									newAction={mockNewAction} 
									displayNewActionForm={false} 
									setDisplayNewActionForm={mockCallback} />);
	
	
	const addButton = screen.queryByRole("button", { name: /new/i })
	fireEvent.click(addButton);
	
	expect(mockCallback).toHaveBeenCalledWith(true);
	
});


test("ActionsForm will render SingleActionForm components for each passed in action", () => {
	
	const { container } = render(<ActionsForm 
									actions={dummyActions} 
									newAction={dummyActions[0]}
									setDisplayNewActionForm={dummySetDisplayAddForm} />);
	
	const actionForms = container.querySelectorAll(".SingleActionForm");
	
	expect(actionForms.length).toBe(dummyActions.length);
	dummyActions.forEach((action, index) => {
		expect(screen.getByDisplayValue(action.name)).not.toBeNull();
		expect(screen.getByDisplayValue(action.weight.toString())).not.toBeNull();
		expect(screen.getByText(action.badSaveErrorMessage)).not.toBeNull();
		expect(screen.getByText(action.goodSaveMessage)).not.toBeNull();
	});
	
});


test("ActionsForm will pass the SingleActionForm an onDelete prop, if the action has one", () => {
	
	const action = { ...dummyActions[0], onDelete: jest.fn() };
	
	const { container } = render(<ActionsForm 
									actions={[action]} 
									newAction={dummyActions[0]}
									setDisplayNewActionForm={dummySetDisplayAddForm} />);
	
	const actionForm = container.querySelector(".SingleActionForm");
	const deleteButton = within(actionForm).queryByRole("button", { name: /delete/i });
	
	expect(deleteButton).not.toBeNull();
	
	fireEvent.click(deleteButton);
	
	expect(action.onDelete).toHaveBeenCalled();
	
});

test("ActionsForm will not pass the SingleActionForm an onDelete prop, if the action doesn't have one", () => {
	
	const action = [{ ...dummyActions[0], onDelete: undefined }];
	
	const { container } = render(<ActionsForm 
									actions={[action]} 
									newAction={dummyActions[0]}
									setDisplayNewActionForm={dummySetDisplayAddForm} />);
	
	const actionForm = container.querySelector(".SingleActionForm");
	const deleteButton = within(actionForm).queryAllByRole("button", { name: /delete/i });
	
	expect(deleteButton.length).toBe(0);
	
});


test("ActionsForm will pass the SingleActionForm an onSubmit prop", () => {
	
	const action = { ...dummyActions[0], onSubmit: jest.fn() };
	
	const { container } = render(<ActionsForm 
									actions={[action]} 
									newAction={dummyActions[0]}
									setDisplayNewActionForm={dummySetDisplayAddForm} />);
	
	const form = container.querySelector(".SingleActionForm form");
	
	fireEvent.submit(form);
	
	expect(action.onSubmit).toHaveBeenCalled();
	
});
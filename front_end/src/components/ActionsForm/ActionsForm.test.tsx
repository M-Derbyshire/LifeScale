import ActionsForm from './ActionsForm';
import { render, fireEvent, screen, within } from '@testing-library/react';


const dummySetState = (x)=>{};
const dummySubmit = ()=>{};

const dummyActions = [{
	name: "test1",
	setName: dummySetState,
	weight: 2,
	setWeight: dummySetState,
	onSubmit: dummySubmit,
	onDelete: dummySubmit,
	goodSaveMessage: "test good message 1",
	badSaveErrorMessage: "test bad message 1"
}, {
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
])("ActionsForm will display a SingleActionForm with the given new action data, when the new action button is pressed", (name) => {
	
	const mockNewAction = {
		name,
		setName: dummySetState,
		weight: 5,
		setWeight: dummySetState,
		onSubmit: dummySubmit,
		onDelete: dummySubmit
	};
	
	const { container } = render(<ActionsForm actions={[]} newAction={mockNewAction} />);
	
	const startActionsForm = container.querySelector(".SingleActionForm");
	expect(startActionsForm).toBeNull();
	
	const newButton = container.querySelector(".newActionButton");
	fireEvent.click(newButton);
	
	const actionsForm = container.querySelector(".SingleActionForm");
	
	expect(actionsForm).not.toBeNull();
	expect(screen.getByDisplayValue(name)).not.toBeNull();
});

test("ActionsForm will not render the new action button, after it's been clicked", () => {
	
	const mockNewAction = {
		name: "test",
		setName: dummySetState,
		weight: 5,
		setWeight: dummySetState,
		onSubmit: dummySubmit,
		onDelete: dummySubmit
	};
	
	const { container } = render(<ActionsForm actions={[]} newAction={mockNewAction} />);
	
	const buttonSelector = ".newActionButton";
	
	const newButton = container.querySelector(buttonSelector);
	fireEvent.click(newButton);
	
	const newButtonAfterClick = container.querySelector(buttonSelector);
	
	expect(newButtonAfterClick).toBeNull();
});



test("ActionsForm will render SingleActionForm components for each passed in action", () => {
	
	const { container } = render(<ActionsForm actions={dummyActions} newAction={dummyActions[0]} />);
	
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
	
	const { container } = render(<ActionsForm actions={[action]} newAction={dummyActions[0]} />);
	
	const actionForm = container.querySelector(".SingleActionForm");
	const deleteButton = within(actionForm).queryByRole("button", { name: /delete/i });
	
	expect(deleteButton).not.toBeNull();
	
	fireEvent.click(deleteButton);
	
	expect(action.onDelete).toHaveBeenCalled();
	
});

test("ActionsForm will not pass the SingleActionForm an onDelete prop, if the action doesn't have one", () => {
	
	const action = [{ ...dummyActions[0], onDelete: undefined }];
	
	const { container } = render(<ActionsForm actions={[action]} newAction={dummyActions[0]} />);
	
	const actionForm = container.querySelector(".SingleActionForm");
	const deleteButton = within(actionForm).queryAllByRole("button", { name: /delete/i });
	
	expect(deleteButton.length).toBe(0);
	
});


test("ActionsForm will pass the SingleActionForm an onSubmit prop", () => {
	
	const action = { ...dummyActions[0], onSubmit: jest.fn() };
	
	const { container } = render(<ActionsForm actions={[action]} newAction={dummyActions[0]} />);
	
	const form = container.querySelector(".SingleActionForm form");
	
	fireEvent.submit(form);
	
	expect(action.onSubmit).toHaveBeenCalled();
	
});
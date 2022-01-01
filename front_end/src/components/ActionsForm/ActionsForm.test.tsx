import ActionsForm from './ActionsForm';
import { render, fireEvent, screen } from '@testing-library/react';


const dummySetState = (x)=>{};
const dummySubmit = ()=>{};

const dummyActions = [{
	name: "test1",
	setName: dummySetState,
	weight: 2,
	setWeight: dummySetState,
	onSubmit: dummySubmit,
	onDelete: dummySubmit
}, {
	name: "test2",
	setName: dummySetState,
	weight: 3,
	setWeight: dummySetState,
	onSubmit: dummySubmit,
	onDelete: dummySubmit
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
	});
	
});
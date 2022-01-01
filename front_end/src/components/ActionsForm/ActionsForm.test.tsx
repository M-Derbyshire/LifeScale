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
	weight: 2,
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

test("ActionsForm will disable the new action button, after it's been clicked", () => {
	
	const mockNewAction = {
		name: "test",
		setName: dummySetState,
		weight: 5,
		setWeight: dummySetState,
		onSubmit: dummySubmit,
		onDelete: dummySubmit
	};
	
	const { container } = render(<ActionsForm actions={[]} newAction={mockNewAction} />);
	
	const newButton = container.querySelector(".newActionButton");
	fireEvent.click(newButton);
	
	expect(newButton).toBeDisabled();
});
import RequestPasswordPage from './RequestPasswordPage';
import { render, fireEvent, screen } from '@testing-library/react';

const dummyBackButtonHandler = () => {};
const dummySetEmail = (e) => {};
const dummySubmit = ()=>{};

test("RequestPasswordPage will render a RequestPasswordForm, with the given props", () => {
	
	const initialEmailValue = "test@test.com";
	const newEmailValue = "test2@test.com";
	const mockSetEmail = jest.fn();
	const mockSubmit = jest.fn();
	const badSaveErrorMessage = "test bad save error";
	const goodSaveMessage = "test good message";
	
	const { container } = render(<RequestPasswordPage
				email={initialEmailValue}
				setEmail={mockSetEmail}
				onSubmit={mockSubmit}
				badSaveErrorMessage={badSaveErrorMessage}
				goodSaveMessage={goodSaveMessage}
				backButtonHandler={dummyBackButtonHandler} />);
	
	expect(container.querySelector(".RequestPasswordForm")).not.toBeNull();
	
	const emailInput = screen.getByDisplayValue(initialEmailValue);
	expect(emailInput).not.toBeNull();
	
	fireEvent.change(emailInput, { target: { value: newEmailValue } });
	expect(mockSetEmail).toHaveBeenCalledWith(newEmailValue);
	
	const form = container.querySelector(".RequestPasswordForm form");
	fireEvent.submit(form);
	expect(mockSubmit).toHaveBeenCalled();
	
	expect(screen.getByText(badSaveErrorMessage)).not.toBeNull();
	expect(screen.getByText(goodSaveMessage)).not.toBeNull();
	
});


test("RequestPasswordPage will pass the given backButtonHandler prop into the RequestPasswordForm", () => {
	
	const mockBackCallback = jest.fn();
	
	const { container } = render(<RequestPasswordPage
				email="test@test.com"
				setEmail={dummySetEmail}
				onSubmit={dummySubmit}
				backButtonHandler={mockBackCallback} />);
	
	const backButton = container.querySelector(".RequestPasswordForm .backButton");
	
	fireEvent.click(backButton);
	
	expect(mockBackCallback).toHaveBeenCalled();
	
});
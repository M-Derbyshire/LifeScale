import RequestPasswordPage from './RequestPasswordPage';
import { render, fireEvent, screen } from '@testing-library/react';

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
				goodSaveMessage={goodSaveMessage} />);
	
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
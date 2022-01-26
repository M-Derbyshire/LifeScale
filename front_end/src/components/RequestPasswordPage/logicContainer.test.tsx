import RequestPasswordPageLogicContainer from './RequestPasswordPageLogicContainer';
import { render, fireEvent } from '@testing-library/react';
import TestingDummyUserService from '../../userServices/TestingDummyUserService/TestingDummyUserService'

test("Logic container for RequestPasswordPage will render a RequestPasswordPage component", () => {
	
	const { container } = render(<RequestPasswordPageLogicContainer 
									userService={new TestingDummyUserService()} /> );
	
	expect(container.querySelector(".RequestPasswordPage")).not.toBeNull();
	
});
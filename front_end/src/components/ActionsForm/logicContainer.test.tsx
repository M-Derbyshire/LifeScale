import ActionsFormLogicContainer from './ActionsFormLogicContainer';
import { render, fireEvent, waitFor } from '@testing-library/react';
import TestingDummyUserService from '../../userServices/TestingDummyUserService/TestingDummyUserService';

test("ActionsFormLogicContainer will render a ActionsForm", () => {
	
	const { container } = render(<ActionsFormLogicContainer
									userService={new TestingDummyUserService()}
									scaleID="testScale"
									categoryID="testcat" />)
	
	expect(container.querySelector(".ActionsForm")).not.toBeNull();
	
});
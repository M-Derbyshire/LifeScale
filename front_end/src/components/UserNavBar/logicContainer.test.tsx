import UserNavBarLogicContainer from './UserNavBarLogicContainer';
import { render, screen } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import TestingDummyUserService from '../../userServices/TestingDummyUserService/TestingDummyUserService';

test("UserNavBarLogicContainer will render a UserNavBar", () => {
	
	const { container } = render(<Router><UserNavBarLogicContainer
									userService={new TestingDummyUserService()}
									onSuccessfulLogout={()=>{}}
									editUserURL="/edit"
									createScaleURL="/create" /></Router>);
	
	expect(container.querySelector(".UserNavBar")).not.toBeNull();
	
});

test("UserNavBarLogicContainer will pass the create/edit URLs to the nav bar", () => {
	
	const createLinkURL = "/testCreateLink123";
	const editLinkURL = "/testEditLink456";
	
	render(<Router><UserNavBarLogicContainer
				userService={new TestingDummyUserService()}
				onSuccessfulLogout={()=>{}}
				editUserURL={editLinkURL}
				createScaleURL={createLinkURL} /></Router>);
	
	const createLink = screen.getByText("create", {exact: false});
	expect(createLink).toHaveAttribute("href", createLinkURL);
	
	const editLink = screen.getByText("edit", {exact: false});
	expect(editLink).toHaveAttribute("href", editLinkURL);
	
});
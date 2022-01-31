import UserNavBarLogicContainer from './UserNavBarLogicContainer';
import { render, screen } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import TestingDummyUserService from '../../userServices/TestingDummyUserService/TestingDummyUserService';

test("UserNavBarLogicContainer will render a UserNavBar", () => {
	
	const { container } = render(<Router><UserNavBarLogicContainer
									userService={new TestingDummyUserService()}
									onSuccessfulLogout={()=>{}}
									scaleURLBase="scale"
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
				scaleURLBase="scale"
				editUserURL={editLinkURL}
				createScaleURL={createLinkURL} /></Router>);
	
	const createLink = screen.getByText("create", {exact: false});
	expect(createLink).toHaveAttribute("href", createLinkURL);
	
	const editLink = screen.getByText("edit", {exact: false});
	expect(editLink).toHaveAttribute("href", editLinkURL);
	
});

test("UserNavBarLogicContainer will map scales to scaleLinks (using the given scale URL base), and pass to nav bar", () => {
	
	const scales = [
		{
			id: "test1234id",
			name: "test 1",
			usesTimespans:"false",
			displayDayCount: 7,
			categories: []
		},
		{
			id: "test567id",
			name: "test 2",
			usesTimespans:"false",
			displayDayCount: 7,
			categories: []
		},
		{
			id: "test000id",
			name: "test 3",
			usesTimespans:"false",
			displayDayCount: 7,
			categories: []
		}
	];
	
	const mockUserService = new TestingDummyUserService();
	mockUserService.getLoadedUser = () => {
		return {
			scales,
			id: "test",
			email: "test@test.com",
			forename: "test",
			surname: "testing"
		};
	};
	
	const scaleURLBase = "scale123";
	
	render(<Router><UserNavBarLogicContainer
				userService={mockUserService}
				onSuccessfulLogout={()=>{}}
				scaleURLBase={scaleURLBase}
				editUserURL={"/test"}
				createScaleURL={"/test"} /></Router>);
	
	scales.forEach(
		scale => expect(screen.getByText(scale.name)).toHaveAttribute("href", `/${scaleURLBase}/${scale.id}`)
	);
	
});
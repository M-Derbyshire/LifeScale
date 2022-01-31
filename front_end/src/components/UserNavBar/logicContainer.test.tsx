import UserNavBarLogicContainer from './UserNavBarLogicContainer';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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


test("UserNavBarLogicContainer will not pass scaleLinks to the nav bar, if loading user failed", () => {
	
	const mockUserService = new TestingDummyUserService();
	mockUserService.getLoadedUser = () => {
		throw new Error("bad load");
	};
	
	const { container } = render(<Router><UserNavBarLogicContainer
				userService={mockUserService}
				onSuccessfulLogout={()=>{}}
				scaleURLBase={"/scale"}
				editUserURL={"/test"}
				createScaleURL={"/test"} /></Router>);
	
	
	expect(container.querySelectorAll(".ScalesNavList a").length).toBe(0);
});




test("UserNavBarLogicContainer will call onSuccessfulLogout callback prop, after successful logout", async () => {
	
	const mockUserService = new TestingDummyUserService();
	
	mockUserService.getLoadedUser = () => {
		return {
			scales: [],
			id: "test",
			email: "test@test.com",
			forename: "test",
			surname: "testing"
		};
	};
	
	mockUserService.logoutUser = jest.fn().mockResolvedValue(null);
	
	const mockLogoutCallback = jest.fn();
	
	render(<Router><UserNavBarLogicContainer
				userService={mockUserService}
				onSuccessfulLogout={mockLogoutCallback}
				scaleURLBase={"/scale"}
				editUserURL={"/test"}
				createScaleURL={"/test"} /></Router>);
	
	
	const logoutLink = screen.getByText("logout", {exact: false});
	fireEvent.click(logoutLink);
	
	await waitFor(() => expect(mockLogoutCallback).toHaveBeenCalled());
});


test("UserNavBarLogicContainer will pass a failedLogoutErrorMessage if logout fails", async () => {
	
	const errorMessage = "test error, failed to logout test test";
	
	const mockUserService = new TestingDummyUserService();
	
	mockUserService.getLoadedUser = () => {
		return {
			scales: [],
			id: "test",
			email: "test@test.com",
			forename: "test",
			surname: "testing"
		};
	};
	
	mockUserService.logoutUser = jest.fn().mockRejectedValue(new Error(errorMessage));
	
	const mockLogoutCallback = jest.fn();
	
	render(<Router><UserNavBarLogicContainer
				userService={mockUserService}
				onSuccessfulLogout={mockLogoutCallback}
				scaleURLBase={"/scale"}
				editUserURL={"/test"}
				createScaleURL={"/test"} /></Router>);
	
	
	const logoutLink = screen.getByText("logout", {exact: false});
	fireEvent.click(logoutLink);
	
	await waitFor(() => {
		expect(mockLogoutCallback).not.toHaveBeenCalled();
		expect(screen.queryByText(errorMessage, { exact: false })).not.toBeNull();
	});
	
});
import UserHomeScreenLogicContainer from './UserHomeScreenLogicContainer';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import TestingDummyUserService from '../../userServices/TestingDummyUserService/TestingDummyUserService';


const stdScaleLoadError = "Unable to load the selected scale.";

const dummyCategory1 = {
	id: "testCat23132948284",
	name: "testcat1",
	color: "",
	desiredWeight: 1,
	actions: [
        {
            id: "testAct2348743749874",
            name: "testAct1",
            weight: 1,
            timespans: []
        }
    ]
};

const dummyCategory2 = {
	id: "testCatd3482384092348",
	name: "testcat2",
	color: "",
	desiredWeight: 1,
	actions: [
        {
            id: "testAct897432897497",
            name: "testAct2",
            weight: 1,
            timespans: []
        }
    ]
};

const dummyCategory3 = {
	id: "testCat32482934809438",
	name: "testcat3",
	color: "",
	desiredWeight: 1,
	actions: [
        {
            id: "testAct28438290842038",
            name: "testAct3",
            weight: 1,
            timespans: []
        }
    ]
}

const dummyScale = {
	id: "testScale",
	name: "testscale",
	usesTimespans: true,
	displayDayCount: 7,
	categories: [dummyCategory1, dummyCategory2, dummyCategory3]
}

const dummyScales = [ {...dummyScale, name: "scale1", id: "testScale1" }, {...dummyScale, name: "scale2", id: "testScale2" } ];

const dummyUser = {
    id: "testUser847274298734",
    email: "test@test.com",
	forename: "test",
	surname: "test",
	scales: dummyScales
};



const dummyCallbackNoParam = () => {};
const dummyCallbackSingleParam = (x:any) => {};

const dummyUserService = new TestingDummyUserService();
dummyUserService.getLoadedUser = () => dummyUser;
dummyUserService.getScale = (scaleID:string) => dummyUser.scales.filter(scale => scale.id === scaleID)[0];

const defaultProps = {
    userService: dummyUserService,
    selectedScaleID: dummyUser.scales[0].id,
    scaleURLBase: "test",
    editUserURL: "/edit/user",
    createScaleURL: "/scales/create",
    onSuccessfulLogout: dummyCallbackNoParam,
    editScaleCallback: dummyCallbackSingleParam,
    amendHistoryCallback: dummyCallbackSingleParam,
};





test.each(dummyUser.scales.map(scale => [scale.id, scale.name]))
    ("UserHomeScreenLogicContainer will load the selected scale with the given ID, and pass it down to UserHomeScreen", (scaleID, scaleName) => {
    
    const { container } = render(<Router><UserHomeScreenLogicContainer {...defaultProps} selectedScaleID={scaleID} /></Router>);
    
    const header = container.querySelector("header");
    
    expect(header.textContent).toEqual(expect.stringContaining(scaleName));
    
});

test("UserHomeScreenLogicContainer will pass down a scale loading error, if error loading user", () => {
    
    const errorMessage = "Unable to load user, test error";
    
    const mockUserService = { ...dummyUserService };
    mockUserService.getLoadedUser = () => { throw new Error(errorMessage) };
    
    const { container } = render(<Router><UserHomeScreenLogicContainer {...defaultProps} userService={mockUserService} /></Router>);
    
    expect(screen.getByText(errorMessage)).not.toBeNull();
    
});

test("UserHomeScreenLogicContainer will pass down a scale loading error, if error loading scale", () => {
    
    const errorMessage = stdScaleLoadError;
    
    const mockUserService = { ...dummyUserService };
    mockUserService.getScale = (scaleID:string) => undefined; // the return type for not found
    
    const { container } = render(<Router><UserHomeScreenLogicContainer {...defaultProps} userService={mockUserService} /></Router>);
    
    expect(screen.getByText(errorMessage)).not.toBeNull();
    
});




// UserHomeScreenLogicContainer will pass the editUserUrl to UserHomeScreen

// UserHomeScreenLogicContainer will pass the createUserUrl to UserHomeScreen



// use test.each, with expected results
// UserHomeScreenLogicContainer will calculate the statistics percentages for categories and actions, and pass them to UserHomeScreen

// UserHomeScreenLogicContainer will calculate the desiredBalanceItems, and pass them to UserHomeScreen

// UserHomeScreenLogicContainer will calculate the currentBalanceItems, and pass them to UserHomeScreen



// UserHomeScreenLogicContainer will refresh the percentage statistics after recording a new timespan

// UserHomeScreenLogicContainer will refresh the currentBalanceItems after recording a new timespan



// UserHomeScreenLogicContainer will pass onSuccessfulLogout to UserHomeScreen

// UserHomeScreenLogicContainer will pass editScaleCallback to UserHomeScreen, and feed in the scale ID when calling it

// UserHomeScreenLogicContainer will pass amendHistoryCallback to UserHomeScreen, and feed in the scale ID when calling it
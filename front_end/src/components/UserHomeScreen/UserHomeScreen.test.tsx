import UserHomeScreen from './UserHomeScreen';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import TestingDummyUserService from '../../userServices/TestingDummyUserService/TestingDummyUserService';
import IAction from '../../interfaces/IAction';


const dummyCallbackNoParam = () => {};

const dummyCategory1 = {
	id: "testCat23132948284",
	name: "testcat1",
	color: "",
	desiredWeight: 1,
	actions: new Array<IAction>()
};

const dummyCategory2 = {
	id: "testCatd3482384092348",
	name: "testcat2",
	color: "",
	desiredWeight: 1,
	actions: new Array<IAction>()
};

const dummyCategory3 = {
	id: "testCat32482934809438",
	name: "testcat3",
	color: "",
	desiredWeight: 1,
	actions: new Array<IAction>()
}

const dummyScale = {
	id: "testScale38312772389",
	name: "testscale",
	usesTimespans: true,
	displayDayCount: 7,
	categories: [dummyCategory1, dummyCategory2, dummyCategory3]
}

const dummyUser = {
    id: "testUser847274298734",
    email: "test@test.com",
	forename: "test",
	surname: "test",
	scales: [
        dummyScale
    ]
};




const dummyDesiredBalanceItems = [
    {
        label: "test1",
        color: "red",
        weight: 1
    },
    {
        label: "test2",
        color: "blue",
        weight: 2
    },
    {
        label: "test3",
        color: "green",
        weight: 3
    }
];

const dummyCurrentBalanceItems = [
    {
        label: "test1",
        color: "red",
        weight: 3
    },
    {
        label: "test2",
        color: "blue",
        weight: 2
    },
    {
        label: "test3",
        color: "green",
        weight: 1
    }
];

const dummyStatistics = [
    {
        id: "test1",
        label: "test1",
        percentage: 60,
        children: [
            {
                id: "act1",
                label: "act1",
                percentage: 40
            },
            {
                id: "act2",
                label: "act2",
                percentage: 20
            }
        ]
    },
    {
        id: "test2",
        label: "test3",
        percentage: 40,
        children: [
            {
                id: "act3",
                label: "act3",
                percentage: 10
            },
            {
                id: "act4",
                label: "act4",
                percentage: 30
            }
        ]
    }
];


const dummyUserService = new TestingDummyUserService();
dummyUserService.getLoadedUser = () => dummyUser;


const defaultProps = {
    userService: dummyUserService,
    scales: [ {...dummyScale, name: "scale1" }, {...dummyScale, name: "scale2" } ],
    selectedScale: dummyScale,
    scaleLoadingError: undefined,
    onSuccessfulLogout: dummyCallbackNoParam,
    editScaleCallback: dummyCallbackNoParam,
    onSuccessfulTimespanSave: dummyCallbackNoParam,
    amendHistoryCallback: dummyCallbackNoParam,
    editUserURL: "/test/edit",
    createScaleURL: "/test/create",
    scaleURLBase: "test",
    desiredBalanceItems: dummyDesiredBalanceItems,
    currentBalanceItems: dummyCurrentBalanceItems,
    statistics: dummyStatistics
};




test("If user has no scales, UserHomeScreen will display an EmptyContentMessage, within a NavigatableContentWrapper", () => {
    
    const { container } = render(<Router><UserHomeScreen { ...defaultProps } scales={[]} /></Router>);
    
    const emptyMessage = container.querySelector(".NavigatableContentWrapper .EmptyContentMessage");
    
    expect(emptyMessage).not.toBeNull();
    
});




test.each([
    ["test1"],
    ["test2"]
])("UserHomeScreen will display the name of the passed in selected scale, as a heading, in a header", (scaleName) => {
    
    const { container } = render(<Router><UserHomeScreen { ...defaultProps } selectedScale={{ ...dummyScale, name: scaleName }} /></Router>);
    
    const header = container.querySelector("header");
    expect(header).not.toBeNull();
    
    const heading = within(header).queryByText(scaleName);
    expect(heading).not.toBeNull();
    
});




test("UserHomeScreen will pass UserNavBarLogicContainer to a NavigatableContentWrapper", () => {
    
    const { container } = render(<Router><UserHomeScreen { ...defaultProps } /></Router>);
    
    const navBar = container.querySelector(".NavigatableContentWrapper .UserNavBarLogicContainer");
    
    expect(navBar).not.toBeNull();
    
});

test.each([
    ["testScaleName1"],
    ["testScaleName2"]
])("UserHomeScreen will pass userService to the UserNavBarLogicContainer", (scaleName) => {
    
    const mockUserService = { ...dummyUserService };
    mockUserService.getLoadedUser = () => ({ ...dummyUser, scales: [{ ...dummyScale, name: scaleName }] });
    
    const { container } = render(<Router><UserHomeScreen { ...defaultProps } userService={mockUserService} /></Router>);
    
    const navBar = container.querySelector(".UserNavBarLogicContainer");
    const scaleLink = within(navBar).queryByText(scaleName);
    
    expect(scaleLink).not.toBeNull();
    
});

test("UserHomeScreen will pass onSuccessfulLogout prop to UserNavBarLogicContainer", async () => {
    
    const mockCallback = jest.fn(); //This should be called after logout completes
    const mockUserService = { ...dummyUserService };
    mockUserService.logoutUser = jest.fn().mockResolvedValue(null); 
    
    const { container } = render(<Router><UserHomeScreen { ...defaultProps } onSuccessfulLogout={mockCallback} /></Router>);
    
    const navBar = container.querySelector(".UserNavBarLogicContainer");
    const logoutLink = within(navBar).queryByText(/logout/i);
    
    fireEvent.click(logoutLink);
    
    await waitFor(() => expect(mockCallback).toHaveBeenCalled());
    
});

test.each([
    ["/edit/test1"],
    ["/edit/test2"]
])("UserHomeScreen will pass editUserURL prop to UserNavBarLogicContainer", async (editUrl) => {
    
    const { container } = render(<Router><UserHomeScreen { ...defaultProps } editUserURL={editUrl} /></Router>);
    
    const editUserLink = container.querySelector(`.UserNavBarLogicContainer a[href="${editUrl}"]`);
    
    expect(editUserLink).not.toBeNull();
    
});

test.each([
    ["/create/test1"],
    ["/create/test2"]
])("UserHomeScreen will pass createScaleURL prop to UserNavBarLogicContainer", async (createUrl) => {
    
    const { container } = render(<Router><UserHomeScreen { ...defaultProps } createScaleURL={createUrl} /></Router>);
    
    const createUserLink = container.querySelector(`.UserNavBarLogicContainer a[href="${createUrl}"]`);
    
    expect(createUserLink).not.toBeNull();
    
});

test.each([
    ["test1"],
    ["test2"]
])("UserHomeScreen will pass scaleURLBase prop to UserNavBarLogicContainer", async (baseUrl) => {
    
    const { container } = render(<Router><UserHomeScreen { ...defaultProps } scaleURLBase={baseUrl} /></Router>);
    
    
    dummyUser.scales.forEach(scale => {
        
        const link = screen.getByRole("link", { name: scale.name });
        
        const hrefRegex = new RegExp(`.*${baseUrl}.*${scale.id}.*`);
        expect(link).toHaveAttribute("href", expect.stringMatching(hrefRegex));
        
    });
    
});




// UserHomeScreen will pass the editScaleCallback prop to ScalePrimaryDisplay

// UserHomeScreen will pass the desiredBalanceItems to ScalePrimaryDisplay

// UserHomeScreen will pass the currentBalanceItems to ScalePrimaryDisplay



// UserHomeScreen will pass the userService to RecordActionFormLogicContainer

// UserHomeScreen will pass the scale to RecordActionFormLogicContainer

// UserHomeScreen will pass the onSuccessfulTimespanSave callback to RecordActionFormLogicContainer



// UserHomeScreen will pass the statistics to ScaleStatisticDisplay

// UserHomeScreen will pass the amendHistoryCallback to ScaleStatisticDisplay



//Include header, but not nav, in the below
// If scale is provided, UserHomeScreen will enclose it's content in a NavigatableContentWrapper, with a LoadedContentWrapper within that

// If a loading error is passed to the UserHomeScreen, it will pass this to the LoadedContentWrapper, through the errorMessage prop
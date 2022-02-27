import UserHomeScreen from './UserHomeScreen';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter as Router } from 'react-router-dom';
import TestingDummyUserService from '../../userServices/TestingDummyUserService/TestingDummyUserService';
import IAction from '../../interfaces/IAction';


const dummyCallbackNoParam = () => {};

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
        label: "testDesired1",
        color: "red",
        weight: 1
    },
    {
        label: "testDesired2",
        color: "blue",
        weight: 2
    },
    {
        label: "testDesired3",
        color: "green",
        weight: 3
    }
];

const dummyCurrentBalanceItems = [
    {
        label: "testCurrent1",
        color: "red",
        weight: 3
    },
    {
        label: "testCurrent2",
        color: "blue",
        weight: 2
    },
    {
        label: "testCurrent3",
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
])("UserHomeScreen will pass editUserURL prop to UserNavBarLogicContainer", (editUrl) => {
    
    const { container } = render(<Router><UserHomeScreen { ...defaultProps } editUserURL={editUrl} /></Router>);
    
    const editUserLink = container.querySelector(`.UserNavBarLogicContainer a[href="${editUrl}"]`);
    
    expect(editUserLink).not.toBeNull();
    
});

test.each([
    ["/create/test1"],
    ["/create/test2"]
])("UserHomeScreen will pass createScaleURL prop to UserNavBarLogicContainer", (createUrl) => {
    
    const { container } = render(<Router><UserHomeScreen { ...defaultProps } createScaleURL={createUrl} /></Router>);
    
    const createUserLink = container.querySelector(`.UserNavBarLogicContainer a[href="${createUrl}"]`);
    
    expect(createUserLink).not.toBeNull();
    
});

test.each([
    ["test1"],
    ["test2"]
])("UserHomeScreen will pass scaleURLBase prop to UserNavBarLogicContainer", (baseUrl) => {
    
    const { container } = render(<Router><UserHomeScreen { ...defaultProps } scaleURLBase={baseUrl} /></Router>);
    
    
    dummyUser.scales.forEach(scale => {
        
        const link = screen.getByRole("link", { name: scale.name });
        
        const hrefRegex = new RegExp(`.*${baseUrl}.*${scale.id}.*`);
        expect(link).toHaveAttribute("href", expect.stringMatching(hrefRegex));
        
    });
    
});




test("UserHomeScreen will pass the editScaleCallback prop to ScalePrimaryDisplay", () => {
    
    const mockCallback = jest.fn();
    const { container } = render(<Router><UserHomeScreen { ...defaultProps } editScaleCallback={mockCallback} /></Router>);
    
    const primaryDisplay = container.querySelector(".ScalePrimaryDisplay");
    
    let editScaleButton = within(primaryDisplay).getByRole("button", { name: /edit/i });
    if(!editScaleButton)
        editScaleButton = within(primaryDisplay).getByText(/edit/i)
    
    fireEvent.click(editScaleButton);
    
    expect(mockCallback).toHaveBeenCalled();
    
});

test("UserHomeScreen will pass the desiredBalanceItems to ScalePrimaryDisplay", () => {
    
    const { container } = render(<Router><UserHomeScreen { ...defaultProps } /></Router>);
    
    const primaryDisplay = container.querySelector(".ScalePrimaryDisplay");
	
	dummyDesiredBalanceItems.forEach(item => expect(primaryDisplay.textContent).toEqual(expect.stringContaining(item.label)));
    
});

test("UserHomeScreen will pass the currentBalanceItems to ScalePrimaryDisplay", () => {
    
    const { container } = render(<Router><UserHomeScreen { ...defaultProps } /></Router>);
    
    const primaryDisplay = container.querySelector(".ScalePrimaryDisplay");
	
	dummyCurrentBalanceItems.forEach(item => expect(primaryDisplay.textContent).toEqual(expect.stringContaining(item.label)));
    
});



test("UserHomeScreen will pass the userService to RecordActionFormLogicContainer", async () => {
    
    const mockUserService = { ...dummyUserService };
    mockUserService.getAction = (actID, catID, scaleID) => dummyScale.categories[0].actions[0];
	mockUserService.getCategory = (catID, scaleID) => dummyScale.categories[0];
    mockUserService.createTimespan = jest.fn().mockResolvedValue({
        id: "8247734298374982347",
        date: new Date,
        minuteCount: 1
    });
    
    const { container } = render(<Router><UserHomeScreen { ...defaultProps } userService={mockUserService} /></Router>);
    
    const form = container.querySelector(".RecordActionFormLogicContainer form");
    fireEvent.submit(form);
    
    await waitFor(() => expect(mockUserService.createTimespan).toHaveBeenCalled());
    
});

test("UserHomeScreen will pass the scale to RecordActionFormLogicContainer", () => {
    
    const mockUserService = { ...dummyUserService };
    
    const { container, queryByText } = render(<Router><UserHomeScreen { ...defaultProps } userService={mockUserService} /></Router>);
    
    
    const defaultCategoryOption = queryByText((text) => text.toLowerCase() === dummyScale.categories[0].name);
    expect(defaultCategoryOption).not.toBeNull();
    
});

test("UserHomeScreen will pass the onSuccessfulTimespanSave callback to RecordActionFormLogicContainer", async () => {
    
    const mockUserService = { ...dummyUserService };
    mockUserService.getAction = (actID, catID, scaleID) => dummyScale.categories[0].actions[0];
	mockUserService.getCategory = (catID, scaleID) => dummyScale.categories[0];
    mockUserService.createTimespan = jest.fn().mockResolvedValue({
		id: "testTimespan",
		date: new Date().toString(),
		minuteCount: 0
	});
    
    const mockCallback = jest.fn();
    
    const { container } = render(<Router><UserHomeScreen 
                                            { ...defaultProps } 
                                            userService={mockUserService}
                                            onSuccessfulTimespanSave={mockCallback} /></Router>);
    
    const form = container.querySelector(".RecordActionFormLogicContainer form");
    fireEvent.submit(form);
    
    await waitFor(() => {
        expect(mockUserService.createTimespan).toHaveBeenCalled();
        expect(mockCallback).toHaveBeenCalled();
    });
    
});



test("UserHomeScreen will pass the statistics to ScaleStatisticDisplay", () => {
    
    const { container } = render(<Router><UserHomeScreen { ...defaultProps } /></Router>);
    
    const statDisplay = container.querySelector(".ScaleStatisticDisplay");
    
    
    const confirmStatIsDisplayed = (stat) => {
        const statRegex = new RegExp(`.*${stat.label}.*${stat.percentage}.*`);
        const statElement = within(statDisplay).queryByText(stat.label, { exact: false })?.closest("li");
        expect(statElement).not.toBeUndefined();
    };
    
    dummyStatistics.forEach(categoryStat => {
        
        confirmStatIsDisplayed(categoryStat);
        
        categoryStat.children.forEach(actionStat => confirmStatIsDisplayed(actionStat));
        
    });
    
});

test("UserHomeScreen will pass the amendHistoryCallback to ScaleStatisticDisplay", () => {
    
    const mockCallback = jest.fn();
    
    const { container } = render(<Router><UserHomeScreen { ...defaultProps } amendHistoryCallback={mockCallback} /></Router>);
    
    
    const statDisplay = container.querySelector(".ScaleStatisticDisplay");
    const amendButton = within(statDisplay).queryByRole("button", { name: /amend/i });
    
    fireEvent.click(amendButton);
    
    expect(mockCallback).toHaveBeenCalled();
    
});




test("If scale is provided, UserHomeScreen will enclose it's content in a NavigatableContentWrapper, with a LoadedContentWrapper within that", () => {
    
    const { container } = render(<Router><UserHomeScreen { ...defaultProps } /></Router>);
    
    const containingClassSelector = ".NavigatableContentWrapper .LoadedContentWrapper";
    
    const header = container.querySelector(`${containingClassSelector} header`);
    const primaryDisplay = container.querySelector(`${containingClassSelector} .ScalePrimaryDisplay`);
    const recordActionForm = container.querySelector(`${containingClassSelector} .RecordActionFormLogicContainer`);
    const statDisplay = container.querySelector(`${containingClassSelector} .ScaleStatisticDisplay`);
    
    expect(header).not.toBeNull();
    expect(primaryDisplay).not.toBeNull();
    expect(recordActionForm).not.toBeNull();
    expect(statDisplay).not.toBeNull();
    
});

test.each([
    ["test error 1"],
    ["test error 2"]
])("If a loading error is passed to the UserHomeScreen, it will pass this to the LoadedContentWrapper, through the errorMessage prop", (errorMessage) => {
    
    const { container } = render(<Router><UserHomeScreen { ...defaultProps } scaleLoadingError={errorMessage} /></Router>);
    
    const containingClassSelector = ".LoadedContentWrapper";
    
    const header = container.querySelector(`${containingClassSelector} header`);
    const primaryDisplay = container.querySelector(`${containingClassSelector} .ScalePrimaryDisplay`);
    const recordActionForm = container.querySelector(`${containingClassSelector} .RecordActionFormLogicContainer`);
    const statDisplay = container.querySelector(`${containingClassSelector} .ScaleStatisticDisplay`);
    expect(header).toBeNull();
    expect(primaryDisplay).toBeNull();
    expect(recordActionForm).toBeNull();
    expect(statDisplay).toBeNull();
    
    const contentWrapper = container.querySelector(".LoadedContentWrapper");
    expect(within(contentWrapper).queryByText(errorMessage)).not.toBeNull();
    
});
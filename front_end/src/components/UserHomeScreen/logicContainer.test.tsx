import UserHomeScreenLogicContainer from './UserHomeScreenLogicContainer';
import { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import TestingDummyUserService from '../../userServices/TestingDummyUserService/TestingDummyUserService';
import { access } from 'fs';
import userEvent from '@testing-library/user-event';
import ICategory from '../../interfaces/ICategory';
import CategoryColorProvider from '../../utility_classes/CategoryColorProvider/CategoryColorProvider';


const stdScaleLoadError = "Unable to load the selected scale.";

const dummyScale = {
	id: "testScale",
	name: "testscale",
	usesTimespans: true,
	displayDayCount: 100,
	categories: []
}

const dummyScales = [ {...dummyScale, name: "scale1", id: "testScale1" }, {...dummyScale, name: "scale2", id: "testScale2" } ];

const dummyUser = {
    id: "testUser847274298734",
    email: "test@test.com",
	forename: "test",
	surname: "test",
	scales: dummyScales
};




// ------- Dummy data for testing statistics ------------------------------------------------------

//statisticDetails (total of 200)
// (we're purposefully not wanting to cause decimals here, so we don't fail due to decimal rounding decisons on the display side)
const dummyTestStatistics = [
    //categories
    {
        expectedPercentageTotal: 40,
        actions: [
            //Actions with arrays of timespan minutes
            { weight: 1, expectedPercentage: 30, actionTimespans: [5, 20, 5] },
            { weight: 2, expectedPercentage: 10, actionTimespans: [ 5 ] }
        ]
    },
    {
        expectedPercentageTotal: 60,
        actions: [
            { weight: 1, expectedPercentage: 30, actionTimespans: [ 10, 5, 5, 10 ] },
            { weight: 0.5, expectedPercentage: 30, actionTimespans: [ 20, 20, 20 ] }
        ]
    }
];

const dummyStatisticTestCategories = dummyTestStatistics.map((categoryStats, i) => ({
    id: "testCat" + i,
    name: "testCat" + i,
    color: "red",
    desiredWeight: 1,
    actions: categoryStats.actions.map((actionStat, i) => ({
        id: "testAct" + i,
        name: "testAct" + i,
        weight: actionStat.weight,
        timespans: actionStat.actionTimespans.map((minuteCount, i) => ({
            id: "testTS" + i,
            date: new Date(),
            minuteCount
        }))
    }))
}));

// ------------------------------------------------------------------------------------------------------


// ----- Functions for testing balance displays ----------------------------------------------------------

const categoryColorProvider = new CategoryColorProvider();

//Tests that a balance display has the correct values for the different categories.
// container - the container returned from a render call
// balanceDisplayContainerClassname - the classname for the element that contains the correct ScaleBalanceDisplay
// expectedValues - an array of numbers, that represents the values we expect to get
const testBalanceDisplayValues = (container:any, balanceDisplayContainerClassname:string, categories:ICategory[], expectedValues:number[]) => {
    
    //This is more coupled than I'd like, but only way to ensure we get the correct balance display
    
    const scaleBalanceDisplay = container.querySelector(`.ScalePrimaryDisplay .${balanceDisplayContainerClassname} .ScaleBalanceDisplay`);
    const balanceItems = [];
    categories.forEach(
        category => balanceItems.push(within(scaleBalanceDisplay).getByText(category.name).closest("div"))
    );
    
    expect(balanceItems.length).toBe(expectedValues.length);
    balanceItems.forEach((item, i) => {
        expect(item.style.flexGrow).toEqual(expectedValues[i].toString());
        expect(item).toHaveStyle(`background-color: ${categoryColorProvider.getRealColorFromName(categories[i].color)}`);
    });
    
};

//-----------------------------------------------------------------------------------------------------





const dummyCallbackNoParam = () => {};
const dummyCallbackSingleParam = (x:any) => {};

const dummyUserService = new TestingDummyUserService();
dummyUserService.getLoadedUser = () => dummyUser;
dummyUserService.getScale = (scaleID:string) => dummyUser.scales.filter(scale => scale.id === scaleID)[0];
dummyUserService.abortRequests = () => {};

const defaultProps = {
    userService: dummyUserService,
    selectedScaleID: dummyUser.scales[0].id,
    scaleURLBase: "test",
    editUserURL: "/edit/user",
    createScaleURL: "/scales/create",
    onSuccessfulLogout: dummyCallbackNoParam,
    editScaleCallback: dummyCallbackSingleParam,
    amendHistoryCallback: dummyCallbackSingleParam,
    categoryColorProvider: categoryColorProvider
};






test.each(dummyUser.scales.map(scale => [scale.id, scale.name]))
    ("UserHomeScreenLogicContainer will load the selected scale with the given ID, and pass it down to UserHomeScreen", (scaleID, scaleName) => {
    
    const { container } = render(<Router><UserHomeScreenLogicContainer {...defaultProps} selectedScaleID={scaleID} /></Router>);
    
    const header = container.querySelector("header");
    
    expect(header.textContent).toEqual(expect.stringContaining(scaleName));
    
});

test("UserHomeScreenLogicContainer will load the first scale if there are scales, but no selectedScaleID, and pass it down to UserHomeScreen", () => {
    
    const { container } = render(<Router><UserHomeScreenLogicContainer {...defaultProps} selectedScaleID={undefined} /></Router>);
    
    const header = container.querySelector("header");
    
    expect(header.textContent).toEqual(expect.stringContaining(defaultProps.userService.getLoadedUser()!.scales[0].name));
    
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




test.each([
    ["/edit/test1"],
    ["/edit/test2"]
])("UserHomeScreenLogicContainer will pass the editUserUrl to UserHomeScreen", (editUrl) => {
    
    const { container } = render(<Router><UserHomeScreenLogicContainer { ...defaultProps } editUserURL={editUrl} /></Router>);
    
    const editUserLink = container.querySelector(`.UserNavBarLogicContainer a[href="${editUrl}"]`);
    
    expect(editUserLink).not.toBeNull();
    
});

test.each([
    ["/create/test1"],
    ["/create/test2"]
])("UserHomeScreenLogicContainer will pass the createScaleUrl to UserHomeScreen", (createUrl) => {
    
    const { container } = render(<Router><UserHomeScreenLogicContainer { ...defaultProps } createScaleURL={createUrl} /></Router>);
    
    const createUserLink = container.querySelector(`.UserNavBarLogicContainer a[href="${createUrl}"]`);
    
    expect(createUserLink).not.toBeNull();
    
});

test.each([
    ["test1"],
    ["test2"]
])("UserHomeScreenLogicContainer will pass scaleURLBase prop to UserHomeScreen", (baseUrl) => {
    
    const { container } = render(<Router><UserHomeScreenLogicContainer { ...defaultProps } scaleURLBase={baseUrl} /></Router>);
    
    
    dummyUser.scales.forEach(scale => {
        
        const link = screen.getByRole("link", { name: scale.name });
        
        const hrefRegex = new RegExp(`.*${baseUrl}.*${scale.id}.*`);
        expect(link).toHaveAttribute("href", expect.stringMatching(hrefRegex));
        
    });
    
});





test("UserHomeScreenLogicContainer will calculate the statistics percentages for categories and actions, and pass them to UserHomeScreen", () => {
    
    const mockScale = {
        ...dummyUser.scales[0],
        categories: dummyStatisticTestCategories
    };
    
    const mockUserService = { ...dummyUserService };
    mockUserService.getLoadedUser = () => ({ ...dummyUser, scales: [mockScale] });
    mockUserService.getScale = (id:string) => mockScale;
    
    //Now we need to create a list of the expected percentages (category and statistic), in expected display order
    const expectedPercentages = dummyTestStatistics.reduce((categoryAcc, categoryStat) => {
        
        return [
            ...categoryAcc, 
            categoryStat.expectedPercentageTotal, 
            ...categoryStat.actions.reduce((actionAcc, actionStat) => {
                
                return [
                    ...actionAcc,
                    actionStat.expectedPercentage
                ];
                
            }, new Array<number>())
        ];
        
    }, new Array<number>());
    
    
    
    //Now we can actually setup the test
    const { container } = render(<Router><UserHomeScreenLogicContainer { ...defaultProps } userService={mockUserService} /></Router>);
    
    const statisticDisplay = container.querySelector(".ScaleStatisticDisplay");
    const percentageDisplays = within(statisticDisplay).queryAllByText(/\%/);
    
    
    expect(percentageDisplays.length).toBe(expectedPercentages.length);
    expectedPercentages.forEach((expectedPercentage, i) => expect(percentageDisplays[i].textContent).toEqual(`${expectedPercentage}%`));
    
});

test("UserHomeScreenLogicContainer will map the category percentages to currentBalanceItems, and pass them to UserHomeScreen", () => {
    
    const mockScale = {
        ...dummyUser.scales[0],
        categories: dummyStatisticTestCategories
    };
    
    const mockUserService = { ...dummyUserService };
    mockUserService.getLoadedUser = () => ({ ...dummyUser, scales: [mockScale] });
    mockUserService.getScale = (id:string) => mockScale;
    
    const expectedValues:number[] = dummyTestStatistics.map(categoryStat => categoryStat.expectedPercentageTotal);
    
    
    
    const { container } = render(<Router><UserHomeScreenLogicContainer { ...defaultProps } userService={mockUserService} /></Router>);
    
    
    testBalanceDisplayValues(container, "currentBalanceContainer", dummyStatisticTestCategories, expectedValues);
    
});

test("UserHomeScreenLogicContainer will map the desired weights of categories to desiredBalanceItems, and pass them to UserHomeScreen", () => {
    
    const mockScale = {
        ...dummyUser.scales[0],
        categories: dummyStatisticTestCategories
    };
    
    const mockUserService = { ...dummyUserService };
    mockUserService.getLoadedUser = () => ({ ...dummyUser, scales: [mockScale] });
    mockUserService.getScale = (id:string) => mockScale;
    
    const expectedValues:number[] = dummyStatisticTestCategories.map(category => category.desiredWeight);
    
    
    
    const { container } = render(<Router><UserHomeScreenLogicContainer { ...defaultProps } userService={mockUserService} /></Router>);
    
    
    testBalanceDisplayValues(container, "desiredBalanceContainer", dummyStatisticTestCategories, expectedValues);
    
});



test("UserHomeScreenLogicContainer will refresh the percentage statistics after recording a new timespan", async () => {
    
    const mockScale = {
        ...dummyUser.scales[0],
        categories: [ ...dummyStatisticTestCategories ]
    };
    
    const mockUserService = { ...dummyUserService };
    mockUserService.getLoadedUser = () => ({ ...dummyUser, scales: [mockScale] });
    mockUserService.getScale = (id:string) => mockScale;
    mockUserService.getCategory = (catID:string, scaleID:string) => mockScale.categories[0];
    mockUserService.getAction = (actID:string, catID:string, scaleID:string) => mockScale.categories[0].actions[0];
    mockUserService.createTimespan = jest.fn().mockResolvedValue({
        id: "8247734298374982347",
        date: new Date,
        minuteCount: 120
    });
    
    const { container } = render(<Router><UserHomeScreenLogicContainer { ...defaultProps } userService={mockUserService} /></Router>);
    
    
    //Now we want to change the category statistics to something different. Then submit and confirm the change
    mockScale.categories = [mockScale.categories[0]]; // just one
    
    const form = container.querySelector(".RecordActionFormLogicContainer form");
    fireEvent.submit(form);
    
    const statisticDisplay = container.querySelector(".ScaleStatisticDisplay");
    const percentageDisplays = within(statisticDisplay).queryAllByText(/\%/);
    
    //Check the first (and only) category statistic
    await waitFor(() => expect(percentageDisplays[0].textContent).toEqual("100%"));
    
});

test("UserHomeScreenLogicContainer will refresh the currentBalanceItems after recording a new timespan", async () => {
    
    const mockScale = {
        ...dummyUser.scales[0],
        categories: [ ...dummyStatisticTestCategories ]
    };
    
    const mockUserService = { ...dummyUserService };
    mockUserService.getLoadedUser = () => ({ ...dummyUser, scales: [mockScale] });
    mockUserService.getScale = (id:string) => mockScale;
    mockUserService.getCategory = (catID:string, scaleID:string) => mockScale.categories[0];
    mockUserService.getAction = (actID:string, catID:string, scaleID:string) => mockScale.categories[0].actions[0];
    mockUserService.createTimespan = jest.fn().mockResolvedValue({
        id: "8247734298374982347",
        date: new Date,
        minuteCount: 120
    });
    
    const { container } = render(<Router><UserHomeScreenLogicContainer { ...defaultProps } userService={mockUserService} /></Router>);
    
    
    //Now we want to change the category statistics to something different. Then submit and confirm the change
    mockScale.categories = [mockScale.categories[0]]; // just one
    mockUserService.getScale = (id:string) => mockScale;
    
    const form = container.querySelector(".RecordActionFormLogicContainer form");
    
    fireEvent.submit(form);
    
    await waitFor(() => testBalanceDisplayValues(container, "currentBalanceContainer", mockScale.categories, [100])); //Only one category, so 100 percent);
    
});



test("UserHomeScreenLogicContainer will pass onSuccessfulLogout to UserHomeScreen", async () => {
    
    const mockCallback = jest.fn(); //This should be called after logout completes
    const mockUserService = { ...dummyUserService };
    mockUserService.logoutUser = jest.fn().mockResolvedValue(null); 
    
    const { container } = render(<Router><UserHomeScreenLogicContainer 
                                                { ...defaultProps } 
                                                userService={mockUserService} 
                                                onSuccessfulLogout={mockCallback} /></Router>);
    
    const navBar = container.querySelector(".UserNavBarLogicContainer");
    const logoutLink = within(navBar).queryByText(/logout/i);
    
    fireEvent.click(logoutLink);
    
    await waitFor(() => expect(mockCallback).toHaveBeenCalled());
    
});

test("UserHomeScreenLogicContainer will pass editScaleCallback to UserHomeScreen, and feed in the scale ID when calling it", () => {
    
    const mockCallback = jest.fn();
    const { container } = render(<Router><UserHomeScreenLogicContainer { ...defaultProps } editScaleCallback={mockCallback} /></Router>);
    
    const primaryDisplay = container.querySelector(".ScalePrimaryDisplay");
    
    let editScaleButton = within(primaryDisplay).getByRole("button", { name: /edit/i });
    if(!editScaleButton)
        editScaleButton = within(primaryDisplay).getByText(/edit/i)
    
    fireEvent.click(editScaleButton);
    
    expect(mockCallback).toHaveBeenCalledWith(defaultProps.selectedScaleID);
    
});

test.each([
    ...dummyUser.scales.map(scale => [scale.id, scale.id]),
    [undefined, dummyUser.scales[0].id] //we also want to make sure the first ID is fed in here
])("UserHomeScreenLogicContainer will pass amendHistoryCallback to UserHomeScreen, and feed in the scale ID when calling it", (selectedID, expectedID) => {
    
    const mockCallback = jest.fn();
    
    const { container } = render(<Router><UserHomeScreenLogicContainer { ...defaultProps } selectedScaleID={selectedID} amendHistoryCallback={mockCallback} /></Router>);
    
    
    const statDisplay = container.querySelector(".ScaleStatisticDisplay");
    const amendButton = within(statDisplay).queryByRole("button", { name: /amend/i });
    
    fireEvent.click(amendButton);
    
    expect(mockCallback).toHaveBeenCalledWith(expectedID);
    
});





test("UserHomeScreenLogicContainer will exclude dates older than scale's day count, from the percentage statistics", () => {
    
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const tooOldDate = new Date(Date.now() - (3600 * 1000 * 24));
    tooOldDate.setHours(0, 0, 0, 0);
    
    // if this is working, 1st category should be 100%, not 10%
    const mockScale = {
        id: "test",
        name: "testscale",
        usesTimespans: true,
        displayDayCount: 1,
        categories: [
            {
                id: "testcat1",
                name: "10percent", //10% if including all the dates
                color: "red",
                desiredWeight: 1,
                actions: [
                    {
                        id: "testact1",
                        name: "testact1",
                        weight: 1,
                        timespans: [{ id: "testts1", date: currentDate, minuteCount: 1 }]
                    }
                ]
            },
            {
                id: "testcat2",
                name: "90percent", //90% if including all the dates
                color: "red",
                desiredWeight: 1,
                actions: [
                    {
                        id: "testact2",
                        name: "testact2",
                        weight: 1,
                        timespans: [{ id: "testts2", date: tooOldDate, minuteCount: 9 }]
                    }
                ]
            }
        ]
    };
    
    
    
    const mockUserService = { ...dummyUserService };
    mockUserService.getLoadedUser = () => ({ ...dummyUser, scales: [mockScale] });
    mockUserService.getScale = (id:string) => mockScale;
    
    
    
    const { container } = render(<Router><UserHomeScreenLogicContainer { ...defaultProps } userService={mockUserService} /></Router>);
    
    const statisticDisplay = container.querySelector(".ScaleStatisticDisplay");
    const percentageDisplaysHundredPercent = within(statisticDisplay).queryAllByText(/100%/);
    
    expect(percentageDisplaysHundredPercent.length).toBe(2);
    
});


//generate the date we want to test with, based on the current date
test.each([
    [new Date(Date.now())],
    [new Date(Date.now() - (3600 * 1000 * 24))],
    [new Date(Date.now() - (3600 * 1000 * 48))],
])("UserHomeScreenLogicContainer will not exclude dates that fall on -- or are after -- the scale's day count, from the percentage statistics", (dateToInclude) => {
    
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    dateToInclude.setHours(0, 0, 0, 0);
    
    const testDayCount = 3;
    
    // if this is working, no category should be 100%
    const mockScale = {
        id: "test",
        name: "testscale",
        usesTimespans: true,
        displayDayCount: testDayCount,
        categories: [
            {
                id: "testcat1",
                name: "10percent", //10% if including all the dates
                color: "red",
                desiredWeight: 1,
                actions: [
                    {
                        id: "testact1",
                        name: "testact1",
                        weight: 1,
                        timespans: [{ id: "testts1", date: currentDate, minuteCount: 1 }]
                    }
                ]
            },
            {
                id: "testcat2",
                name: "90percent", //90% if including all the dates
                color: "red",
                desiredWeight: 1,
                actions: [
                    {
                        id: "testact2",
                        name: "testact2",
                        weight: 1,
                        timespans: [{ id: "testts2", date: dateToInclude, minuteCount: 9 }]
                    }
                ]
            }
        ]
    };
    
    
    
    const mockUserService = { ...dummyUserService };
    mockUserService.getLoadedUser = () => ({ ...dummyUser, scales: [mockScale] });
    mockUserService.getScale = (id:string) => mockScale;
    
    
    
    const { container } = render(<Router><UserHomeScreenLogicContainer { ...defaultProps } userService={mockUserService} /></Router>);
    
    const statisticDisplay = container.querySelector(".ScaleStatisticDisplay");
    const percentageDisplaysHundredPercent = within(statisticDisplay).queryAllByText(/100%/);
    
    expect(percentageDisplaysHundredPercent.length).toBe(0);
    
});


test("UserHomeScreenLogicContainer will exclude dates older than scale's day count, from the current balance", () => {
    
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const tooOldDate = new Date(Date.now() - (3600 * 1000 * 24));
    tooOldDate.setHours(0, 0, 0, 0);
    
    // if this is working, 1st category should be 100%, not 10%
    const mockScale = {
        id: "test",
        name: "testscale",
        usesTimespans: true,
        displayDayCount: 1,
        categories: [
            {
                id: "testcat1",
                name: "10percent", //10% if including all the dates
                color: "red",
                desiredWeight: 1,
                actions: [
                    {
                        id: "testact1",
                        name: "testact1",
                        weight: 1,
                        timespans: [{ id: "testts1", date: currentDate, minuteCount: 1 }]
                    }
                ]
            },
            {
                id: "testcat2",
                name: "90percent", //90% if including all the dates
                color: "red",
                desiredWeight: 1,
                actions: [
                    {
                        id: "testact2",
                        name: "testact2",
                        weight: 1,
                        timespans: [{ id: "testts2", date: tooOldDate, minuteCount: 9 }]
                    }
                ]
            }
        ]
    };
    
    
    
    
    const mockUserService = { ...dummyUserService };
    mockUserService.getLoadedUser = () => ({ ...dummyUser, scales: [mockScale] });
    mockUserService.getScale = (id:string) => mockScale;
    
    
    
    const { container } = render(<Router><UserHomeScreenLogicContainer { ...defaultProps } userService={mockUserService} /></Router>);
    
    
    const expectedPercentages = [
        100,
        0
    ];
    
    
    testBalanceDisplayValues(container, "currentBalanceContainer", mockScale.categories, expectedPercentages);
    
});

//generate the date we want to test with, based on the current date
test.each([
    [new Date(Date.now())],
    [new Date(Date.now() - (3600 * 1000 * 24))],
    [new Date(Date.now() - (3600 * 1000 * 48))],
])("UserHomeScreenLogicContainer will not exclude dates that fall on -- or are after -- the scale's day count, from the current balance", (dateToInclude) => {
    
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    dateToInclude.setHours(0, 0, 0, 0);
    
    const testDayCount = 3;
    
    // if this is working, no category should be 100%
    const mockScale = {
        id: "test",
        name: "testscale",
        usesTimespans: true,
        displayDayCount: testDayCount,
        categories: [
            {
                id: "testcat1",
                name: "10percent", //10% if including all the dates
                color: "red",
                desiredWeight: 1,
                actions: [
                    {
                        id: "testact1",
                        name: "testact1",
                        weight: 1,
                        timespans: [{ id: "testts1", date: currentDate, minuteCount: 1 }]
                    }
                ]
            },
            {
                id: "testcat2",
                name: "90percent", //90% if including all the dates
                color: "red",
                desiredWeight: 1,
                actions: [
                    {
                        id: "testact2",
                        name: "testact2",
                        weight: 1,
                        timespans: [{ id: "testts2", date: dateToInclude, minuteCount: 9 }]
                    }
                ]
            }
        ]
    };
    
    
    
    const mockUserService = { ...dummyUserService };
    mockUserService.getLoadedUser = () => ({ ...dummyUser, scales: [mockScale] });
    mockUserService.getScale = (id:string) => mockScale;
    
    
    
    const { container } = render(<Router><UserHomeScreenLogicContainer { ...defaultProps } userService={mockUserService} /></Router>);
    
    
    const expectedPercentages = [
        10,
        90
    ];
    
    
    testBalanceDisplayValues(container, "currentBalanceContainer", mockScale.categories, expectedPercentages);
    
});
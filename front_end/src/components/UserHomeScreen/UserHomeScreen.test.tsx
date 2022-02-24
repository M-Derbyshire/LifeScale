import UserHomeScreen from './UserHomeScreen';
import { render, screen, waitFor } from '@testing-library/react';
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



const defaultProps = {
    userService: new TestingDummyUserService(),
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
    
    const { container } = render(<UserHomeScreen { ...defaultProps } scales={[]} />);
    
    const emptyMessage = container.querySelector(".NavigatableContentWrapper .EmptyContentMessage");
    
    expect(emptyMessage).not.toBeNull();
    
});



// UserHomeScreen will pass UserNavBarLogicContainer to a NavigatableContentWrapper

// UserHomeScreen will pass userService to the UserNavBarLogicContainer

// UserHomeScreen will pass onSuccessfulLogout prop to UserNavBarLogicContainer

// UserHomeScreen will pass editUserURL prop to UserNavBarLogicContainer

// UserHomeScreen will pass createScaleURL prop to UserNavBarLogicContainer

// UserHomeScreen will pass scaleURLBase prop to UserNavBarLogicContainer



// If scale is provided, UserHomeScreen will enclose it's content in a NavigatableContentWrapper, with a LoadedContentWrapper within that

// If no scale prop provided, UserHomeScreen will not pass anything to LoadedContentWrapper (which will be within a NavigatableContentWrapper) in the render prop

// If a loading error is passed to the UserHomeScreen, it will pass this to the LoadedContentWrapper, through the errorMessage prop




// UserHomeScreen will pass the editScaleCallback prop to ScalePrimaryDisplay

// UserHomeScreen will pass the desiredBalanceItems to ScalePrimaryDisplay

// UserHomeScreen will pass the currentBalanceItems to ScalePrimaryDisplay



// UserHomeScreen will pass the userService to RecordActionFormLogicContainer

// UserHomeScreen will pass the scale to RecordActionFormLogicContainer

// UserHomeScreen will pass the onSuccessfulTimespanSave callback to RecordActionFormLogicContainer



// UserHomeScreen will pass the statistics to ScaleStatisticDisplay

// UserHomeScreen will pass the amendHistoryCallback to ScaleStatisticDisplay
import ScaleDetailsFormLogicContainer from './ScaleDetailsFormLogicContainer';
import { render, fireEvent, screen, within } from '@testing-library/react';
import TestingDummyUserService from '../../userServices/TestingDummyUserService/TestingDummyUserService';
import IAction from '../../interfaces/IAction';
import IScale from '../../interfaces/IScale';


const dummyBackHandler = ()=>{};

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



const dummyUserService = new TestingDummyUserService();
dummyUserService.getScale = (scaleID) => dummyScale;



test("ScaleDetailsFormLogicContainer will display a ScaleDetailsForm", () => {
	
	const { container } = render(<ScaleDetailsFormLogicContainer
									scaleID={dummyScale.id}
									userService={dummyUserService}
									backButtonHandler={dummyBackHandler} />);
	
	const detailsForm = container.querySelector(".ScaleDetailsForm");
	expect(detailsForm).not.toBeNull();
	
});


test("ScaleDetailsFormLogicContainer will pass in the delete handler, if scaleID is provided", () => {
	
	//No actions, so no delete buttons for those
	const mockUserService = { ...dummyUserService };
	mockUserService.getScale = (scaleID) => dummyScale;
	
	render(<ScaleDetailsFormLogicContainer
		scaleID={dummyScale.id}
		userService={dummyUserService}
		backButtonHandler={dummyBackHandler} />);
	
	expect(screen.queryByRole("button", { name: /delete/i })).not.toBeNull();
	
});


test("ScaleDetailsFormLogicContainer will not pass in the delete handler, if no scaleID is provided", () => {
	
	//No actions, so no delete buttons for those
	const mockUserService = { ...dummyUserService };
	mockUserService.getScale = (scaleID) => dummyScale;
	
	render(<ScaleDetailsFormLogicContainer
		userService={dummyUserService}
		backButtonHandler={dummyBackHandler} />);
	
	expect(screen.queryByRole("button", { name: /delete/i })).toBeNull();
	
});

// ScaleDetailsFormLogicContainer will not display the CardDisplay, if no scaleID is provided

// ScaleDetailsFormLogicContainer will display the CardDisplay, with the categories passed in, if a scaleID is provided

// ScaleDetailsFormLogicContainer will pass the addCategoryCallback to the form

// // ScaleDetailsFormLogicContainer will pass the editCategoryCallback to the form

// ScaleDetailsFormLogicContainer will pass the scale name within the headingText, if scaleID is provided

// ScaleDetailsFormLogicContainer will load the scale with the given scale ID, if a scale id is provided

// ScaleDetailsFormLogicContainer will pass a badLoadErrorMessage on bad scale load

// ScaleDetailsFormLogicContainer will handle the form state

// ScaleDetailsFormLogicContainer will not change the header when changing the name state

// ScaleDetailsFormLogicContainer will pass down the backButtonHandler prop

// ScaleDetailsFormLogicContainer will save new records with the apiAccessor, and then change to editing mode

// ScaleDetailsFormLogicContainer will update existing records with the apiAccessor

// ScaleDetailsFormLogicContainer will change the header after saving an update with name change

// ScaleDetailsFormLogicContainer will display an error message on bad create save

// ScaleDetailsFormLogicContainer will display an error message on bad update save

// ScaleDetailsFormLogicContainer will display a good save message on good create save

// ScaleDetailsFormLogicContainer will display a good save message on good update save

// ScaleDetailsFormLogicContainer will clear good save message after a bad update save

// ScaleDetailsFormLogicContainer will clear error save message after a good create save

// ScaleDetailsFormLogicContainer will clear error save message after a good update save

// ScaleDetailsFormLogicContainer will disable submit button when creating, then re-enable when done

// ScaleDetailsFormLogicContainer will disable submit button when updating, then re-enable when done

// ScaleDetailsFormLogicContainer will re-enable submit button after a error during create

// ScaleDetailsFormLogicContainer will re-enable submit button after a error during update

// ScaleDetailsFormLogicContainer will use userService deletescale method to delete (passing original scale)

// ScaleDetailsFormLogicContainer will display error if bad save during delete

// ScaleDetailsFormLogicContainer will call onSuccessfulDeleteHandler after successful delete






// App will redirect to main scales page if the user is logged in, and they're at a non-auth route



//If going to an unknown route when logged in, App will redirect to main scales page route



// App will render a UserDetailsFormLogicContainer, when at the edit route

// App will pass backButtonHandler prop to UserDetailsFormLogicContainer, at edit route, which will redirect to home route

// App will pass isNewUser prop as true to UserDetailsFormLogicContainer, if at edit route






// App will render a AmendActionHistoryPageLogicContainer, when at the correct route

// App will pass the scaleID prop to AmendActionHistoryPageLogicContainer

// App will pass the backButtonHandler prop to AmendActionHistoryPageLogicContainer, which will redirect to home route






//use each for both edit/create route
// App will render a CategoryDetailsFormLogicContainer, when at the correct routes

//use each for both routes
// App will pass backButtonHandler prop to CategoryDetailsFormLogicContainer, at correct routes, which will redirect to home route

//use each for both routes
// App will pass scaleID prop to CategoryDetailsFormLogicContainer, at correct routes

//use each for both routes
// App will pass categoryColorProvider prop to CategoryDetailsFormLogicContainer, at correct routes

// App will not pass categoryID prop to CategoryDetailsFormLogicContainer, if at create route

// App will pass categoryID prop to CategoryDetailsFormLogicContainer, if at edit route

// App will not pass onSuccessfulDeleteHandler prop to CategoryDetailsFormLogicContainer, if at create route

// App will pass onSuccessfulDeleteHandler prop to CategoryDetailsFormLogicContainer, if at edit route, and take you back to the scale when triggered







//use each for both edit/create route
// App will render a ScaleDetailsFormLogicContainer, when at the correct routes

//use each for both routes
// App will pass backButtonHandler prop to ScaleDetailsFormLogicContainer, at correct routes, which will redirect back to home route

// App will not pass scaleID prop to ScaleDetailsFormLogicContainer, if at create route

// App will pass scaleID prop to ScaleDetailsFormLogicContainer, if at edit route

// App will not pass onSuccessfulDeleteHandler prop to ScaleDetailsFormLogicContainer, if at create route

// App will pass onSuccessfulDeleteHandler prop to ScaleDetailsFormLogicContainer, if at edit route, which will redirect to home route

// App will pass editCategoryHandler prop to ScaleDetailsFormLogicContainer, if at edit route, and take you to the correct category route when triggered

// App will pass addCategoryHandler prop to ScaleDetailsFormLogicContainer, if at edit route, and take you to the new category route when triggered






//Use each, and include route without scale id
// App will render UserHomeScreenLogicContainer, when at the correct routes

// use each
// App will pass selectedScaleID to UserHomeScreenLogicContainer, if one exists in the route

// App will pass correct scaleURLBase prop into UserHomeScreenLogicContainer

// App will pass editUserUrl prop into UserHomeScreenLogicContainer

// App will pass createUserUrl prop into UserHomeScreenLogicContainer

// App will redirect to the login page route, after a successful logout

// App will pass the editScaleCallback to UserHomeScreenLogicContainer, which will take you to the edit route for the scale ID that the callback was called with

// App will pass the amendHistoryCallback prop to UserHomeScreenLogicContainer, which will take you to the amend action history route for the scale ID that the callback was called with
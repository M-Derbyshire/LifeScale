


// If user has no scales, UserHomeScreen will display an EmptyContentMessage, within a NavigatableContentWrapper



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
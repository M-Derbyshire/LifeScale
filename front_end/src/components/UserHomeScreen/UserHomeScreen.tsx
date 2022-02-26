import React, { FC } from 'react';
import './UserHomeScreen.scss';
import IUserService from '../../interfaces/api_access/IUserService';
import IScale from '../../interfaces/IScale';
import IPercentageStatistic from '../../interfaces/UI/IPercentageStatistic';
import IScaleBalanceItem from '../../interfaces/UI/IScaleBalanceItem';
import NavigatableContentWrapper from '../NavigatableContentWrapper/NavigatableContentWrapper';
import LoadedContentWrapper from '../LoadedContentWrapper/LoadedContentWrapper';
import EmptyContentMessage from '../EmptyContentMessage/EmptyContentMessage';
import UserNavBarLogicContainer from '../UserNavBar/UserNavBarLogicContainer';
import ScalePrimaryDisplay from '../ScalePrimaryDisplay/ScalePrimaryDisplay';
import RecordActionFormLogicContainer from '../RecordActionForm/RecordActionFormLogicContainer';
import ScaleStatisticDisplay from '../ScaleStatisticDisplay/ScaleStatisticDisplay';


interface IUserHomeScreenProps {
    userService:IUserService;
    scales?:IScale[];
    selectedScale?:IScale;
    scaleLoadingError?:string;
    
    onSuccessfulLogout:()=>void; //Called after successful logout
    editScaleCallback:()=>void; //Called by the Edit Scale button
    onSuccessfulTimespanSave?:()=>void;
    amendHistoryCallback:()=>void; // The callback for the amend history button
    
	editUserURL:string;
	createScaleURL:string; 
	scaleURLBase:string; //E.g. "scales" in "/scales/id1234"
    
    desiredBalanceItems:IScaleBalanceItem[];
	currentBalanceItems:IScaleBalanceItem[];
    
    statistics:IPercentageStatistic[];
}


/*
    Displays the home navigation bar, and the information about the selected scale (with a RecordActionForm, to record new timespans)
*/
const UserHomeScreen:FC<IUserHomeScreenProps> = (props) => {
    
    const isScaleStillLoading = (!props.scales || (!props.selectedScale && props.scales.length !== 0));
    
    return (
        <div className='UserHomeScreen'>
            <NavigatableContentWrapper smallScreenWidthPixels={760} navigationBar={
                <UserNavBarLogicContainer 
                    userService={props.userService}
                    onSuccessfulLogout={props.onSuccessfulLogout}
                    editUserURL={props.editUserURL}
                    createScaleURL={props.createScaleURL}
                    scaleURLBase={props.scaleURLBase} />
            }>
                
                <LoadedContentWrapper errorMessage={props.scaleLoadingError} render={(isScaleStillLoading) ? undefined : (
                    
                    <div>
                        {props.scales && props.scales.length === 0 && <EmptyContentMessage message="No scales have been created." />}
                        
                        {props.selectedScale && <div>
                            
                            <header>
                                <h1>{props.selectedScale.name}</h1>
                            </header>
                            
                            <ScalePrimaryDisplay 
                                desiredBalanceItems={props.desiredBalanceItems}
                                currentBalanceItems={props.currentBalanceItems}
                                editScaleCallback={props.editScaleCallback} />
                            
                            <RecordActionFormLogicContainer 
                                userService={props.userService}
                                scale={props.selectedScale}
                                onSuccessfulSave={props.onSuccessfulTimespanSave} />
                            
                            <ScaleStatisticDisplay 
                                statistics={props.statistics}
                                amendHistoryCallback={props.amendHistoryCallback} />
                            
                        </div>}
                        
                    </div>
                    
                )} />
                
            </NavigatableContentWrapper>
        </div>
    );
    
};

export default UserHomeScreen;
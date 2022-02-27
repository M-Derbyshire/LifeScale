import React, { Component } from 'react';
import IUserService from '../../interfaces/api_access/IUserService';
import IScale from '../../interfaces/IScale';
import UserHomeScreen from './UserHomeScreen';


interface IUserHomeScreenLogicContainerProps {
    userService:IUserService;
    selectedScaleID?:string;
    scaleURLBase:string; //E.g. "scales" in "/scales/id1234"
    editUserURL:string;
    createScaleURL:string; 
    
    onSuccessfulLogout:()=>void; //Called after successful logout
    editScaleCallback:(scaleID:string)=>void; //Called by the Edit Scale button
    amendHistoryCallback:(scaleID:string)=>void; // The callback for the amend history button
};

interface IUserHomeScreenLogicContainerState {
    scales:IScale[];
    selectedScale?:IScale;
    scaleLoadingError:string;
};


export default class UserHomeScreenLogicContainer
    extends Component<IUserHomeScreenLogicContainerProps, IUserHomeScreenLogicContainerState>
{
    
    stdScaleLoadErrorMessage = "Unable to load the selected scale.";
    
    constructor(props:IUserHomeScreenLogicContainerProps)
    {
        super(props);
        
        let scaleLoadingError;
        let scales:IScale[] = [];
        let selectedScale;
        
        try
        {
            scales = this.props.userService.getLoadedUser().scales;
        }
        catch (err:any)
        {
            scaleLoadingError = err.message;
        }
        
        
        if(this.props.selectedScaleID && !scaleLoadingError)
        {
            selectedScale = this.props.userService.getScale(this.props.selectedScaleID);
            if(!selectedScale)
                scaleLoadingError = this.stdScaleLoadErrorMessage;
        }
        
        
        
        this.state = {
            scaleLoadingError,
            scales,
            selectedScale,
        };
    }
    
    
    render()
    {
        
        
        return (
            <div className="UserHomeScreenLogicContainer">
                <UserHomeScreen 
                    userService={this.props.userService}
                    scales={this.state.scales}
                    selectedScale={this.state.selectedScale}
                    scaleLoadingError={this.state.scaleLoadingError}
                    
                    onSuccessfulLogout={this.props.onSuccessfulLogout}
                    editScaleCallback={() => this.props.editScaleCallback("")}
                    onSuccessfulTimespanSave={()=>{}}
                    amendHistoryCallback={() => this.props.amendHistoryCallback("")}
                    
                    editUserURL={this.props.editUserURL}
                    createScaleURL={this.props.createScaleURL}
                    scaleURLBase={this.props.scaleURLBase}
                    
                    desiredBalanceItems={[]}
                    currentBalanceItems={[]}
                    statistics={[]} />
            </div>
        );
    }
    
}
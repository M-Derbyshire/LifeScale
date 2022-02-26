import React, { Component } from 'react';
import IUserService from '../../interfaces/api_access/IUserService';
import UserHomeScreen from './UserHomeScreen';


interface IUserHomeScreenLogicContainerProps {
    userService:IUserService;
    selectedScaleID?:string;
    scaleURLBase:string; //E.g. "scales" in "/scales/id1234"
    
    onSuccessfulLogout:()=>void; //Called after successful logout
    editScaleCallback:(scaleID:string)=>void; //Called by the Edit Scale button
    amendHistoryCallback:(scaleID:string)=>void; // The callback for the amend history button
};

interface IUserHomeScreenLogicContainerState {
    
};


export default class UserHomeScreenLogicContainer
    extends Component<IUserHomeScreenLogicContainerProps, IUserHomeScreenLogicContainerState>
{
    
    constructor(props:IUserHomeScreenLogicContainerProps)
    {
        super(props);
        
        
    }
    
    
    render()
    {
        
        
        return (
            <div className="UserHomeScreenLogicContainer">
                
            </div>
        );
    }
    
}
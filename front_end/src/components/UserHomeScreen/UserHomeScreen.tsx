import React, { FC } from 'react';
import IUserService from '../../interfaces/api_access/IUserService';
import IScale from '../../interfaces/IScale';
import IPercentageStatistic from '../../interfaces/UI/IPercentageStatistic';
import IScaleBalanceItem from '../../interfaces/UI/IScaleBalanceItem';
import './UserHomeScreen.scss';


interface IUserHomeScreenProps {
    userService:IUserService;
    selectedScale?:IScale;
    scaleLoadingError:string;
    
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


const UserHomeScreen:FC<IUserHomeScreenProps> = (props) => {
    
    return (
        <div className='UserHomeScreen'>
            
        </div>
    );
    
};

export default UserHomeScreen;
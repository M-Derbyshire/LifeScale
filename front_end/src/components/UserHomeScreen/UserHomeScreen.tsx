import React, { FC } from 'react';
import IUserService from '../../interfaces/api_access/IUserService';
import IScale from '../../interfaces/IScale';
import IPercentageStatistic from '../../interfaces/UI/IPercentageStatistic';
import IScaleBalanceItem from '../../interfaces/UI/IScaleBalanceItem';
import './UserHomeScreen.scss';


interface IUserHomeScreenProps {
    userService:IUserService;
    scale:IScale;
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
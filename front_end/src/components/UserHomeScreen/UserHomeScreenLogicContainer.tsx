import React, { Component } from 'react';
import IUserService from '../../interfaces/api_access/IUserService';
import IScale from '../../interfaces/IScale';
import IPercentageStatistic from '../../interfaces/UI/IPercentageStatistic';
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
    
    
    
    generateCategoryPercentageStatisticsFromScale(scale:IScale):IPercentageStatistic[]
    {   
        //Firstly, we need to get the total, so we can figure out percentages of it
        const totalMinutes = scale.categories.reduce(
            (catAcc, category) => catAcc + category.actions.reduce(
                (actAcc, action) => actAcc + action.timespans.reduce(
                    (tsAcc, timespan) => (tsAcc + (timespan.minuteCount * action.weight)),
                    0
                ),
                0
            ), 
            0
        );
        
        
        // Now we make IPercentageStatistic objects, with the category/action percentages
        return scale.categories.map((category) => {
            
            let categoryPercentage = 0;
            
            const actionPercentages = category.actions.map(action => {
                
                const actionPercentageNum = action.timespans.reduce(
                    (acc, timespan) => {
                        const weightedMinuteCount = (timespan.minuteCount * action.weight);
                        
                        let percentageNum = 0;
                        if(totalMinutes > 0)
                            percentageNum = (weightedMinuteCount / totalMinutes) * 100; //See https://www.bbc.co.uk/bitesize/guides/z9sgdxs/revision/3
                        
                        return (acc + percentageNum);
                    }, 
                    0
                );
                
                categoryPercentage += actionPercentageNum;
                
                return {
                    id: action.id,
                    label: action.name,
                    percentage: actionPercentageNum
                };
                
            });
            
            return {
                id: category.id,
                label: category.name,
                percentage: categoryPercentage,
                children: actionPercentages
            };
            
        });
    }
    
    
    
    
    
    
    
    render()
    {
        const statistics = 
            (!this.state.selectedScale) ? [] : this.generateCategoryPercentageStatisticsFromScale(this.state.selectedScale);
        
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
                    statistics={statistics} />
            </div>
        );
    }
    
}
import React, { Component } from 'react';
import IUserService from '../../interfaces/api_access/IUserService';
import ICategory from '../../interfaces/ICategory';
import IScale from '../../interfaces/IScale';
import IPercentageStatistic from '../../interfaces/UI/IPercentageStatistic';
import IScaleBalanceItem from '../../interfaces/UI/IScaleBalanceItem';
import CategoryColorProvider from '../../utility_classes/CategoryColorProvider/CategoryColorProvider';
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
    
    categoryColorProvider:CategoryColorProvider;
};

interface IUserHomeScreenLogicContainerState {
    scales:IScale[];
    selectedScale?:IScale;
    scaleLoadingError:string;
};




/*
	Wrapper component that controls the business logic for the UserHomeScreen component.
	See the UserHomeScreen component for more description.
*/
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
    
    
    
    
    
    
    
    
    
    //If the correct percentageStatistic cannot be found for a category, the item weight is set to 0
    generateCatgeoryBalanceItems(categories:ICategory[], percentageStatistics:IPercentageStatistic[]):IScaleBalanceItem[]
    {
        return categories.map((category) => {
            
            let color = this.props.categoryColorProvider.getRealColorFromName(category.color);
            if(!color)
                color = "white";
            
            const percentageStat = percentageStatistics.find(stat => stat.id === category.id);
            let percentage = 0;
            if(percentageStat)
                percentage = percentageStat.percentage
            
            return {
                label: category.name,
                weight: percentage,
                color
            }
        });
    }
    
    generateCategoryPercentageStatistics(categories:ICategory[], displayDayCount:number):IPercentageStatistic[]
    {   
        // Get the oldest date that can be included
        const millisecondsToRemove = (3600 * 1000 * 24) * (displayDayCount - 1); //Remove 1, as if dayCount is 0, the date should be tomorrow
        const oldestIncludedDateTime = new Date(Date.now() - millisecondsToRemove).setHours(0, 0, 0, 0); //Returns the milliseconds we want 
        
        //Firstly, we need to get the total, so we can figure out percentages of it
        const totalMinutes = categories.reduce(
            (catAcc, category) => catAcc + category.actions.reduce(
                (actAcc, action) => actAcc + action.timespans.reduce(
                    (tsAcc, timespan) => (timespan.date.getTime() >= oldestIncludedDateTime) ? (tsAcc + (timespan.minuteCount * action.weight)) : 0,
                    0
                ),
                0
            ), 
            0
        );
        
        
        // Now we make IPercentageStatistic objects, with the category/action percentages
        return categories.map((category) => {
            
            let categoryPercentage = 0;
            
            const actionPercentages = category.actions.map(action => {
                
                const actionPercentageNum = action.timespans.reduce(
                    (acc, timespan) => {
                        
                        if(timespan.date.getTime() < oldestIncludedDateTime)
                            return acc;
                        
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
    
    
    
    
    
    
    onSuccessfulTimespanSaveHandler()
    {
        //Reload the scale, to get all the new timespan data
        //We need this to keep the scales balances, and statistics, up to date
        
        let scaleLoadingError:string = "";
        let selectedScale:IScale|undefined;
        
        if(this.props.selectedScaleID)
        {
            selectedScale = this.props.userService.getScale(this.props.selectedScaleID);
            if(!selectedScale)
                scaleLoadingError = this.stdScaleLoadErrorMessage;
        }
        
        this.setState({
            selectedScale,
            scaleLoadingError
        });
    }
    
    
    
    
    
    
    render()
    {
        let statistics:IPercentageStatistic[] = [];
        let currentBalanceItems:IScaleBalanceItem[] = [];
        let desiredBalanceItems:IScaleBalanceItem[] = [];
        
        if(this.state.selectedScale)
        {
            const categories = this.state.selectedScale.categories;
            statistics = this.generateCategoryPercentageStatistics(categories, this.state.selectedScale.displayDayCount);
            currentBalanceItems = this.generateCatgeoryBalanceItems(categories, statistics);
            
            //Using the desired weights as the percentages
            desiredBalanceItems = this.generateCatgeoryBalanceItems(categories, categories.map(category => ({
                id: category.id,
                label: category.name,
                percentage: category.desiredWeight
            })));
        }
        
        
        return (
            <div className="UserHomeScreenLogicContainer">
                <UserHomeScreen 
                    userService={this.props.userService}
                    scales={this.state.scales}
                    selectedScale={this.state.selectedScale}
                    scaleLoadingError={this.state.scaleLoadingError}
                    
                    onSuccessfulLogout={this.props.onSuccessfulLogout}
                    editScaleCallback={() => this.props.editScaleCallback(this.props.selectedScaleID || "")}
                    onSuccessfulTimespanSave={this.onSuccessfulTimespanSaveHandler.bind(this)}
                    amendHistoryCallback={() => this.props.amendHistoryCallback(this.props.selectedScaleID || "")}
                    
                    editUserURL={this.props.editUserURL}
                    createScaleURL={this.props.createScaleURL}
                    scaleURLBase={this.props.scaleURLBase}
                    
                    desiredBalanceItems={desiredBalanceItems}
                    currentBalanceItems={currentBalanceItems}
                    statistics={statistics} />
            </div>
        );
    }
    
}
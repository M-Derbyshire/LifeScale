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
    statistics:IPercentageStatistic[];
    currentBalanceItems:IScaleBalanceItem[];
    desiredBalanceItems:IScaleBalanceItem[];
};




/*
	Wrapper component that controls the business logic for the UserHomeScreen component.
	See the UserHomeScreen component for more description.
*/
export default class UserHomeScreenLogicContainer
    extends Component<IUserHomeScreenLogicContainerProps, IUserHomeScreenLogicContainerState>
{
    
    static stdScaleLoadErrorMessage = "Unable to load the selected scale.";
    
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
        
        //If no loading error -- and either there's a selectedScaleID, or scales available
        if(!scaleLoadingError)
        {
            if(this.props.selectedScaleID)
            {
                selectedScale = this.props.userService.getScale(this.props.selectedScaleID);
            }
            else if(scales.length > 0)
            {
                selectedScale = scales[0];
            }
            
            if(!selectedScale)
                    scaleLoadingError = UserHomeScreenLogicContainer.stdScaleLoadErrorMessage;
        }
        
        
        
        
        this.state = {
            scaleLoadingError,
            scales,
            selectedScale,
            
            //Set the below when getDerviedStateFromProps runs
            statistics: [],
            currentBalanceItems: [],
            desiredBalanceItems: []
        };
    }
    
    
    static getDerivedStateFromProps(props:IUserHomeScreenLogicContainerProps, state:IUserHomeScreenLogicContainerState)
    {
        return { ...state, ...UserHomeScreenLogicContainer.regenerateScaleAndTimespanDisplays(props, state) };
    }
    
    
    
    
    
    //Regenerate the statistics and scale balance items, from a newly refreshed scale
    static regenerateScaleAndTimespanDisplays(props:IUserHomeScreenLogicContainerProps, state:IUserHomeScreenLogicContainerState):{
        statistics:IPercentageStatistic[],
        currentBalanceItems:IScaleBalanceItem[],
        desiredBalanceItems:IScaleBalanceItem[],
        scaleLoadingError:string,
        selectedScale:IScale|undefined
    }
    {
        let statistics:IPercentageStatistic[] = [];
        let currentBalanceItems:IScaleBalanceItem[] = [];
        let desiredBalanceItems:IScaleBalanceItem[] = [];
        let scaleLoadingError:string = state.scaleLoadingError;
        let selectedScale:IScale|undefined = state.selectedScale;
        
        
        if(props.selectedScaleID)
        {
            selectedScale = props.userService.getScale(props.selectedScaleID);
            
            if(!selectedScale)
                scaleLoadingError = this.stdScaleLoadErrorMessage;
            else
            {
                const categories = selectedScale.categories;
                statistics = this.generateCategoryPercentageStatistics(categories, selectedScale.displayDayCount);
                currentBalanceItems = this.generateCatgeoryBalanceItems(categories, statistics, props.categoryColorProvider);
                
                
                //Categories can't change while this component is still mounted, so only run if none already set
                if(!state.desiredBalanceItems || state.desiredBalanceItems.length === 0)
                {   
                    //Using the desired weights as the percentages
                    desiredBalanceItems = this.generateCatgeoryBalanceItems(categories, categories.map(category => ({
                        id: category.id,
                        label: category.name,
                        percentage: category.desiredWeight
                    })), props.categoryColorProvider); 
                }
                
            }
        }
        
        
        return {
            statistics,
            currentBalanceItems,
            desiredBalanceItems,
            scaleLoadingError,
            selectedScale
        };
        
    }
    
    
    
    
    
    
    
    //If the correct percentageStatistic cannot be found for a category, the item weight is set to 0
    static generateCatgeoryBalanceItems(
        categories:ICategory[], 
        percentageStatistics:IPercentageStatistic[], 
        categoryColorProvider:CategoryColorProvider):IScaleBalanceItem[]
    {
        return categories.map((category) => {
            
            let color = categoryColorProvider.getRealColorFromName(category.color);
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
    
    static generateCategoryPercentageStatistics(categories:ICategory[], displayDayCount:number):IPercentageStatistic[]
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
       this.setState({ ...UserHomeScreenLogicContainer.regenerateScaleAndTimespanDisplays(this.props, this.state) });
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
                    editScaleCallback={() => this.props.editScaleCallback(this.props.selectedScaleID || "")}
                    onSuccessfulTimespanSave={this.onSuccessfulTimespanSaveHandler.bind(this)}
                    amendHistoryCallback={() => this.props.amendHistoryCallback(this.props.selectedScaleID || "")}
                    
                    editUserURL={this.props.editUserURL}
                    createScaleURL={this.props.createScaleURL}
                    scaleURLBase={this.props.scaleURLBase}
                    
                    desiredBalanceItems={this.state.desiredBalanceItems}
                    currentBalanceItems={this.state.currentBalanceItems}
                    statistics={this.state.statistics} />
            </div>
        );
    }
    
}
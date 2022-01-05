import React from 'react';
import './App.scss';
import AmendActionHistoryPage from '../AmendActionHistoryPage/AmendActionHistoryPage';
import ITimespan from '../../interfaces/ITimespan';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	const dummySubmit = ()=>console.log("submitted");
	
	return (
		<div className="App">
			<AmendActionHistoryPage 
				backButtonHandler={dummySubmit}
				items={[
					{
						categoryName: "test1",
						actionName: "test1",
						timespan: {
							id: "akjshfashfahss1",
							date: new Date(),
							minuteCount: 60
						},
						deleteHandler: dummySubmit
					},
					{
						categoryName: "test2",
						actionName: "test2",
						timespan: {
							id: "lkdjasjdklajd",
							date: new Date(),
							minuteCount: 60
						},
						deleteHandler: dummySubmit
					}
				]}
				newRecordedAction={{
						categories: [{
							id: "test1",
							name: "testcat1",
							color:"red",
							desiredWeight:1,
							actions:[{
								id:"testact1",
								name:"testact1",
								weight:1,
								timespans:[]
							}]
						}],
						selectedCategoryID: "test1",
						setSelectedCategoryID: (category:string)=>{},
						
						selectedActionID:"test1",
						setSelectedActionID: (action:string)=>{},
						
						usesTimespans: true,
						timespan: {
							id: "dkajslasdj",
							date: new Date(),
							minuteCount: 60
						},
						setTimespan: (timespan:ITimespan)=>{},
						
						onSubmit: ()=>{},
						badSaveErrorMessage: "testbaderror",
						goodSaveMessage: "testgooderror"
					}} />
		</div>
	);
}

export default App;

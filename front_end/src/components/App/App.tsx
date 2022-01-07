import React from 'react';
import './App.scss';
import CardDisplay from '../CardDisplay/CardDisplay';
import EditableItemCard from '../EditableItemCard/EditableItemCard';
import AddItemCard from '../AddItemCard/AddItemCard';

function App() {
	
	const dummyEmpty = (x:any)=>console.log(x);
	const dummySubmit = ()=>console.log("submitted");
	
	return (
		<div className="App">
			<CardDisplay emptyDisplayMessage="There are no categories created for this scale.">
				<EditableItemCard name="test1" editCallback={dummySubmit} />
				<EditableItemCard name="test2" editCallback={dummySubmit} />
				<EditableItemCard name="test3" editCallback={dummySubmit} />
				<EditableItemCard name="test4" editCallback={dummySubmit} />
				<AddItemCard onClick={dummySubmit} />
			</CardDisplay>
		</div>
	);
}

export default App;

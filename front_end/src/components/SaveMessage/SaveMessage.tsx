import './SaveMessage.scss';
import React, { Component } from 'react';

type SaveMessageProps = {
	message:string;
	removeMessageCallback?:()=>void;
};

class SaveMessage extends Component<SaveMessageProps> {
	
	foreColor:string = "initial";
	backColor:string = "initial";
	
	render()
	{
		return (
			<div className="SaveMessage">
				<span className="message">{this.props.message}</span>
			</div>
		);
	}
	
}

export default SaveMessage;
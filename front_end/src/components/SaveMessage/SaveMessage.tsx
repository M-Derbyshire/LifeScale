import './SaveMessage.scss';
import React, { Component } from 'react';

type SaveMessageProps = {
	message:string;
	removeMessageCallback?:()=>void;
};

class SaveMessage extends Component<SaveMessageProps> {
	
	foreColor:string = "default";
	backColor:string = "default";
	
	render()
	{
		return (
			<div className="SaveMessage" style={{ borderColor:this.foreColor, color: this.foreColor, backgroundColor: this.backColor }}>
				<span className="close" onClick={this.props.removeMessageCallback}>X</span>
				<br/>
				<span className="message">{this.props.message}</span>
			</div>
		);
	}
	
}

export default SaveMessage;
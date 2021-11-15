import './SaveMessage.scss';
import React, { Component } from 'react';

type SaveMessageProps = {
	message:string;
	removeMessageCallback?:()=>void;
};

/*
	This is a base class for the good/bad save messages. They should be used instead of this
*/
class SaveMessage extends Component<SaveMessageProps> {
	
	foreColor:string = "default";
	backColor:string = "default";
	className:string|undefined;
	
	render()
	{
		const classList = "SaveMessage" + ((this.className) ? ` ${this.className}` : "");
		
		return (
			<div className={classList} style={{ borderColor:this.foreColor, color: this.foreColor, backgroundColor: this.backColor }}>
				{this.props.removeMessageCallback && 
					<div><span className="close" onClick={this.props.removeMessageCallback}>X</span><br/></div>}
				
				<span className="message">{this.props.message}</span>
			</div>
		);
	}
	
}

export default SaveMessage;
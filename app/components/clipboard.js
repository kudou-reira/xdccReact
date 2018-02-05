import React, { Component } from 'react';
import Subheader from 'material-ui/Subheader';
import { connect } from 'react-redux';
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import * as actions from '../actions';
import {CopyToClipboard} from 'react-copy-to-clipboard';

class Clipboard extends Component {
	constructor() {
		super();
		this.state = {
			copied: false
		}

		this.removeMessage = this.removeMessage.bind(this);
		this.setCopy = this.setCopy.bind(this);
	}

	removeMessage(item) {
		console.log("this is the removeButton", item);
		this.props.deleteMessageQueue(item);
	}

	clearMessages() {
		console.log("this is the clearButton");
		this.props.clearMessageQueue();
	}

	setCopy() {
    this.setState({ copied: true });
    setTimeout(function(){
         this.setState({copied: false});
    }.bind(this),2000);
  }

	generateMessageElements() {
		var tempMessageElements;
		if(this.props.message.messages !== null) {
			return tempMessageElements = this.props.message.messages.map((temp, index) => {
				return(
					<ListItem
	          key={index}
	          rightIconButton={
	          	<RaisedButton 
					  		label="Remove" 
					  		style={{marginTop: 5.5, marginRight: 5}}
					  		onClick={() => this.removeMessage(temp)} 
				  		/>
	          }
	          primaryText={temp}
	          primaryTogglesNestedList={true}
	        />
				);
			});
		}
	}

	processMessages() {
		var processedMessages;
		processedMessages = this.props.message.messages.join(" ");
		return processedMessages;
	}

	renderOverallMessages() {
		if(this.props.message.messages !== null) {
			if(this.props.message.messages.length > 0) {
				return(
					<div>
						<List>
		          <Subheader>Current Saved Message Calls</Subheader>
		          {this.generateMessageElements()}
		        </List>
					</div>
				);
			}
		}
	}

	renderClearButton() {
		if(this.props.message.messages !== null) {
			if(this.props.message.messages.length > 0) {
				return(
					<RaisedButton
						labelStyle={{ fontSize: 12 }} 
			  		label="Clear Messages" 
			  		style={{marginLeft: 5, marginRight: 5}}
			  		onClick={() => this.clearMessages()} 
			  	/>
				);
			}
		}
	} 

	renderCopyMessages() {
		if(this.props.message.messages !== null) {
			if(this.props.message.messages.length > 0) {
				return(
					<CopyToClipboard
						text={this.processMessages()}
						onCopy={() => this.setCopy()}
					>
						<RaisedButton
							labelStyle={{ fontSize: 12 }} 
				  		label="Copy Messages" 
				  		style={{marginLeft: 5, marginRight: 5}}
				  	/>
				  </CopyToClipboard>
				);
			}
		}
	}

	render() {
		return(
			<div>
				{this.state.copied ? <span style={{color: 'red'}}>Copied.</span> : null}
				<div>
					<div id="floatRight">
						{this.renderCopyMessages()}
					</div>
					<div id="floatRight">
						{this.renderClearButton()}
					</div>
				</div>
				{this.renderOverallMessages()}
			</div>
		);
	}
}

function mapStateToProps(state) {
  return {
    message: state.message
  }
}

export default connect(mapStateToProps, actions)(Clipboard);
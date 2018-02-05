import React, { Component } from 'react';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import * as actions from '../actions';

class TempSearchQueuePanel extends Component {

	constructor() {
		super();
		this.removeQueue = this.removeQueue.bind(this);
	}

	removeQueue(item) {
		console.log("this is the removeButton", item);
		this.props.deleteTempQueue(item);
	}

	clearQueue() {
		console.log("this is the clearButton");
		this.props.clearTempQueue();
	}

	sendQueue() {
		console.log("this is send queue");
		this.props.sendTempQueue(this.props.tempQueue.stack);
	}

	generateTempQueueElements() {
		var tempQueueElements;
		if(this.props.tempQueue.stack !== null) {
			return tempQueueElements = this.props.tempQueue.stack.map((temp, index) => {
				console.log("this is temp", temp);
				return(
					<ListItem
	          key={index}
	          rightIconButton={
	          	<RaisedButton 
					  		label="Remove" 
					  		style={{marginTop: 5.5, marginRight: 5}}
					  		onClick={() => this.removeQueue(temp)} 
				  		/>
	          }
	          primaryText={temp}
	          primaryTogglesNestedList={true}
	        />
				);
			});
		}
	}

	renderOverallQueue() {
		if(this.props.tempQueue.stack !== null) {
			if(this.props.tempQueue.stack.length > 0) {
				return(
					<div>
						<List>
		          <Subheader>Current Search Queue</Subheader>
		          {this.generateTempQueueElements()}
		        </List>
					</div>
				);
			}
		}
	}

	renderSendQueueButton() {
		if(this.props.tempQueue.stack !== null) {
			if(this.props.tempQueue.stack.length > 0) {
				return(
					<RaisedButton
						labelStyle={{ fontSize: 12 }} 
			  		label="Send Queue" 
			  		style={{marginLeft: 5, marginRight: 5}}
			  		onClick={() => this.sendQueue()} 
			  	/>
				);
			}
		}
	} 

	renderClearButton() {
		if(this.props.tempQueue.stack !== null) {
			if(this.props.tempQueue.stack.length > 0) {
				return(
					<RaisedButton
						labelStyle={{ fontSize: 12 }} 
			  		label="Clear Queue" 
			  		style={{marginLeft: 5, marginRight: 5}}
			  		onClick={() => this.clearQueue()} 
			  	/>
				);
			}
		}
	} 

	render() {
		console.log("this is the downloadList", this.props.downloadList);
		return(
			<div>
				<div>
					<div id="floatRight">
						{this.renderSendQueueButton()}
					</div>
					<div id="floatRight">
						{this.renderClearButton()}
					</div>
				</div>
				{this.renderOverallQueue()}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		tempQueue: state.tempQueue,
		downloadList: state.downloadList
	}
}

export default connect(mapStateToProps, actions)(TempSearchQueuePanel);
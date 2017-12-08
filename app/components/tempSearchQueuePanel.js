import React, { Component } from 'react';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import * as actions from '../actions';

class TempSearchQueuePanel extends Component {

	constructor() {
		super();
		this.removeButton = this.removeButton.bind(this);
	}

	// componentWillReceiveProps(nextProps){
	// 	if(nextProps.download !== null){
	// 		console.log("this is nextProps sending!!!!!!!!!!!!!!!!!")
	// 		this.props.downloadWindowSend(nextProps.download);
	// 		// if(nextProps.download !== null) {

	// 		// 	this.props.downloadWindowSend(nextProps.download);
	// 		// }
	// 	}
	// }

	removeButton(item) {
		console.log("this is the removeButton", item);
		this.props.deleteTempQueue(item);
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
					  		onClick={() => this.removeButton(temp)} 
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
			  		style={{marginLeft: 12, marginRight: 5}}
			  		onClick={() => this.sendQueue()} 
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
					Current Temporary Queue
					{this.renderSendQueueButton()}
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
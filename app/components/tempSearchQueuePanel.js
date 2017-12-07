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

	removeButton(item) {
		console.log("this is the removeButton", item);
		this.props.deleteTempQueue(item);
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

	render() {
		return(
			<div>
				<div>
					Current Temporary Queue
				</div>
				{this.renderOverallQueue()}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		tempQueue: state.tempQueue
	}
}

export default connect(mapStateToProps, actions)(TempSearchQueuePanel);
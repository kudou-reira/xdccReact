import React, { Component } from 'react';
import _ from 'lodash';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import RaisedButton from 'material-ui/RaisedButton';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Clipboard from './clipboard';

class DownloadListPanel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			downloadBots: []
		}

		this.handleNestedListToggle = this.handleNestedListToggle.bind(this);
		this.removeFromDownload = this.removeFromDownload.bind(this);
		this.clearAllDownloads = this.clearAllDownloads.bind(this);
		this.startDownloads = this.startDownloads.bind(this);
    this.onMessageClicked = this.onMessageClicked.bind(this);
	}

	handleNestedListToggle(item) {
    this.setState({
      open: item.state.open
    });
  };

  removeFromDownload(item) {
  	console.log("ITEMMMMMMMMMMMMMMMMMMMMMMMMMMMM", item);
  	this.props.removeDownload(item);
  }

  clearAllDownloads() {
  	this.props.clearDownload();
  }

  startDownloads() {
  	console.log("this is startDownloads in react", this.props.list.download);
  	this.props.startDownloads(this.props.list.download);
  }

  onMessageClicked(message) {
    //alter this to add to an array
    var tempHoldMessages = this.props.message.messages;
    if(this.props.message.messages === null) {
      tempHoldMessages = [];
    }

    var inArr = _.includes(tempHoldMessages, message);

    console.log("this is inArr", inArr);

    if(inArr === false) {
      tempHoldMessages.push(message);
      this.props.updateMessageQueue(tempHoldMessages, () => {
        console.log("these are new props", this.props.message.messages);
      });
    };

      // should make this into a reducer
  }

  renderIconButton(message) {
    return(
      <div>
        <RaisedButton 
          label="Add message call" 
          style={{marginTop: 5.5, marginRight: 5}}
          onClick={() => this.onMessageClicked(message)} 
        />
      </div>
    );
  }

  generateDownloadDetails(downloadDetails) {
  	var downloadContent = downloadDetails.BotSpecies.map((details, index) => {
  		return(
  			<ListItem
  				key={index}
          rightIconButton={
            this.renderIconButton(details.MessageCall)
          }
  			>
  				{this.generateIndividualBotDetails(details)}
  			</ListItem>
  		);
  	});

  	return downloadContent;
  }

  generateIndividualBotDetails(botDetails) {
  	return(
  		<div>
  			<div>
  				Bot Name: {botDetails.BotName}
  			</div>
  			<div>
  				File Size: {botDetails.FileSize}
  			</div>
  			<div>
  				Pack Number: {botDetails.PackNumber}
  			</div>
  			<div>
  				Message Call: {botDetails.MessageCall}
  			</div>
  		</div>
  	);
  }

  renderClearButton() {
  	return(
      <RaisedButton 
	  		label="Clear Download Queue" 
	  		style={{marginLeft: 15, marginRight: 5}}
	  		onClick={() => this.clearAllDownloads()} 
	  	/>
  	)
  }

  renderStartButton() {
  	if(this.props.list.download !== null) {
 	  	return(
	      <RaisedButton 
		  		label="Start Downloads" 
		  		style={{marginLeft: 5.5, marginRight: 5}}
		  		onClick={() => this.startDownloads()}
		  	/>
  		)
  	}
  }

	renderDownloadList() {
		var downloadList;
		if(this.props.list.download !== null) {
			downloadList = this.props.list.download.map((download, index) => {
				return(
					<ListItem
	          key={index}
	          primaryText={download.BotOverall[0].FileName}
	          primaryTogglesNestedList={true}
        		onNestedListToggle={this.handleNestedListToggle}
            nestedItems={this.generateDownloadDetails(download.BotOverall[0])}
             rightIconButton={
	          	<RaisedButton 
					  		label="Remove" 
					  		style={{marginTop: 5.5, marginRight: 5}}
					  		onClick={() => this.removeFromDownload(download)} 
					  	/>
	          }
	        >
          </ListItem>
				);
			});
		}
		return downloadList;
	}


  renderFilledOrNot() {
    var returnDiv;
    if(this.props.message.messages !== null) {
      if(this.props.message.messages.length > 0) {
        returnDiv = (
          <div id="wrapper">
            <div id="left">
              This is the download list
              {this.renderClearButton()}
              {this.renderStartButton()}
              <div>
                <List>
                  <Subheader>Download List</Subheader>
                  {this.renderDownloadList()}
                </List>
              </div>
            </div>
            <div id="right">
              <Clipboard />
            </div>
          </div>
        );
      }
    }

    else {
      returnDiv = (
        <div>
          This is the download list
          {this.renderClearButton()}
          {this.renderStartButton()}
          <div>
            <List>
              <Subheader>Download List</Subheader>
              {this.renderDownloadList()}
            </List>
          </div>
        </div>
      );
    }

    return returnDiv;
  }

	render() {
		console.log("this is the downloadlist panel", this.props);
    console.log("these are props for messages", this.props.message.messages);
		return(
      <div>

  			{this.renderFilledOrNot()}
      </div>
		);
	}
}

function mapStateToProps(state) {
  return {
    message: state.message
  }
}

export default connect(mapStateToProps, actions)(DownloadListPanel);
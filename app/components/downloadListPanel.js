import React, { Component } from 'react';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

class DownloadListPanel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			downloadBots: []
		}

		this.handleNestedListToggle = this.handleNestedListToggle.bind(this);
		this.onDownloadClick = this.onDownloadClick.bind(this);
	}

	handleNestedListToggle(item) {
    this.setState({
      open: item.state.open
    });
  };

  onDownloadClick(item) {
  	console.log("ITEMMMMMMMMMMMMMMMMMMMMMMMMMMMM", item);
  }

  generateDownloadDetails(downloadDetails) {
  	var downloadContent = downloadDetails.BotSpecies.map((details, index) => {
  		return(
  			<ListItem
  				key={index}
  				primaryText={'hello'}
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
            onClick={() => {this.onDownloadClick(download.BotOverall[0])}}
	        />
				);
			});
		}
		return downloadList;
	}

	render() {
		console.log("this is the downloadlist panel", this.props);
		return(
			<div>
				This is the download list
				<div>
					<List>
		        <Subheader>Download List</Subheader>
		        {this.renderDownloadList()}
		      </List>
				</div>
			</div>
		);
	}
}

export default DownloadListPanel;
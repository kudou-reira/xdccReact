import React, { Component } from 'react';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

class DownloadListPanel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		}

		this.handleNestedListToggle = this.handleNestedListToggle.bind(this);
	}

	handleNestedListToggle(item) {
    this.setState({
      open: item.state.open
    });
  };

  generateDownloadDetails(downloadDetails) {
  	console.log("this is downloadDetails", downloadDetails);
  	var downloadContent = (
  		<ListItem
  				key={index}
  				primaryText={'hello'}
  			>
  			
  		</ListItem>
  	);

  	return downloadContent;
  }

	renderDownloadList() {
		var downloadList;
		if(this.props.list.download !== null) {
			if(this.props.list.download.botSearches !== null) {
				downloadList = this.props.list.download.botSearches.map((download, index) => {
					console.log("this is download", download.BotOverall[0]);
					return(
						<ListItem
		          key={index}
		          primaryText={download.BotOverall[0].FileName}
		          primaryTogglesNestedList={true}
          		onNestedListToggle={this.handleNestedListToggle}
	            nestedItems={this.generateDownloadDetails(download.BotOverall[0])}
		        />
					);
				});
			}
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
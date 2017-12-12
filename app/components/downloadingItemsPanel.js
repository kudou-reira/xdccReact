import React, { Component } from 'react';
import { ipcRenderer }  from 'electron';

ipcRenderer.on('connect:XDCC',  (event, percent) => {
	console.log("this is the percent in react panel downloading", percent);
});

class DownloadingItemsPanel extends Component {
	constructor(props) {
		super(props);
	}

	renderMessageCalls() {
		var tempMessageCalls;
		if(this.props.items.download !== null) {
			tempMessageCalls = this.props.items.download.map((item, index) => {
				return(
					<div>
						{item.MessageCall}
					</div>
				)
			});
		}
		return tempMessageCalls
	}

	render(){
		console.log("this is DownloadingItemsPanel", this.props.items)
		return(
			<div>
				this is the DownloadingItemsPanel
				<br />
				{this.renderMessageCalls()}
			</div>
		);
	}
}

export default DownloadingItemsPanel;
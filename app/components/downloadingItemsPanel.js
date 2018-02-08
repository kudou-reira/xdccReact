import React, { Component } from 'react';
import { ipcRenderer }  from 'electron';
import _ from 'lodash';
import Progress from 'react-progressbar';
import throttle from 'react-throttle-render';
import debounceRender from 'react-debounce-render';

// can maybe use svg icons to get anime icon info from an api
// myanimelist?
// atarashii?
// https://github.com/AniList/ApiV2-GraphQL-Docs


class DownloadingItemsPanel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentDownloads: []
		}
	}

	componentDidMount() {
		ipcRenderer.on('connect:XDCC',  (event, dataProgress) => {
			var tempFile = dataProgress;

			// console.log("this is the percent in react panel fileName", dataProgress.fileName);
			// console.log("this is the percent in react panel downloading", dataProgress.percent);


			// this returns undefined
			var inArray = _.find(this.state.currentDownloads, { fileName: tempFile.fileName });

			// console.log("is this file name in current downloads", inArray);

			if (inArray) {
				// console.log("already in state");
				// update the state value
				var tempAll = this.state.currentDownloads;
				var index = _.findIndex(tempAll, function(item) {
					return item.fileName === tempFile.fileName;
				});

				// console.log("this is the index of the found item", index);
				if(tempFile.percent !== null) {
					tempAll[index].percent = tempFile.percent;
				}

				if(tempFile.completed) {
					tempAll[index].completed = tempFile.completed;
					tempAll[index].filePath = tempFile.filePath;
				}

				if(tempFile.error) {
					tempAll[index].error = tempFile.error;
				}

				this.setState({
					currentDownloads: tempAll
				}, () => {
					// console.log("this is DownloadingItemsPanel state", this.state.currentDownloads);
				});
			} else {
				// console.log("not in state");
				var tempAll = this.state.currentDownloads;
				tempAll.push(tempFile);

				this.setState({
					currentDownloads: tempAll
				}, () => {
					// console.log("this is DownloadingItemsPanel state", this.state.currentDownloads);
					// now call this with a redux method?
				})
			}

		});
	}

	// shouldComponentUpdate() {
	// 	ipcRenderer.on('connect:XDCC',  (event, dataProgress) => {
	// 		console.log("this is should componentUpdate");

	// 		this.setState({
	// 			currentDownloads: dataProgress
	// 		}, () => {
	// 			console.log("COMPONENT SHOULD UPDATE", this.state.currentDownloads);
	// 		})
	// 	});
	// }

	renderMessageCalls() {
		var tempMessageCalls;
		if(this.props.items.download !== null) {
			tempMessageCalls = this.props.items.download.map((item, index) => {
				return(
					<div>
						this is message call
						{item.MessageCall}
					</div>
				)
			});
		}
		return tempMessageCalls;
	}

	renderCompleted(item) {
		var completed;
		console.log("this is the item", item);
		if(item.completed === true) {
			completed = (
				<div id="text">
					<div>
						&nbsp;Download completed!
					</div>
					<div>
						See in directory &nbsp; {item.filePath}
					</div>
				</div>
			);
		}
		return completed;
	}

	renderError(item) {
		var error;
		console.log("this is the item", item);
		if(item.error) {
			completed = (
				<div id="text">
					<div>
						There was an error:
					</div>
					<div>
						{item.error}
					</div>
				</div>
			);
		}
		return error;
	}

	renderPercent() {
		var filePercents;
		filePercents = this.state.currentDownloads.map((item, index) => {
			return(
				<div>
					<div>
						{item.fileName}
					</div>
					<div>
						{item.percent}
					</div>
					{this.renderCompleted(item)}
					{this.renderError(item)}
					<div>
		        		<Progress completed={item.percent} />
		      		</div>
				</div>
			);
		})
	
		return filePercents;
	}

	render(){
		return(
			<div>
				this is the DownloadingItemsPanel
				<br />
				{this.renderMessageCalls()}
				<div>
					{this.renderPercent()}
				</div>
			</div>
		);
	}
}

export default debounceRender(DownloadingItemsPanel, 500, { leading: false });
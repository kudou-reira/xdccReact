import React, { Component } from 'react';

class DownloadListScreen extends Component {
	nativeWindowObject = null;
	componentWillMount() {
		this.nativeWindowObject = window.open('');
	}
	
	render(){
		return(
			return this.nativeWindowObject ? ReactDOM.createPortal(this.props.children, this.nativeWindowObject.document.body) : null
		);
	}
}

export default DownloadListScreen;
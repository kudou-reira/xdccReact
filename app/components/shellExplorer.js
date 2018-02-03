import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import * as actions from '../actions';

class ShellExplorer extends Component {

	constructor() {
		super();
		this.state = {
			shellLocation: ''
		}
		this.shellButtonClicked = this.shellButtonClicked.bind(this);
	}
 
	componentDidMount() {
		this.props.defaultShell();
		console.log("default shell ran");
	}

	shellButtonClicked() {
		console.log("this is shell button clicked");
		this.props.openShell();
	}

	render(){
		console.log("this is props shellpath", this.props.shellPath);
		return(
			<div>
				<br />
				<div id="text">
            <div>
              <p>Current Save Location: </p>
            </div>
            <div>
              &nbsp;{this.props.shellPath.path}
            </div>
          </div>
				<div>
					<br />
					<RaisedButton 
			  		label="Change file save location" 
			  		style={{marginTop: 5.5, marginRight: 5}}
			  		onClick={() => this.shellButtonClicked()} 
			  	/>
				</div>
			</div>
		);
	}
} 

function mapStateToProps(state) {
	return {
		shellPath: state.shellPath
	}
}

export default connect(mapStateToProps, actions)(ShellExplorer);
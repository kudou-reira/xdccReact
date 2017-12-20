import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class AnimeChartPanel extends Component {
	componentDidMount() {
		this.props.fetchAnime("FALL", "2017%");
	}

	renderAnimeChart() {
		var anime;
		if(this.props.animeList.anime !== null) {
			anime = this.props.animeList.anime.media.map((anime) => {
				return(
						<div className="card">
							{anime.title.userPreferred}
						</div>
				);
			});
		} else if (this.props.animeList.anime === null) {
			anime = (
				<div>
					Loading...
				</div>
			);
		}

		return anime;
	}

	render() {
		return(
			<div>
				this is the anime chart
				<div className="cards">
					{this.renderAnimeChart()}
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		animeList: state.animeList
	}
}

export default connect(mapStateToProps, actions)(AnimeChartPanel);
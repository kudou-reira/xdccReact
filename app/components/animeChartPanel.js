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
						<div 
							className="card"
							key={anime.id}
						>
							<div id="wide">
								<div className="center">
									<img src={anime.coverImage.large} />
								</div>
							</div>
							<div id="narrow">
								<div className="center">
									{anime.title.userPreferred}
								</div>
								<div>
									Summary
								</div>
							</div>
						</div>
				);
			});
		} 

		else if (this.props.animeList.anime === null) {
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
				<div className="center">
					this is the anime chart
				</div>
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
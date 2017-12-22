import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class AnimeChartPanel extends Component {
	constructor() {
		super();
		this.state = {
			series: true
		}
	}

	componentDidMount() {
		this.props.fetchAnime("FALL", "2017%");
	}

	renderAnimeChart() {
		var anime;
		if(this.props.animeList.anime !== null) {
			anime = this.props.animeList.anime.media.filter((media) => {
				return media.format === "TV";
			});

			console.log("this is filtered anime", anime);

			anime = anime.map((anime) => {
				return(
					<div 
						className="card"
						key={anime.id}
					>
						<div className="center" id="bottomMargin">
							overall
						</div>
						<div id="wide">
							<div className="center">
								<img src={anime.coverImage.large} />
							</div>
						</div>
						<div id="narrow">
							<div className="center">
								<h2>
									{anime.title.userPreferred}
								</h2>
							</div>
							<div id="topMargin">
								{this.formatDescription(anime.description)}
								<div id="alignRight">
									{this.formatSource(anime.description)}
								</div>
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

	renderMovieOva() {
		var movieOVA;
		if(this.props.animeList.anime !== null) {
			movieOVA = this.props.animeList.anime.media.filter((media) => {
				return media.format === "MOVIE" || media.format === "OVA";
			});

			console.log("this is filtered anime", anime);

			movieOVA = movieOVA.map((anime) => {
				return(
					<div 
						className="card"
						key={anime.id}
					>
						<div className="center">
							overall
						</div>
						<div id="wide">
							<div className="center">
								<img src={anime.coverImage.large} />
							</div>
						</div>
						<div id="narrow">
							<div className="center">
								<h2>
									{anime.title.userPreferred}
								</h2>
							</div>
							<div id="topMargin">
								{this.formatDescription(anime.description)}
								<div id="alignRight">
									{this.formatSource(anime.description)}
								</div>
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

	formatDescription(description) {
		console.log("this is description", description);
		description = description.replace(/<br\s*[\/]?>/gi, "")
		description = description.replace(/<i>/gi, "")
		description = description.replace(/<\/i>/gi, "")

		var parens = this.formatSource(description);
		// var i = this.formatI(description);


		console.log("this is parens", parens);

		description = description.replace(parens, "")
		// description = description.replace(i, "")

		var finalDescription = description.split('\n').map(function(item, key) {
		  return (
		    <span key={key}>
		      {item}
		    </span>
		  )
		});

		return finalDescription;
	}

	formatSource(description) {
		var parens;
		parens = description.match(/\(([^()]+)\)/g);
		console.log("this is parens", parens);
		if (parens !== null) {
			console.log("this is parens length", parens.length);
			return parens[parens.length-1]
		}
	}

	formatI(description) {
		var i;
		i = description.match(/<i>(.*?)<\/i>/g);
		console.log("this is i", i);
		if (i !== null) {
			console.log("this is the first element of i", i[0]);
			return i[0];
		}
	}

	replaceI(i) {
		if (i !== null) {
			i = i.replace(/<i>/gi, "");
			i = i.replace(/<\/i>/gi, "");
			return i;
		}
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
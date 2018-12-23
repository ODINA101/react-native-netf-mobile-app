import React, { PropTypes, Component } from 'react';
import {
	RefreshControl,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
	Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as moviesActions from './movies.actions';
import CardOne from './components/CardOne';
import CardTwo from './components/CardTwo';
import ProgressBar from '../_global/ProgressBar';
import styles from './styles/Movies';
import { iconsMap } from '../../utils/AppIcons';

class Movies extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			isRefreshing: false
		};

		this._viewMovie = this._viewMovie.bind(this);
		this._onRefresh = this._onRefresh.bind(this);
		this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
	}

	componentWillMount() {
		this._retrieveMovies();
	}

	componentWillReceiveProps(nextProps) {
	}

	_retrieveMovies(isRefreshed) {
		let p = this;
		this.props.actions.retrieveNowPlayingMovies("test",function(){
			p.props.actions.retrievePopularMovies("test",function(){
			p.props.actions.retrieveSeries(function() {
				p.setState({isLoading:false})

			})

			})

		});
		if (isRefreshed && this.setState({ isRefreshing: false }));
	}

	_viewMoviesList(type, title) {
		let rightButtons = [];
		if (Platform.OS === 'ios') {
			rightButtons = [
				{
					id: 'close',
					title: 'Close',
					icon: iconsMap['ios-close']
				}
			];
		}
		this.props.navigator.showModal({
			title,
			screen: 'movieapp.MoviesList',
			passProps: {
				type
			},
			navigatorButtons: {
				rightButtons
			}
		});
	}

	_viewMovie(movieId,info) {
		fetch(`http://net.adjara.com/req/jsondata/req.php?id=${info.id}&reqId=getInfo`)
		  .then(res => res.json())
		  .then(res => {
			if (res['1']) {
				console.log('serialia');
				this.props.navigator.showModal({
		 			screen: 'movieapp.Serie',
		 			passProps: {
		 				movieId,
		 				item:info
		 			},
		 			backButtonHidden: true,
		 			navigatorButtons: {
		 				rightButtons: [
		 					{
		 						id: 'close',
		 						icon: iconsMap['ios-arrow-round-down']
		 					}
		 				]
		 			}
		 		});
			} else {
				console.log('filmia');
				this.props.navigator.showModal({
		 			screen: 'movieapp.Movie',
		 			passProps: {
		 				movieId,
		 				item:info
		 			},
		 			backButtonHidden: true,
		 			navigatorButtons: {
		 				rightButtons: [
		 					{
		 						id: 'close',
		 						icon: iconsMap['ios-arrow-round-down']
		 					}
		 				]
		 			}
		 		});
			}
		});

	}

	_onRefresh() {
		this.setState({ isRefreshing: true });
		this._retrieveMovies('isRefreshed');
	}

	_onNavigatorEvent(event) {
		if (event.type === 'NavBarButtonPress') {
			if (event.id === 'search') {
				let rightButtons = [];
				if (Platform.OS === 'ios') {
					rightButtons = [
						{
							id: 'close',
							title: 'Close',
							icon: iconsMap['ios-close']
						}
					];
				}
				this.props.navigator.showModal({
					screen: 'movieapp.Search',
					title: 'Search',
					navigatorButtons: {
						rightButtons
					}
				});
			}
		}
	}

	render() {
		const { nowPlayingMovies, popularMovies,Series } = this.props;
		const iconPlay = <Icon name="md-play" size={21} color="#9F9F9F" style={{ paddingLeft: 3, width: 22 }} />;
		const iconTop = <Icon name="md-trending-up" size={21} color="#9F9F9F" style={{ width: 22 }} />;
		const iconUp = <Icon name="md-recording" size={21} color="#9F9F9F" style={{ width: 22 }} />;

		return (
			this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View> :
			<ScrollView
				style={styles.container}
				refreshControl={
					<RefreshControl
						refreshing={this.state.isRefreshing}
						onRefresh={this._onRefresh}
						colors={['#EA0000']}
						tintColor="white"
						title="loading..."
						titleColor="white"
						progressBackgroundColor="white"
					/>
				}>
				<Swiper
					autoplay
					autoplayTimeout={4}
					showsPagination={false}
					height={248}>
					{nowPlayingMovies.map(info => (
						<CardOne key={info.id} info={info}  viewMovie={() => this._viewMovie(info.id,info)} />
					))}
				</Swiper>
				<View>
					<View style={styles.listHeading}>
						<Text style={styles.listHeadingLeft}>ფილმები ქართულად</Text>
						<TouchableOpacity>
							<Text
								style={styles.listHeadingRight}
								onPress={this._viewMoviesList.bind(this, 'ფილმები ქართულად', 'ფილმები ქართულად')}>
								ყველა
							</Text>
						</TouchableOpacity>
					</View>
					<ScrollView horizontal showsHorizontalScrollIndicator={false}>
						{nowPlayingMovies.map(info => (
							<CardTwo key={info.id} info={info} viewMovie={() => this._viewMovie(info.id,info)} />
						))}
					</ScrollView>


					<View style={styles.listHeading}>
					<Text style={styles.listHeadingLeft}>სერიალები ქართულად</Text>
					<TouchableOpacity>
						<Text
							style={styles.listHeadingRight}
							onPress={this._viewMoviesList.bind(this, 'სერიალები ქართულად', 'სერიალები ქართულად')}>
             ყველა
						</Text>
					</TouchableOpacity>
				</View>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					{Series.map(info => (
						<CardTwo key={info.id} info={info} viewMovie={this._viewMovie} />
					))}
				</ScrollView>


									<View style={styles.listHeading}>
									<Text style={styles.listHeadingLeft}>პოპულარული</Text>
									<TouchableOpacity>
										<Text
											style={styles.listHeadingRight}
											onPress={this._viewMoviesList.bind(this, 'ფილმები ქართულად', 'Movies')}>
											ყველა
										</Text>
									</TouchableOpacity>
								</View>
								<ScrollView horizontal showsHorizontalScrollIndicator={false}>
									{popularMovies.map(info => (
										<CardTwo key={info.id} info={info} viewMovie={this._viewMovie} />
									))}
								</ScrollView>


					<View style={styles.browseList}>
											<TouchableOpacity activeOpacity={0.7}>
							<View style={styles.browseListItem}>
								{iconTop}
								<Text style={styles.browseListItemText} onPress={this._viewMoviesList.bind(this, 'top_rated', 'Top Rated')}>
									Top Rated
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity activeOpacity={0.7}>
							<View style={styles.browseListItem}>
								{iconUp}
								<Text
									style={styles.browseListItemText}
									onPress={this._viewMoviesList.bind(this, 'upcoming', 'Upcoming')}>
									Upcoming
								</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		);
	}
}


function mapStateToProps(state, ownProps) {
	return {
		nowPlayingMovies: state.movies.nowPlayingMovies,
		popularMovies: state.movies.popularMovies,
		Series:state.movies.Series
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(moviesActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Movies);

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
import CardFour from './components/CardFour';
import ProgressBar from '../_global/ProgressBar';
import styles from './styles/Movies';
import { iconsMap } from '../../utils/AppIcons';
import axios from "axios"
import List from "./categories"
import InAppBilling from "react-native-billing";

import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from 'react-native-admob'
class Movies extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			isRefreshing: false,
			collections:[]
		};

		this._viewMovie = this._viewMovie.bind(this);
		this._onRefresh = this._onRefresh.bind(this);
		this.openSearch = this.openSearch.bind(this)
		this._retrieveMovies = this._retrieveMovies.bind(this)
		this.props.navigator.setOnNavigatorEvent((event)=> {
			if (event.type === 'NavBarButtonPress') {
			if(event.id === 'Search') {
     this.openSearch()
			}
		}
		});
		AdMobInterstitial.setAdUnitID('ca-app-pub-6370427711797263/7435578378');


//alert(List)
 this.props.navigator.setButtons({leftButtons:[{id:'sideMenu'}],rightButtons:[
	 {
			id: 'Search',
			title: 'Search',
			icon: iconsMap['ios-search']
		}
	 ]})
	}

	componentWillMount() {
		this._retrieveMovies();
		setTimeout(() => {
			 this.checkSubscription()
		},1000)
	}


 openSearch() {
	 this.props.navigator.showModal({
		 screen: 'movieapp.Search',
		 title: 'ძიება'
	 });



 }



 async checkSubscription() {
     try {
     await InAppBilling.open();
     // If subscriptions/products are updated server-side you
     // will have to update cache with loadOwnedPurchasesFromGoogle()
     await InAppBilling.loadOwnedPurchasesFromGoogle();
     const isSubscribed = await InAppBilling.isSubscribed("noads597")
  //   alert("Customer subscribed: " + isSubscribed);
	    if(!isSubscribed) {
				AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
			}

   } catch (err) {
     console.log(err);
   } finally {
     await InAppBilling.close();
   }
 }
	_retrieveMovies(isRefreshed) {

		this.props.actions.retrieveNowPlayingMovies("test",(data) => {
			this.props.actions.retrievePopularMovies("test",(data) => {
				try {
				this.setState({isLoading:false},(e) => {
        //  alert(e)
				})
			} catch(e) {
			//	alert(e)
			}
			})
		});

   axios.get("http://adjaranet.com/req/jsondata/req.php?reqId=getCollections")
	 .then(res => {
		 res = res.data;
		 var FinalData = [];


				Object.values(res).forEach((item,i) => {
						FinalData.push({
								name:item.name,
								id:Object.keys(res)[i]
						})
				})


		 //alert(JSON.stringify(res.data))
		 this.setState({collections:FinalData,isLoading:false})
	 })



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

	_viewCat(id,title,isCollection) {
		if(isCollection) {
		this.props.navigator.showModal({
			title,
			screen: 'movieapp.ColMoviesList',
			passProps: {
				title,
				id
			},
		 	backButtonHidden:false,
		});
		}else{
			this.props.navigator.showModal({
			title,
			screen: 'movieapp.CatMoviesList',
			passProps: {
				title,
				id
			},
		 	backButtonHidden:false,
		});
		}
	}

	_viewColCat() {

		this.props.navigator.showModal({
			title:"test",
			screen: 'movieapp.CatCol',
			passProps: {
				title:"test",
				id:266
			},
		 	backButtonHidden:false,
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
							id:"love",
							icon:iconsMap['ios-heart-outline']
						},
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
								id:"love",
								icon:iconsMap['ios-heart-outline']
							},
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
		const { nowPlayingMovies, popularMovies } = this.props;
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
					<Text style={styles.listHeadingLeft}>კატეგორიები</Text>

				</View>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				{
					List.map((item,i) => {
					   return (
							 <CardFour key={i} collections={false} info={item} viewCat={(id,title) => this._viewCat(id,title,false)}/>
						 )
					})
				}
				</ScrollView>

				<View style={styles.listHeading}>
					<Text style={styles.listHeadingLeft}>კოლექციები</Text>
								</View>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				{
					this.state.collections.map((item,i) => {
						 return (
							 <CardFour key={i} collections={true} info={item} viewCat={(id,title) => this._viewCat(id,title,true)}/>
						 )
					})
				}
				</ScrollView>


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
									<Text style={styles.listHeadingLeft}>პრემიერა</Text>
									<TouchableOpacity>
										<Text
											style={styles.listHeadingRight}
											onPress={this._viewMoviesList.bind(this, 'ფილმები ქართულად', 'პრემიერა')}>
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
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(moviesActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Movies);

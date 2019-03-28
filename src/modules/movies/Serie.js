import React, { Component, PropTypes } from 'react';
import {
	Image,
	Linking,
	RefreshControl,
	ScrollView,
	Text,
	ToastAndroid,
	View,
	TouchableOpacity,
	Picker,
	AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Swiper from 'react-native-swiper';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SwitchSelector from 'react-native-switch-selector';
import * as moviesActions from './movies.actions';
import Series from './tabs/Series';
import DefaultTabBar from '../_global/scrollableTabView/DefaultTabBar';
import Info from './tabs/Info';
import ProgressBar from '../_global/ProgressBar';
import Trailers from './tabs/Trailers';
import styles from './styles/Movie';
import VideoPlayer from "react-native-native-video-player"
import { TMDB_IMG_URL, YOUTUBE_API_KEY, YOUTUBE_URL } from '../../constants/api';
	const apiKey = '9d2bff12ed955c7f1f74b83187f188ae'
	import Modal from "react-native-modal";
	import { iconsMap } from '../../utils/AppIcons';

var seasons = [];
var szn = [];
var qualitiesObjs = [];
var nnqu = [];


class Serie extends Component {
	constructor(props) {
		super(props);
		seasons = [];
		 szn = [];
		  qualitiesObjs = [];
		  nnqu = [];
		this.state = {
			castsTabHeight: null,
			heightAnim: null,
			infoTabHeight: null,
			isLoading: true,
			isRefreshing: false,
			showSimilarMovies: true,
			trailersTabHeight: null,
			tab: 0,
			youtubeVideos: [],
			genres:[],
			Directed:"",
			link:"",
			series: [],
			ShowModal:false,
			QOptions:[
			    { label: 'ქართული', value: '1' },
			    { label: 'ინგლისური', value: '1.5' },
			    { label: 'რუსული', value: '2' }
			],
			selectedLang:"",
			Quality_Options:[],
			selectedQual:"",
			seasons: [],
			addedToFavorites:false,
 			AsyncStorageData:[],
			des:this.props.item.description
		};

		this._getTabHeight = this._getTabHeight.bind(this);
		this._onChangeTab = this._onChangeTab.bind(this);
		this._onContentSizeChange = this._onContentSizeChange.bind(this);
		this._onRefresh = this._onRefresh.bind(this)
		this._onScroll = this._onScroll.bind(this);
		this._viewMovie = this._viewMovie.bind(this);
		this._openYoutube = this._openYoutube.bind(this);
		this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
	}

	componentWillMount() {
		this._retrieveDetails();

	}

	getq(data) {
     if(data > 1000) {
       return "HD"
     }else{
       return "SD"
     }

   }



 	_retrieveDetails(isRefreshed) {


				(async () => {


			 		  try {
			 		    const value = await AsyncStorage.getItem('favorites');
			 		    if (value !== null) {
			 		      // We have data!!
			 		      // alert(JSON.stringify(value));
			 				 let parsedVal = JSON.parse(value)
			 			//	 alert(JSON.stringify(parsedVal))
			      // alert(this.props.item.id)
			         parsedVal.forEach(item => {
			 					   if(item.id == this.props.item.id) {
			 							 this.props.navigator.setButtons({
			 								rightButtons:[
			 									{
			 											id:'love',
			 											icon:iconsMap['ios-heart']
			 									},
			 									{
			 										 id: 'close',
			 										 icon: iconsMap['ios-arrow-round-down']
			 									 }
			 								 ]
			 							})

										this.setState({addedToFavorites:true,AsyncStorageData:parsedVal})
			 						 }
			 				})


			 		    }
			 		  } catch (error) {
			 		    // Error retrieving data
			 				alert(error)
			 		  }


			  })()
    // firebase.database().ref().child("series").child(this.props.navigation.state.p
    // a rams.key).child("parts").on("value",snapshot => {     databaseItems = [];
    // for(var i=1;i<=snapshot.numChildren();i++) { databaseItems.push("სეზონი " +
    // i);     }     }) this.setState({seasons:databaseItems})
    // this.getSeason("სეზონი 1");

  fetch(
  `http://net.adjara.com/req/jsondata/req.php?id=${
    this.props.item.id
    }&reqId=getInfo`
)
  .then(res => res.json())
  .then(res => {


	const myarr = Object.keys(res).map(i => res[i]);
	this.setState({ link: myarr[myarr.length - 1] ,des:res.desc});
   //alert(myarr[myarr.length - 1])

	myarr.forEach(item => {
		if (item[1]) {
			if (typeof item === 'object') {
				if (Object.keys(item).length > 1) {
					seasons.push(item);
				}
			}
		}
	});

	var testSznNum = 0;

	var szns;

	if (seasons[testSznNum][testSznNum + 1].lang) {
		szns = Object.keys(seasons[testSznNum]).map(i => {
			if (
          seasons[testSznNum][i].quality ||
          seasons[testSznNum][i].lang ||
          typeof seasons[testSznNum][i] !== 'undefined'
        ) {
				if (seasons[testSznNum][i].lang) {
					return seasons[testSznNum][i];
				} else {
					return '';
				}
			}
		});
	} else {
		testSznNum++;
		szns = Object.keys(seasons[testSznNum]).map(i => {
			if (
          seasons[testSznNum][i].quality ||
          seasons[testSznNum][i].lang ||
          typeof seasons[testSznNum][i] !== 'undefined'
        ) {
				if (seasons[testSznNum][i].lang) {
					return seasons[testSznNum][i];
				} else {
					return '';
				}
			}
		});
	}
	szn = szns;

	this.setState({ series: szn, isLoading: false, seasons });
});


		if (isRefreshed && this.setState({ isRefreshing: false }));
	}

	_retrieveSimilarMovies() {
		this.props.actions.retrieveSimilarMovies(this.props.movieId, 1);
	}

	_onRefresh() {
		this.setState({ isRefreshing: true });
		this._retrieveDetails('isRefreshed');
	}

	_onScroll(event) {
		const contentOffsetY = event.nativeEvent.contentOffset.y.toFixed();
		if (contentOffsetY > 150) {
			this._toggleNavbar('hidden');
		} else {
			this._toggleNavbar('shown');
		}
	}

	_toggleNavbar(status) {
		this.props.navigator.toggleNavBar({
			to: status,
			animated: true
		});
	}

	_onChangeTab({ i, ref }) {
		this.setState({ tab: i });
	}

	// ScrollView onContentSizeChange prop
	_onContentSizeChange(width, height) {
		if (this.state.tab === 0 && this.state.infoTabHeight === this.state.castsTabHeight) {
			this.setState({ infoTabHeight: height });
		}
	}

	_getTabHeight(tabName, height) {
		if (tabName === 'casts') this.setState({ castsTabHeight: height });
		if (tabName === 'trailers') this.setState({ trailersTabHeight: height });
	}

	_retrieveYoutubeDetails() {

	}

	_viewMovie(movieId) {
		this.props.navigator.push({
			screen: 'movieapp.Movie',
			passProps: {
				movieId
			}
		});
	}

	_storeData = async (data1,data2) => {
	  try {
	    await AsyncStorage.setItem(data1,data2);
	  } catch (error) {
	    // Error saving data
	  }
	};


	_openYoutube(youtubeUrl) {
		Linking.canOpenURL(youtubeUrl).then(supported => {
			if (supported) {
				Linking.openURL(youtubeUrl);
			} else {
			//	ToastAndroid.show(`RN Don't know how to handle this url ${youtubeUrl}`, ToastAndroid.SHORT);
			}
		});
	}
	checkImdb(data) {
        if ((parseFloat(data.data_rating).toFixed(1)) !== parseFloat(0.0).toFixed(1)) {
            return (parseFloat(data.data_rating).toFixed(1));
        } else {
            return (null);
        }
    }
	async _onNavigatorEvent(event) {
		if (event.type === 'NavBarButtonPress') {
			if (event.id === 'close') {
				this.props.navigator.dismissModal();
			}
			if (event.id === 'love') {
				if(!this.state.addedToFavorites) {
	var value = await AsyncStorage.getItem('favorites');
 //JSON.stringify(added))
let added;

 if(value !== null) {
  added = JSON.parse(value)
}else{
	added = []
}

  let poster;

	if(this.props.item.poster) {
		 poster = this.props.item.poster;
	}else{
		poster = "http://staticnet.adjara.com/moviecontent/" + this.props.item.id + "/covers/214x321-" + this.props.item.id + ".jpg";
	}

		added.push({
			id:this.props.item.id,
			release_date:this.props.item.release_date,
			director:this.props.item.director,
			description:this.props.item.description,
			casts:this.state.actors,
			poster,
			data_rating:this.props.item.data_rating,
			imdb:this.checkImdb(this.props.item),
			title_ge:this.props.item.title_ge,
			title_en:this.props.item.title_en

			})
		added = JSON.stringify(added)

			this._storeData("favorites",added)




				this.props.navigator.setButtons({
					rightButtons:[
						{
								id:'love',
								icon:iconsMap['ios-heart']
						},
						{
							 id: 'close',
							 icon: iconsMap['ios-arrow-round-down']
						 }
					 ]
				})

 }else{

	 this.setState({addedToFavorites:false})
				this.props.navigator.setButtons({
					rightButtons:[
						{
								id:'love',
								icon:iconsMap['ios-heart-outline']
						},
						{
							 id: 'close',
							 icon: iconsMap['ios-arrow-round-down']
						 }
					 ]
				})
	let favs = this.state.AsyncStorageData;
		favs.forEach((item,id) => {
				 if(item.id == this.props.item.id)  {
					 favs.splice(id,1);
					 this._storeData("favorites",JSON.stringify(favs))
				 }
		})
				 }
			}
		}
	}
	checkTitle(data) {
 		 if (data.title_ge !== "") {
 				 return (data.title_ge);
 		 } else {
 				 return (data.title_en);
 		 }
  }



	render() {
		const iconStar = <Icon name="md-star" size={16} color="#F5B642" />;
		const { details } = this.props;
		const {item} = this.props;
		const info = details;
		const options = this.state.QOptions;
		let height;
		if (this.state.tab === 0) height = this.state.infoTabHeight;
		if (this.state.tab === 1) height = this.state.castsTabHeight;
		if (this.state.tab === 2) height = this.state.trailersTabHeight;

		return (
			this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View> :
			<ScrollView
					style={styles.container}
					onScroll={this._onScroll.bind(this)}
					scrollEventThrottle={100}
					onContentSizeChange={this._onContentSizeChange}
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

						<Modal animationIn="bounceInLeft"
          animationOut="bounceOutRight"
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000}
					isVisible={this.state.ShowModal} >
					<View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'}}>
    <View style={{
						backgroundColor:"#2B2C3D",
            width: 300,
            height: 330,
						alignItems: 'center',
					 padding:15}}>

						<Text style={{color:"#FFF",paddingTop:20,paddingBottom:20}}>აირჩიე ენა</Text>
						<SwitchSelector options={options} initial={0} onPress={value => this.setState({selectedLang:value})} />
						<Text style={{color:"#FFF",paddingTop:20,paddingBottom:20}}>აირჩიე ხარისხი</Text>



<SwitchSelector options={this.state.Quality_Options} initial={0} onPress={value => this.setState({selectedQual:value})} />
			<View style={{marginTop:50,flexDirection: 'row'}}>



			<TouchableOpacity onPress={()=>this.setState({ShowModal:false})} style={{height:30,width:110,backgroundColor:"#2B2C3D",borderRadius:25,justifyContent: 'center',alignItems: 'center'}}>
		<Text style={{color:"#FFF"}} >დახურვა</Text>
		</TouchableOpacity>
		<View style={{width:10}}/>
			<TouchableOpacity  onPress={()=>this.playMovie(item)} style={{height:38,
				width:110,
				backgroundColor:"#FFF",borderRadius:5,justifyContent: 'center',alignItems: 'center'}}>
			<Text style={{color:"#2B2C3D"}}>კარგი</Text>
			</TouchableOpacity>
     </View>

    </View>
	  </View>
						</Modal>
				<View style={{ height }}>
													<View>
									<Image  blurRadius={2}   source={{ uri:  item.poster?(item.poster):("http://staticnet.adjara.com/moviecontent/" + item.id + "/covers/214x321-" + item.id + ".jpg")}} style={styles.imageBackdrop} />

									<LinearGradient colors={['rgba(0, 0, 0, 0.2)', 'rgba(0,0,0, 0.2)', 'rgba(0,0,0, 0.7)']} style={styles.linearGradient} />
															</View>

					<View style={styles.cardContainer}>
						<Image source={{ uri: item.poster?(item.poster):("http://staticnet.adjara.com/moviecontent/" + item.id + "/covers/214x321-" + item.id + ".jpg") }} style={styles.cardImage} />
						<View style={styles.cardDetails}>
							<Text style={styles.cardTitle}>{this.checkTitle(item)}</Text>
							<Text style={styles.cardTagline}></Text>
							<View style={styles.cardGenre}>
								{
								 	this.state.genres.map(item => (
							 		<Text key={item.id} style={styles.cardGenreItem}>{item}</Text>
							  	))
								}
							</View>
							<View style={styles.cardNumbers}>
								<View style={styles.cardStar}>
									{iconStar}
									<Text style={styles.cardStarRatings}>{this.checkImdb(item)}</Text>
								</View>
								<Text style={styles.cardRunningHours} />
							</View>
						</View>
					</View>
					<View style={styles.contentContainer}>
						<ScrollableTabView
							onChangeTab={this._onChangeTab}
							renderTabBar={() => (
								<DefaultTabBar
									textStyle={styles.textStyle}
									underlineStyle={styles.underlineStyle}
									style={styles.tabBar}
								/>
							)}>
							<Info tabLabel="INFO" item={item} description={this.state.des} director={this.state.Directed} />
							<Series tabLabel="SERIES"  id={this.props.item.id} link={this.state.link} seasons={this.state.seasons} series={this.state.series} getTabHeight={this._getTabHeight} />
							<Trailers tabLabel="TRAILERS" item={this.props.item} youtubeVideos={this.state.youtubeVideos} openYoutube={this._openYoutube} getTabHeight={this._getTabHeight} />
						</ScrollableTabView>
					</View>
				</View>
			</ScrollView>
		);
	}
}

Serie.navigatorStyle = {
	navBarTransparent: true,
	drawUnderNavBar: true,
	navBarTranslucent: true,
	statusBarHidden: true,
	navBarTextColor: 'white',
	navBarButtonColor: 'white'
};


function mapStateToProps(state, ownProps) {
	return {
		details: state.movies.details,
		similarMovies: state.movies.similarMovies
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(moviesActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Serie);

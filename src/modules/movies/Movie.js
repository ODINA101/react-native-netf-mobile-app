import React, { Component, PropTypes } from 'react';
import {
	Image,
	Linking,
	RefreshControl,
	ScrollView,
	Text,
	ToastAndroid,
	View,
	TouchableOpacity
} from 'react-native';
import {AsyncStorage} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Swiper from 'react-native-swiper';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SwitchSelector from 'react-native-switch-selector';
import * as moviesActions from './movies.actions';
import Casts from './tabs/Casts';
import DefaultTabBar from '../_global/scrollableTabView/DefaultTabBar';
import Info from './tabs/Info';
import ProgressBar from '../_global/ProgressBar';
import Trailers from './tabs/Trailers';
import styles from './styles/Movie';
import VideoPlayer from "react-native-native-video-player"
import { TMDB_IMG_URL, YOUTUBE_API_KEY, YOUTUBE_URL } from '../../constants/api';
import { iconsMap } from '../../utils/AppIcons';
import downloadManager  from 'react-native-simple-download-manager';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from 'react-native-admob'
	const apiKey = '9d2bff12ed955c7f1f74b83187f188ae'
	import Modal from "react-native-modal";
class Movie extends Component {
	constructor(props) {
		super(props);
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
			ShowModal:false,
			QOptions:[
			    { label: 'ქართული', value: '1' },
			    { label: 'ინგლისური', value: '1.5' },
			    { label: 'რუსული', value: '2' }
			],
			selectedLang:"",
			Quality_Options:[],
			selectedQual:"",
			addedToFavorites:false,
			AsyncStorageData:[],
			downloading:false

		};

		this._getTabHeight = this._getTabHeight.bind(this);
		this._onChangeTab = this._onChangeTab.bind(this);
		this._onContentSizeChange = this._onContentSizeChange.bind(this);
		this._onRefresh = this._onRefresh.bind(this)
		this._onScroll = this._onScroll.bind(this);
		this._viewMovie = this._viewMovie.bind(this);
		this._openYoutube = this._openYoutube.bind(this);
		this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));

		AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());







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
		// this.props.actions.retrieveMovieDetails(this.props.movieId)
		// 	.then(() => {
		// 	//	this._retrieveYoutubeDetails();

		//	});


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




		fetch("http://net.adjara.com/req/jsondata/req.php?id=" + this.props.item.id + "&reqId=getInfo")
							.then(res => res.json())
							.then(res => {
										let genres = Object.keys(res.genres).map(i => res.genres[i])
										let director = Object.keys(res.director).map(i => res.director[i]);
										if(director.length > 0) {
											this.setState({Directed:director[0]})

										}
										this.setState({genres})
										fetch(
			     		"http://net.adjara.com/req/jsondata/req.php?id=" + this.props.item.id +
				     	"&reqId=getLangAndHd"
		        	)
		        	.then(res => res.json())
		         	.then(res => {
								  let actors = [];
								var info = Object
							             .keys(res)
							             .map(i => res[i])

							              var noption = info[0].lang.split(",")
														var noquality =  info[0].quality.split(",")
													//	alert(JSON.stringify(noption))
                            let nores = [];
                            let noqures = [];


                              noption.map((item) => {
																nores.push({label:item,value:item})
															})
															noquality.map((item) => {
	                             noqures.push({label:this.getq(item),value:item})
                              })


							                 this.setState({QOptions: nores, link: info[0].url,selectedLang:noption[0],Quality_Options:noqures,selectedQual:noquality[0]})
							                 Object
							                 .keys(res.cast)
							                 .map(async (item) => {
							                     actors.push({id:item,name:res.cast[item]})
							                 })
							              this.setState({actors, link: info[0].url})

																		this.setState({ isLoading: false });





             });

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


  playMovie(item) {
		 if(this.state.downloading) {

                                    const url = this.state.link + item.id + "_" + this.state.selectedLang + "_" + this.state.selectedQual + ".mp4";
                                    const headers = {'Authorization': 'movie is downloading'};
                                    const config = {
                                      downloadTitle:this.checkTitle(this.props.item),
                                      downloadDescription: 'მიმდინარეობს გადმოწერა',
                                      saveAsName:(this.props.item.id + ".mp4"),
                                      allowedInRoaming: true,
                                      allowedInMetered: true,
                                      showInDownloads: true,
                                      external: false, //when false basically means use the default Download path (version ^1.3)
                                      path: "Downloads/" //if "external" is true then use this path (version ^1.3)
                                    };


                                    downloadManager.download(url, headers, config).then(()=>{
                                      console.log('Download success!');
                                    }).catch(err=>{
                                      console.log(err);
                                      if(err.reason == "ERROR_INSUFFICIENT_SPACE") {
                                          alert("თქვენ არ გაქვთ საკმარისი მეხსიერება")
                                      }
                                    })
		 }else{
		VideoPlayer.showVideoPlayer(this.state.link + item.id + "_" + this.state.selectedLang + "_" + this.state.selectedQual + ".mp4")
		 }


		 this.setState({ShowModal:false})
	}

	_openYoutube(youtubeUrl) {
		Linking.canOpenURL(youtubeUrl).then(supported => {
			if (supported) {
				Linking.openURL(youtubeUrl);
			} else {
				ToastAndroid.show(`RN Don't know how to handle this url ${youtubeUrl}`, ToastAndroid.SHORT);
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


async _onNavigatorEvent(event) {
		if (event.type === 'NavBarButtonPress') {
			if (event.id === 'close') {
				this.props.navigator.dismissModal();
			}

     if (event.id === 'love') {

			 if(!this.state.addedToFavorites) {

 var value = await AsyncStorage.getItem('favorites');
 let added;

  if(value !== null) {
   added = JSON.parse(value)
 }else{
 	added = []
 }

   added.push({
		 id:this.props.item.id,
		 release_date:this.props.item.release_date,
		 director:this.props.item.director,
		 description:this.props.item.description,
		 casts:this.state.actors,
		 poster:this.props.item.poster,
		 data_rating:this.props.item.data_rating,
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

	checkImdb(data) {
        if ((parseFloat(data.data_rating).toFixed(1)) !== parseFloat(0.0).toFixed(1)) {
            return (data.data_rating);
        } else {
            return (null);
        }
    }

	render() {
		const iconStar = <Icon name="md-star" size={16} color="#F5B642" />;
		const { details } = this.props;
		const {item,searching} = this.props;
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
			      <TouchableOpacity onPress={()=>this.setState({ShowModal:false})}style={{height:30,width:110,backgroundColor:"#2B2C3D",borderRadius:25,justifyContent: 'center',alignItems: 'center'}}>
	           	<Text style={{color:"#FFF"}}>დახურვა</Text>
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
									<Image  blurRadius={2}   source={{ uri: searching?("http://staticnet.adjara.com/moviecontent/" + info.id + "/covers/214x321-" + info.id + ".jpg"):(item.poster) }} style={styles.imageBackdrop} />

									<LinearGradient colors={['rgba(0, 0, 0, 0.2)', 'rgba(0,0,0, 0.2)', 'rgba(0,0,0, 0.7)']} style={styles.linearGradient} />

									 <View style={{position:'absolute',top:100,alignSelf: 'center',flexDirection: 'row'}}>
									<TouchableOpacity style={{width:50,height:50}} onPress={() => {
                     this.setState({downloading:false,ShowModal:true})
																	}} >
																	<Icon  size={50} color="#FFF"  name="md-play"/>
									</TouchableOpacity>

									<TouchableOpacity style={{width:50,height:50}} onPress={() => {
										 this.setState({downloading:true,ShowModal:true})
																	}} >
																	<Icon  size={50} color="#FFF"  name="md-download"/>
									</TouchableOpacity>


								</View>


								</View>

					<View style={styles.cardContainer}>
						<Image source={{ uri: searching?("http://staticnet.adjara.com/moviecontent/" + info.id + "/covers/214x321-" + info.id + ".jpg"):(item.poster)}} style={styles.cardImage} />
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
							{
								searching?(
									<View />
								):(
									<View style={styles.cardStar}>
	               {iconStar}
	             <Text style={styles.cardStarRatings}>{this.checkImdb(item)}</Text>
                 </View>
								)
							}
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
							<Info tabLabel="INFO" item={item} director={this.state.Directed} />
							<Casts tabLabel="CASTS"  actors={this.state.actors} getTabHeight={this._getTabHeight} />
							<Trailers tabLabel="TRAILERS" item={this.props.item} youtubeVideos={this.state.youtubeVideos} openYoutube={this._openYoutube} getTabHeight={this._getTabHeight} />
						</ScrollableTabView>
					</View>
				</View>
			</ScrollView>
		);
	}
}

Movie.navigatorStyle = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Movie);

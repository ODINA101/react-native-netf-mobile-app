import React, { Component, PropTypes } from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	ToastAndroid,
	ActivityIndicator,
	Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
 import InAppBilling from "react-native-billing";
import styles from './styles/Drawer';



const itemSkus = Platform.select({
  ios: [
    'noads597'
  ],
  android: [
    'noads597'
  ]
});
class Drawer extends Component {
	constructor(props) {
		super(props);
     this.state = {
			 subscribed:null,
			 subed:false
		 }


		this._goToMovies = this._goToMovies.bind(this);
		this._goToFavorites = this._goToFavorites.bind(this);
		this._openSearch = this._openSearch.bind(this);
		this._goToSeries = this._goToSeries.bind(this);
		this.checkSubscription()
	}
	async checkSubscription() {
	    try {
	    await InAppBilling.open();
	    await InAppBilling.loadOwnedPurchasesFromGoogle();
	    const isSubscribed = await InAppBilling.isSubscribed("noads597")
	  //   const isSubscribed2 = await InAppBilling.getProductDetails("noads597")
		// alert(isSubscribed2)
	    console.log("Customer subscribed: ", isSubscribed);
			this.setState({subscribed:true,subed:isSubscribed})
		//alert(isSubscribed)
	  } catch (err) {
	    alert(err);
			//alert(err)
	  } finally {
	    await InAppBilling.close();
	  }
	}
	_openSearch() {
		this._toggleDrawer();
		this.props.navigator.showModal({
			screen: 'movieapp.Search',
			title: 'ძიება'
		});
	}

	_goToMovies() {
		this._toggleDrawer();
		this.props.navigator.popToRoot({
			screen: 'movieapp.Movies'
		});
	}


	_goToSeries() {
		this._toggleDrawer();
		this.props.navigator.showModal({
			screen: 'movieapp.MoviesList',
			title:'სერიალები',
			passProps: {
				type:"სერიალები ქართულად"
			}
		});
	}


	_goToFavorites() {
		this._toggleDrawer();
		this.props.navigator.showModal({
			screen: 'movieapp.Favorites',
			title:'Favorites'
		});
	}

	_toggleDrawer() {
		this.props.navigator.toggleDrawer({
			to: 'closed',
			side: 'left',
			animated: true
		});
	}

	render() {
		const iconSearch = (<Icon name="md-search" size={26} color="#9F9F9F" style={[styles.drawerListIcon, { paddingLeft: 2 }]} />);
		const iconMovies = (<Icon name="md-film" size={26} color="#9F9F9F" style={[styles.drawerListIcon, { paddingLeft: 3 }]} />);
		const iconFav = (<Icon name="md-heart" size={26} color="#9F9F9F" style={[styles.drawerListIcon, { paddingLeft: 3 }]} />);
		const iconTV = (<Icon name="ios-desktop" size={26} color="#9F9F9F" style={styles.drawerListIcon} />);
		return (
			<LinearGradient colors={['rgba(0, 0, 0, 0.7)', 'rgba(0,0,0, 0.9)', 'rgba(0,0,0, 1)']} style={styles.linearGradient}>
				<View style={styles.container}>
					<View style={styles.drawerList}>
						<TouchableOpacity onPress={this._openSearch}>
							<View style={styles.drawerListItem}>
								{iconSearch}
								<Text style={styles.drawerListItemText}>
									ძიება
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity onPress={this._goToMovies}>
							<View style={styles.drawerListItem}>
								{iconMovies}
								<Text style={styles.drawerListItemText}>
									ფილმები
								</Text>
							</View>
						</TouchableOpacity>


						<TouchableOpacity onPress={this._goToSeries}>
				<View style={styles.drawerListItem}>
		 			{iconTV}
					<Text style={styles.drawerListItemText}>
						სერიალები
					</Text>
				</View>
			</TouchableOpacity>

						<TouchableOpacity onPress={this._goToFavorites}>
							<View style={styles.drawerListItem}>
								{iconFav}
								<Text style={styles.drawerListItemText}>
									ფავორიტი
								</Text>
							</View>
						</TouchableOpacity>

					</View>
					{
						this.state.subscribed?(
							<View>
							{
								!this.state.subed?(

							<View>
							<TouchableOpacity onPress={async () => {

														InAppBilling.open()
					  						  .then(() => InAppBilling.subscribe("noads597").then(res => {
														alert("subedd success")
													}))
											  .then(details => {
											     InAppBilling.close();
											  }).catch(err => console.log(err))
							// 	 let isSubscribed = null;
							// 	try {
		         //      await InAppBilling.open();
					  	// 	 	InAppBilling.subscribe("noads597").then(details => {
							// 		//alert(details.purchaseState);
						 // this.checkSubscription()
							// 	}).catch(err => {
							// //		alert(err)
						 // this.checkSubscription()
							// 	})
							// 	  isSubscribed = await InAppBilling.isSubscribed("noads597")
						 // this.checkSubscription()
							// 	} catch (err) {
							// 		console.log(err);
							// //		alert(err)
						 // this.checkSubscription()
							// 	} finally {
							// 		await InAppBilling.close();
						 //
						 // this.checkSubscription()
							// 	}
						 //
						 //
						 // this.checkSubscription()


							}} style={{height:50,marginTop:50,width:200,borderRadius:5,justifyContent: 'center',alignItems: 'center',elevation:3,backgroundColor:"#FB7C00"}}>
		             <Text style={{color:"#FFF",fontSize:13}}>გამოწერა 2 ლარი/თვეში</Text>
							</TouchableOpacity>
		             <Text style={{color:"#FFF",fontSize:13,marginTop:10,width:200,lineHeight:20,textAlign: 'center'}}>გამოიწერე და უყურე ფილმებს ყოველგვარი რეკლამის გარეშე</Text>

							</View>
						):(
             <View>
       </View>
						)
							}
							</View>
						):(
							<View style={{height:100,justifyContent: 'center',alignItems: 'center'}}>
							<ActivityIndicator size="large" color="#00ff00" />
							</View>
						)
					}

				</View>
			</LinearGradient>
		);
	}
}

export default Drawer;

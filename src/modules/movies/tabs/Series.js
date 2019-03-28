import React, { Component } from 'react';
import Math from "mathjs"
import {
	Text,
	View,
	Image,
	TouchableOpacity,
	AsyncStorage
} from 'react-native';
import  { convertStringToNumber } from 'convert-string-to-number'
import styles from './styles/Casts';
import { TMDB_IMG_URL } from '../../../constants/api';
import { Dropdown } from 'react-native-material-dropdown';
import SwitchSelector from 'react-native-switch-selector';
import Modal from "react-native-modal";
import Swiper from 'react-native-swiper';
import VideoPlayer from "react-native-native-video-player"


export default class Series extends Component {
constructor(props) {
	super(props);
  this.state =  {
		seasons:[],
		selected:"სეზონი 1",
		series:props.series,
		Quality_Options:[],
		selectedQual:"",
		options:[],
		selectedLang:"",
		ShowModal:false,
		url:props.link,
		serieI:0,
		selectedSerieId:null,
		selectedSznId:null
	}

  let szns = [];
	props.seasons.forEach((item,ind) => {
		 szns.push({value:("სეზონი " + (ind+1))})
	})




this._retrieveData = this._retrieveData.bind(this)
 this.state.seasons = szns
 this._retrieveData()
}


async _retrieveData()  {
 try {
    const value = await AsyncStorage.getItem(('SelectedSerie'+this.props.id));
    if (value !== null) {
      // We have data!!
			this.setState({selectedSerieId:value});
    }else{
		}
  } catch (error) {
		alert(error)
  }

	try {
     const value2 = await AsyncStorage.getItem(('SelectedSzn'+this.props.id));
     if (value2 !== null) {
       // We have data!!
 			this.setState({selected:value2,selectedSznId:value2});
			this.getSeason(value2)
     }else{
			//alert(value2)
 		}
   } catch (error) {
 		//alert(error)
   }
};

getNum(num) {
	 if (num < 9) {
		 return ("0" + (num+1)).toString()
	 } else {
		 return (num+1).toString();
	 }
 }
getq(data) {
	 if(data > 1000) {
		 return "HD"
	 }else{
		 return "SD"
	 }
 }

async playSerie(lang,qual,serieI) {

//alert('SelectedSerie'+this.props.id)


	try {
    await AsyncStorage.setItem(('SelectedSerie'+this.props.id), serieI.toString());
		this.setState({selectedSerieId:serieI,selectedSznId:this.state.selected})
  } catch (error) {
    // Error saving data
  }

		 	try {
		     await AsyncStorage.setItem(('SelectedSzn'+this.props.id),this.state.selected);
		   } catch (error) {
		     // Error saving data
		   }

// alert(JSON.stringify(lang))
// alert(JSON.stringify(qual))
var noption = lang.split(",")
var noquality = qual.split(",")
//	alert(JSON.stringify(noption))
let nores = [];
let noqures = [];


	noption.map((item) => {
		nores.push({label:item,value:item})
	})
	noquality.map((item) => {
	 noqures.push({label:this.getq(item),value:item})
	})
	this.setState({serieI,options:nores,selectedLang:noption[0],Quality_Options:noqures,selectedQual:noquality[0]},() => {
		this.setState({ShowModal:true})
	})




}

Play() {
	VideoPlayer.showVideoPlayer("http://" + this.props.link + this.props.id + "_" + this.getNum(parseInt(this.state.selected.substr(this.state.selected.length - 1))-1) +
	 "_" + this.getNum(this.state.serieI) + "_" +  this.state.selectedLang + "_"
	 + this.state.selectedQual + ".mp4")

   // alert("http://" + this.props.link + this.props.id + "_" + this.getNum(parseInt(this.state.selected.substr(this.state.selected.length - 1))-1) +
	 // "_" + this.getNum(this.state.serieI) + "_" +  this.state.selectedLang + "_"
	 // + this.state.selectedQual + ".mp4")
	// http://" + this.state.link +  this.props.navigation.state.params.key+ "_" + this.state.lang + "_" + 1500 + ".mp4
	this.setState({ShowModal:false})

}


getSeason(value) {
	 var datiko = [];
	 var sss = this.props.seasons[parseInt(value.substr(value.length - 1))-1];
	 datiko = Object
		 .keys(sss)
		 .map(i => {
			 if (sss[i].quality || sss[i].lang || typeof(sss[i]) !== "undefined") {
				 return sss[i]
			 }
		 })
	 this.setState({series: datiko, isLoading: false})
 }
async onValueChange(value) {
//	alert(Number.parseInt(value[value.length-1]))


	 this.setState({selected: value});
	//value = Number.parseInt(value[value.length-1]);
	 this.getSeason(value)

		//
	 	// try {
	  //    await AsyncStorage.setItem(('SelectedSzn'+this.props.id),value);
	  //  } catch (error) {
	  //    // Error saving data
	  //  }


	//  if(this.state.savedSelectedIndex) {
	// if(this.state.savedSelectedIndexSzn) {
	//  this.save(value,this.state.savedSelectedIndex,this.state.savedSelectedIndexSzn)
	//
	// }else{
	//  this.save(value,this.state.savedSelectedIndex,null)
	//
	// }
	//  }else{
	//
	// 	 this.save(value,null,null)
	//  }
 }

  render() {
		let computedHeight = (80 + 15) * this.props.series.length; // (castImage.height + castContainer.marginBottom)
		computedHeight += 447 + 40; // Header height + container ((20 paddingVertical) = 40)
		return (
			<View style={styles.container} onLayout={this.props.getTabHeight.bind(this, 'series', computedHeight)}>
			<Dropdown
			 label='სეზონის არჩევა'
			 baseColor="#fff"
			 textColor="#FFF"
			 data={this.state.seasons}
		   selectedItemColor="#000"
			 value={this.state.selected}
			 onChangeText={(data)=>this.onValueChange(data)}
		 />
				<View style={{marginTop:30}}/>
				{
				this.state.series.map((item,ind) => (

						<TouchableOpacity onPress={()=>this.playSerie(item.lang,item.quality,ind)} key={item.id} style={styles.castContainer}>
						{
							ind==this.state.selectedSerieId&&this.state.selectedSznId==this.state.selected?(
							<View style={[styles.characterContainer,{backgroundColor:"#F5F5F5"}]}>
								<Text style={[styles.characterName,{color:"#000"}]}>
									({ind+1}) {item.name}
								</Text>
							</View>
						):(
							<View style={styles.characterContainer}>
								<Text style={styles.characterName}>
									({ind+1}) {item.name}
								</Text>
							</View>

						)
						}





						</TouchableOpacity>
					))
				}
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
				<SwitchSelector options={this.state.options} initial={0} onPress={value => this.setState({selectedLang:value})} />
				<Text style={{color:"#FFF",paddingTop:20,paddingBottom:20}}>აირჩიე ხარისხი</Text>

        <SwitchSelector options={this.state.Quality_Options} initial={0} onPress={value => this.setState({selectedQual:value})} />
	      <View style={{marginTop:50,flexDirection: 'row'}}>


				<TouchableOpacity onPress={()=>this.setState({ShowModal:false})}style={{height:30,width:110,backgroundColor:"#2B2C3D",borderRadius:25,justifyContent: 'center',alignItems: 'center'}}>
			<Text style={{color:"#FFF"}} >დახურვა</Text>
			</TouchableOpacity>
			<View style={{width:10}}/>
				<TouchableOpacity  onPress={()=>this.Play()}style={{height:38,
					width:110,
					backgroundColor:"#FFF",borderRadius:5,justifyContent: 'center',alignItems: 'center'}}>
				<Text style={{color:"#2B2C3D"}}>კარგი</Text>
				</TouchableOpacity>


     </View>

</View>
</View>
				</Modal>
			</View>
		);
  }
}

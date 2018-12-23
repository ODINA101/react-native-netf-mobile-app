import React, { PropTypes,Component} from 'react';
import {
	Text,
	View,
	Image,
	TouchableOpacity
} from 'react-native';
import _ from 'lodash';
const apiKey = '9d2bff12ed955c7f1f74b83187f188ae'
import styles from './styles/Trailers';
import ProgressBar from '../../_global/ProgressBar';
import axios from "axios"
export default class Trailers extends Component {
	constructor(props) {
		super(props)

    this.state = {
			youtubeVideos:[],
			isLoading:true
		}
this.getTrailers()

	}
getTrailers() {
	const url = 'https://api.themoviedb.org' + encodeURI( '/3/search/movie?api_key=' + apiKey + '&query=' + this.props.item.title_en + ( ( this.props.item.year !== null ) ? '&year=' + this.props.item.year : '' ) )

	axios.get(url).then(res =>  {
	//	alert(res.data.results[0].id)
	let movieId = res.data.results[0].id
	const Turl = 'https://api.themoviedb.org' + encodeURI( '/3/movie/' + movieId + '/videos?api_key=' + apiKey )
	 axios.get(Turl).then(res => {
		 //alert(res.data.results[0].key)
		 this.setState({youtubeVideos:res.data.results,isLoading:false})

	 })
	 });
}


  render() {
	//const trailers = _.take(youtubeVideos, 10);
	let computedHeight = (90 + 10) * this.state.youtubeVideos.length; // (thumbnail.height + thumbnailContainer.marginBottom)
	computedHeight += 447 + 40; // Header height + container ((20 paddingVertical) = 40)
	if(this.state.isLoading) {
		return ( <View style={{flex:1,justifyContent: 'center',alignItems: 'center'}}><View style={styles.progressBar}><ProgressBar /></View></View> );

	}else{
		return (

<View style={styles.container} onLayout={this.props.getTabHeight.bind(this, 'trailers', computedHeight)}>

	{
		this.state.youtubeVideos.map((item, index) => (
			<TouchableOpacity key={index} onPress={this.props.openYoutube.bind(this, `http://youtube.com/watch?v=${item.key}`)}>
				<View style={styles.thumbnailContainer}>
					<Image source={{ uri: `https://img.youtube.com/vi/${item.key}/sddefault.jpg` }} style={styles.thumbnail} />
					<Text style={styles.title}>{item.name}</Text>
				</View>
			</TouchableOpacity>
		))
	}
</View>
);

	}

  }
}

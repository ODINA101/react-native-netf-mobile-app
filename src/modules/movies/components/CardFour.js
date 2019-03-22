/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import   ImageBackground from "./ImageBackground"
import img from "../kuka.jpeg"
export default class CardFour extends Component {
  constructor(props) {
    super(props)
  }
  render() {

   let name;
   if(this.props.collections) {
     name = this.props.info.name;
   }else{
     name = this.props.info.label;
   }


    return (
      <TouchableOpacity activeOpacity={0.6} onPress={()=>this.props.viewCat(this.props.info.id,name,this.props.collections)} style={styles.container}>
   {
     this.props.collections?(
      <ImageBackground
      resizeMode="cover"
      opacity={0.5}
      source={{uri:"http://staticnet.adjara.com/collections/thumb/" + this.props.info.id + "_big.jpg"}} style={{flex:1}}>
      </ImageBackground>
     ):(
      <ImageBackground
      resizeMode="cover"
      opacity={0.5}
      source={{uri:this.props.info.url?(this.props.info.url):("https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/No_image_3x4.svg/1280px-No_image_3x4.svg.png")}} style={{flex:1}}>
      </ImageBackground>
     )
   }


        {
            this.props.collections?(
              <Text style={{color:"#FFF",fontWeight: 'bold',width:80}}>{this.props.info.name}</Text>
            ):(

              <Text style={{color:"#FFF",fontWeight: 'bold'}}>{this.props.info.label}</Text>
            )

        }

      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height:80,
    width:130,
    backgroundColor:"black",
    marginRight: 10,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign:'center'


  },
});

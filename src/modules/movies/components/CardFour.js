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
    return (
      <TouchableOpacity activeOpacity={0.6} onPress={()=>this.props.viewCat(this.props.info.id,this.props.info.label)} style={styles.container}>
      <ImageBackground
      resizeMode="cover"
      opacity={0.5}
      source={{uri:this.props.info.url?(this.props.info.url):("https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/No_image_3x4.svg/1280px-No_image_3x4.svg.png")}} style={{flex:1}}>
      </ImageBackground>

        <Text style={{color:"#FFF",fontWeight: 'bold'}}>{this.props.info.label}</Text>

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


  },
});

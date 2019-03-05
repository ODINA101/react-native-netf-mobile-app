/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground
} from 'react-native';
import img from "../kuka.jpeg"
export default class CardFour extends Component {
  render() {
    return (
      <View style={styles.container}>

      <ImageBackground source={{uri:"https://www.sbs.com.au/movies/sites/sbs.com.au.film/files/styles/double/public/corn_island_704_2.jpg?itok=I5IJO749&mtime=1471280208"}} style={{flex:1}}>
          <Text>Inside</Text>
        </ImageBackground>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height:80,
    width:130,
    backgroundColor:"blue",
    marginRight: 10,
    borderRadius: 3
  },
});

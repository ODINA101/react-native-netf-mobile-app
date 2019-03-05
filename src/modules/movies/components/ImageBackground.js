import React,{Component} from 'react';
import { View, Image } from 'react-native';
export default class  ImageBackground extends Component {
constructor(props) {
  super(props)
}
render() {

  const { container, image } = styles;
  const props = this.props;

  return (

    <View style={container}>
      <Image
      borderRadius={4}
      style={[image,
        { resizeMode: props.resizeMode,
        opacity: props.opacity}
      ]}
      source={props.source}
      />
    </View>

  )
}


}

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  image: {
    flex: 1,
  }
};

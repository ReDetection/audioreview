'use strict';
import React, {
  Component,
} from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
} from 'react-native';


class AlbumItemRaw extends Component {

  render() {
    return (
      <TouchableHighlight onPress={ this.props.onPress } activeOpacity={ 100 } underlayColor="#ea4b54">
        <Image
          style={ styles.artistBg }
          resizeMode='cover'
          source={{uri:  this.props.imageURL  }}
        >
          <View style={ styles.container }>
            <Text style={ styles.artistName }>{ this.props.title }</Text>
            <Text style={ styles.artistSongs }>{ this.props.subtitle }</Text>
            <Text style={ styles.artistSongs }>{ this.props.description }</Text>
          </View>
        </Image>
      </TouchableHighlight>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingTop: 20,
    paddingBottom: 60,
    paddingLeft: 20,
    paddingRight: 20,
  },
  artistName: {
    color: "#FFF",
    backgroundColor: 'transparent',
    fontFamily: "Helvetica Neue",
    fontWeight: "500",
    fontSize: 18,
    marginBottom: 5
  },
  artistSongs: {
    color: "#CCC",
    backgroundColor: 'transparent',
    fontFamily: "Helvetica Neue",
    fontWeight: "300",
    fontSize: 14
  },
});

export default AlbumItemRaw;

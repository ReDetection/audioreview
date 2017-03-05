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
import {Actions} from 'react-native-router-flux';


class AlbumItem extends Component {

  render() {
    let tracksCount = this.props.repetition.tracks.length;
    let commentsCount = this.props.repetition.tracks.reduce((accumulator, track) => {
      return accumulator + track.comments.length;
    }, 0);

    return (
      <TouchableHighlight onPress={ () => Actions.albumShow({ repetition: this.props.repetition }) } activeOpacity={ 100 } underlayColor="#ea4b54">
        <Image
          style={ styles.artistBg }
          resizeMode='cover'
          source={{uri:  this.props.repetition.imageURL  }}
        >
        <View style={ styles.container }>
          <Text style={ styles.artistName }>{ this.props.repetition.title }</Text>
          <Text style={ styles.artistSongs }>{ tracksCount } { tracksCount == 1 ? "track" : "tracks"}</Text>
          <Text style={ styles.artistSongs }>{ commentsCount } { commentsCount == 1 ? "comment" : "comments" }</Text>
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

module.exports = AlbumItem;

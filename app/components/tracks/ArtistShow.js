'use strict';
import React, {
  Component,
} from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Image,
  TouchableHighlight,
  Text,
  View,
} from 'react-native';
import RealmListView from '../general/RealmListView';
import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import BackButton from '../general/BackButton';
import RoundedButton from '../general/RoundedButton';
var Promise = require('promise');

const window = Dimensions.get('window');
const PARALLAX_HEADER_HEIGHT = 280;
const STICKY_HEADER_HEIGHT = 54;
const AVATAR_SIZE = 120;

class ArtistShow extends Component {

  constructor(props) {
    super(props);
    this.state = {indexedSong: props.song};
    this.indexTracks();
  }

  indexTracks() {
    let songBeingIndexed = this.state.song;
    let existPromises = songBeingIndexed.tracks.map((track)=>{ return this.props.cache.hasLocalCacheForURL(track.trackURL); })
    this.setState({indexing: true});
    Promise.all(existPromises)
      .done((results)=>{
        if (this.state.song !== songBeingIndexed) {
          return;
        }
        let result = results.reduce((acc, i)=>{ return acc && i }, true);
        this.setState({downloaded: result, indexing: false});
      })
  }

  tracksToDownload() {
    return this.props.repetition.tracks.filter((track)=>{ return this.props.cache.hasLocalCacheForURL(track.trackURL); });
  }

  download() {
    this.setState({downloading: true});

  }

  renderDownloadButton() {
    if (this.state.downloading == true) {
      return (<Text>...</Text>);
    }
    if (this.state.indexing == true) {

    }
    if (this.tracksToDownload.length > 0) {
      return (<Icon onPress={ this.download.bind(this) } name="ios-cloud-download-outline" size={25} color="#fff"/>);
    }
    return (<Icon name="ios-cloud-done-outline" size={25} color="#fff"/>);
  }

  renderStickyHeader() {
    return(
      <View style={ styles.stickySection }>
        <Text style={ styles.stickySectionTitle }>{ this.props.repetition.title }</Text>
      </View>
    );
  }

  renderForeground() {
    return(
      <View key="parallax-header" style={ styles.parallaxHeader }>
        <Image style={ styles.avatar } source={{
          uri:  this.props.repetition.imageURL,
          width: AVATAR_SIZE,
          height: AVATAR_SIZE
        }}/>
        <Text style={ styles.artistName }>
          { this.props.repetition.title }
        </Text>
        <RoundedButton innerText="PLAY"
          onPress={ () => Actions.player({ songIndex: 0, songs: this.props.repetition.tracks,  repetition: this.props.repetition }) } />
      </View>
    );
  }

  renderBackground() {
    return(
      <View key="background" style={ styles.background }>
        <Image source={{uri: this.props.repetition.imageURL,
                        width: window.width,
                        height: PARALLAX_HEADER_HEIGHT}}/>
        <View style={ styles.backgroundOverlay }/>
      </View>
    );
  }

  renderSongsList() {
    let optionalCommentCounter = (song) => song.comments.length > 0 ? (
      <View style={{paddingRight: 10, paddingTop: 11, flexDirection: "row"}}>
        <Icon style={{ paddingRight: 5, paddingTop: -2 }} name="ios-chatbubbles-outline" size={25} color="#fff"/>
        <Text style={ styles.songTitle }>{ song.comments.length }</Text>
      </View>
    ) : null;
    return(
      <RealmListView
        collection={ this.props.repetition.tracks }
        style={ styles.songsList }
        renderRow={(song, sectionId, rowId) => (
          <TouchableHighlight onPress={ () => Actions.player({ songIndex: parseInt( rowId ), songs: this.props.repetition.tracks, repetition: this.props.repetition }) } activeOpacity={ 100 } underlayColor="rgba(246, 41, 118, 0.6)">
            <View style={styles.horizontalContainer}>
              <View key={song} style={ styles.song }>
                <Text style={ styles.songTitle }>
                  { song.title }
                </Text>
                <Text style={ styles.albumTitle }>
                  { song.album }
                </Text>
              </View>
              { optionalCommentCounter(song) }
            </View>
          </TouchableHighlight>
          )}/>
    );
  }

  render() {
    const { onScroll = () => {} } = this.props;
    return (
      <View style={styles.background}>
        <ParallaxScrollView
          style={ { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, width: window.width, height: window.height } }
          parallaxHeaderHeight={ PARALLAX_HEADER_HEIGHT }
          stickyHeaderHeight={ STICKY_HEADER_HEIGHT }
          onScroll={onScroll}
          renderStickyHeader={ this.renderStickyHeader.bind(this) }
          renderForeground={ this.renderForeground.bind(this) }
          renderBackground={ this.renderBackground.bind(this) }>
          { this.renderSongsList() }
        </ParallaxScrollView>
        <BackButton />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#000",
    width: window.width,
    height: window.height,
  },
  horizontalContainer: {
    flexDirection: 'row',
    marginLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#111",
  }, 
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    width: window.width,
    backgroundColor: 'rgba(0,0,0,.8)',
    height: PARALLAX_HEADER_HEIGHT
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    backgroundColor: '#000',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickySectionTitle: {
    paddingTop: 20,
    fontSize: 18,
    color: "#FFF",
  },
  parallaxHeader: {
    alignItems: 'center',
    paddingTop: 40,
    width: window.width,
  },
  artistName: {
    fontSize: 23,
    color: "#FFF",
    fontFamily: "Helvetica Neue",
  },
  avatar: {
    marginBottom: 12,
    borderRadius: AVATAR_SIZE / 2
  },
  songsList: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 5,
    height: window.height - STICKY_HEADER_HEIGHT,
  },
  song: {
    paddingTop: 10,
    paddingBottom: 10,
    marginRight: 20,
    flexGrow: 1,
  },
  songTitle: {
    color: "white",
    fontFamily: "Helvetica Neue",
    marginTop: 2,
    marginBottom: 5,
  },
  albumTitle: {
    color: "#BBB",
    fontFamily: "Helvetica Neue",
    fontSize: 12
  },

});

module.exports = ArtistShow;

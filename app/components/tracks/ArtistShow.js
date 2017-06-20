'use strict';
import React, {
  Component,
} from 'react';
import {
  Alert,
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

const window = Dimensions.get('window');
const PARALLAX_HEADER_HEIGHT = 280;
const STICKY_HEADER_HEIGHT = 54;
const AVATAR_SIZE = 120;

class ArtistShow extends Component {

  componentWillMount() {
    this.indexTracks(this.props.repetition);
  }

  componentWillReceiveProps(newProps) {
    if (this.state.indexedRepetition != newProps.repetition) {
      this.indexTracks(newProps.repetition);
    }
  }

  indexTracks(repetitionBeingIndexed) {
    this.setState({indexedRepetition: repetitionBeingIndexed, indexing: true});
    let existPromises = repetitionBeingIndexed.tracks.map((track)=>{ return this.props.cache.hasLocalCacheForURL(track.trackURL); })
    Promise.all(existPromises)
      .done((results)=>{
        if (this.state.indexedRepetition !== repetitionBeingIndexed) {
          return;
        }
        let result = results.reduce((acc, i)=>{ return acc && i }, true);
        this.setState({downloaded: result, indexing: false});
      })
  }

  download() {
    this.setState({downloading: true});
    let urls = this.props.repetition.tracks.map((track)=>{ return track.trackURL; });
    Promise.all(urls.map((url)=> { 
      return this.props.cache
        .hasLocalCacheForURL(url)
        .then((has)=>{
          return has ? Promise.resolve(null) : this.props.cache.downloadURL(url);
        });
    }))
      .done((results)=>{
        this.setState({downloading: false, indexing: true});
        this.indexTracks(this.props.repetition);
      });
  }

  deleteTracks() {
    Alert.alert(
      'Delete downloaded album',
      'Are you sure?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => {
          let deletes = this.props.repetition.tracks.map((track)=>{return this.props.cache.remove(this.props.cache.localPathForURL(track.trackURL));});
          Promise.all(deletes)
            .catch((err) => {
              console.log(err.message);
            })
            .done(()=>{
              this.indexTracks(this.props.repetition);
            });
        }},
      ]
    )
  }

  renderDownloadButton() {
    if (this.state.downloading === true) {
      return (<Text style={{color: 'white'}}>wait</Text>);
    }
    if (this.state.indexing === true) {
      return (<Text style={{color: 'white'}}>???</Text>);
    }
    if (this.state.downloaded === true) {
      return (<Icon onPress={ this.deleteTracks.bind(this) } name="ios-cloud-done-outline" size={25} color="#fff"/>);
    }
    return (<Icon onPress={ this.download.bind(this) } name="ios-cloud-download-outline" size={25} color="#fff"/>);
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
        <View style={styles.horizontalContainer}>
          <Text style={ styles.artistName }>
            { this.props.repetition.title }
          </Text>
          <View style={styles.icon}>
            { this.renderDownloadButton() }
          </View>
        </View>
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
          style={ { position: "absolute", top: 0, bottom: 0, left: 0, right: 0 } }
          contentBackgroundColor='#000'
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
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
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
    left: 0,
    right: 0,
    flex: 1,
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
    backgroundColor: "#000",
    paddingTop: 5,
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
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
  icon: {
    marginLeft: 10,
  }

});

module.exports = ArtistShow;

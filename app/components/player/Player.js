'use strict';
import React, {
  Component,
} from 'react';
import {
  Dimensions,
  StyleSheet,
  Platform,
  Text,
  View
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Slider from 'react-native-slider';
import Video from 'react-native-video';
import BackButton from '../general/BackButton';
import CommentsList from './CommentsList';


const window = Dimensions.get('window');
const defaultRewindStep = 10;

class Player extends Component {
  constructor(props){
    super(props);
    this.state = {
      playing: true,
      muted: false,
      shuffle: false,
      sliding: false,
      currentTime: 0,
      songIndex: props.songIndex,
      urlToPlay: null,
      downloaded: false,
    };
  }

  componentWillMount() {
    this.lookupSongURLWithIndex(this.state.songIndex);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.songIndex != newProps.songIndex || this.props.repetition !== newProps.repetition) {
      console.log("player receiveed new props");
      this.setState({
        urlToPlay: null,
        downloaded: false,
      });
    }
  }

  lookupSongURLWithIndex(songIndex) {
    let songPlaying = this.props.songs[songIndex];
    this.props.cache.hasLocalCacheForURL(songPlaying.trackURL)
      .done((has)=>{
        this.setState({
          urlToPlay: has ? this.props.cache.localPathForURL(songPlaying.trackURL) : songPlaying.trackURL,
          downloaded: has,
        });
      });
  }

  togglePlay(){
    this.setState({ playing: !this.state.playing });
  }

  toggleVolume(){
    this.setState({ muted: !this.state.muted });
  }

  toggleShuffle(){
    this.setState({ shuffle: !this.state.shuffle });
  }

  goBackward(){
    if(this.state.currentTime < 3 && this.state.songIndex !== 0 ){
      let newIndex = this.state.songIndex - 1
      this.setState({
        songIndex: newIndex,
        currentTime: 0,
        urlToPlay: null,
        downloaded: false,
      });
      this.lookupSongURLWithIndex(newIndex);
    } else {
      this.replay(this.state.currentTime);
    }
  }

  goForward(){
    let newIndex = this.state.songIndex + 1;
    this.setState({
      songIndex: newIndex,
      currentTime: 0,
      urlToPlay: null,
      downloaded: false,
    });
    this.lookupSongURLWithIndex(newIndex);
    if(this.refs.audio === undefined) {
        return;
    }
    this.refs.audio.seek(0);
  }

  randomSongIndex(){
    let maxIndex = this.props.songs.length - 1;
    return Math.floor(Math.random() * (maxIndex - 0 + 1)) + 0;
  }

  setTime(params){
    if( !this.state.sliding ){
      this.setState({ currentTime: params.currentTime });
    }
  }

  replay(rewindStep){
    if(this.state.songDuration === undefined || this.refs.audio === undefined) {
      return;
    }
    let newTime = this.state.currentTime <= rewindStep ? 0 : (this.state.currentTime - rewindStep);
    
    this.setState({
      currentTime: newTime,
    });
    this.refs.audio.seek(newTime);
  }

  forward(rewindStep){
    if(this.state.songDuration === undefined || this.refs.audio === undefined) {
      return;
    }
    let newTime = this.state.currentTime + rewindStep >= this.state.songDuration ? this.state.songDuration : (this.state.currentTime + rewindStep);
    
    this.refs.audio.seek(newTime);
    this.setState({
      currentTime: newTime,
    });
  }

  onLoad(params){
    this.setState({ songDuration: params.duration });
  }

  onSlidingStart(){
    this.setState({ sliding: true });
  }

  onSlidingChange(value){
    let newPosition = value * this.state.songDuration;
    this.setState({ currentTime: newPosition });
  }

  onSlidingComplete(){
    if(this.refs.audio === undefined) {
        return;
    }
    this.refs.audio.seek( this.state.currentTime );
    this.setState({ sliding: false });
  }

  onEnd(){
    if( !this.state.shuffle && this.state.songIndex + 1 === this.props.songs.length ) {
    this.setState({ playing: false });
    } else {
      this.goForward();
    }
  }

  onTapCompose() {
    let songPlaying = this.props.songs[this.state.songIndex];
    Actions.compose({song: songPlaying, second: this.state.currentTime});
    this.setState({ playing: false });
  }

  onSelectComment(comment) {
    if(this.refs.audio === undefined) {
        return;
    }
    this.refs.audio.seek( comment.second );
    this.setState({playing: true});
  }

  onLongSelectComment(comment) {
    let songPlaying = this.props.songs[this.state.songIndex];
    Actions.compose({song: songPlaying, second: comment.second, initialText: "@"+comment.author+": "});
  }

  render() {
    let songPlaying = this.props.songs[this.state.songIndex];
    let songPercentage;
    if( this.state.songDuration !== undefined ){
      songPercentage = this.state.currentTime / this.state.songDuration;
    } else {
      songPercentage = 0;
    }

    let playButton;
    if( this.state.playing ){
      playButton = <Icon onPress={ this.togglePlay.bind(this) } style={ styles.play } name="ios-pause" size={70} color="#fff" />;
    } else {
      playButton = <Icon onPress={ this.togglePlay.bind(this) } style={ styles.play } name="ios-play" size={70} color="#fff" />;
    }

    let forwardButton;
    if( !this.state.shuffle && this.state.songIndex + 1 === this.props.songs.length ){
      forwardButton = <Icon style={ styles.controlButton } name="ios-skip-forward" size={25} color="#333" />;
    } else {
      forwardButton = <Icon onPress={ this.goForward.bind(this) } style={ styles.controlButton } name="ios-skip-forward" size={25} color="#fff" />;
    }

    let player = null;
    let downloadedIcon = this.state.downloaded ? <Icon name="ios-cloud-done-outline" size={25} color="#fff" style={{marginBottom: 0}} /> : null;
    if (this.state.urlToPlay != undefined) {
      player = <Video source={{uri: this.state.urlToPlay }}
        ref="audio"
        volume={ this.state.muted ? 0 : 1.0}
        muted={false}
        paused={!this.state.playing}
        onLoad={ this.onLoad.bind(this) }
        onProgress={ this.setTime.bind(this) }
        progressUpdateInterval={500.0}
        playInBackground={true}
        onEnd={ this.onEnd.bind(this) }
        resizeMode="cover"
        repeat={false}/>;
    }

    return (
      <View style={styles.container}>
        { player }
        <View style={ styles.header }>
          <Text style={ styles.headerText }>
            { songPlaying.title }
          </Text>
          { downloadedIcon }
        </View>
        <BackButton />
        <View style={ styles.sliderContainer }>
          <Slider
            onSlidingStart={ this.onSlidingStart.bind(this) }
            onSlidingComplete={ this.onSlidingComplete.bind(this) }
            onValueChange={ this.onSlidingChange.bind(this) }
            minimumTrackTintColor='#851c44'
            style={ styles.slider }
            trackStyle={ styles.sliderTrack }
            thumbStyle={ styles.sliderThumb }
            value={ songPercentage }/>

          <View style={ styles.timeInfo }>
            <Text style={ styles.time }>{ formattedTime(this.state.currentTime)  }</Text>
            <Text style={ styles.timeRight }>- { formattedTime( this.state.songDuration - this.state.currentTime ) }</Text>
          </View>
        </View>
        <View style={ styles.controls }>
          <MaterialIcon onPress={ () => { this.replay(defaultRewindStep) } } style={ styles.controlButton } name="replay-10" size={25} color="#fff" />
          <Icon onPress={ this.goBackward.bind(this) } style={ styles.controlButton } name="ios-skip-backward" size={25} color="#fff" />
          { playButton }
          { forwardButton }
          <MaterialIcon onPress={ () => { this.forward(defaultRewindStep) } } style={ styles.controlButton } name="forward-10" size={25} color="#fff" />
        </View>
        <Icon style={styles.headerComment} name="ios-chatbubbles-outline" size={25} color="#fff" onPress = { this.onTapCompose.bind(this) }/>
        <View style={styles.wide}>
          <CommentsList song={songPlaying} onSelectComment={this.onSelectComment.bind(this)} onLongSelectComment={this.onLongSelectComment.bind(this)}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  wide: {
    left: 0,
    right: 0,
  },
  header: {
    paddingTop: 10,
    marginTop: 17,
    marginBottom: 17,
    flexDirection: 'row',
  },
  headerComment: {
    position: 'absolute',
    top: 16,
    right: 0,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerText: {
    color: "#FFF",
    fontSize: 18,
    textAlign: 'center',
    paddingLeft: 5,
    paddingRight: 5,
  },
  controls: {
    flexDirection: 'row',
    marginTop: 15,
  },
  controlButton: {
    padding: 22,
  },
  play: {
    marginLeft: 28,
    marginRight: 28,
  },
  shuffle: {
    marginTop: 26,
  },
  volume: {
    marginTop: 26,
  },
  sliderContainer: {
    width: window.width - 40,
  },
  timeInfo: {
    flexDirection: 'row',
  },
  time: {
    color: '#FFF',
    flex: 1,
    fontSize: 10,
  },
  timeRight: {
    color: '#FFF',
    textAlign: 'right',
    flex: 1,
    fontSize: 10,
  },
  slider: {
    height: 20,
  },
  sliderTrack: {
    height: 2,
    backgroundColor: '#333',
  },
  sliderThumb: {
    top: 11,
    width: 10,
    height: 10,
    backgroundColor: '#f62976',
    borderRadius: 10 / 2,
    shadowColor: 'red',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 2,
    shadowOpacity: 1,
  }
});

//TODO: Move this to a Utils file
function withLeadingZero(amount){
  if (amount < 10 ){
    return `0${ amount }`;
  } else {
    return `${ amount }`;
  }
}

function formattedTime( timeInSeconds ){
  let minutes = Math.floor(timeInSeconds / 60);
  let seconds = timeInSeconds - minutes * 60;

  if( isNaN(minutes) || isNaN(seconds) ){
    return "";
  } else {
    return(`${ withLeadingZero( minutes ) }:${ withLeadingZero( seconds.toFixed(0) ) }`);
  }
}


module.exports = Player;

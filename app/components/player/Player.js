'use strict';
import React, {
  Component,
} from 'react';
import {
  Image,
  Dimensions,
  StyleSheet,
  Platform,
  Text,
  View
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from 'react-native-slider';
import Video from 'react-native-video';


const window = Dimensions.get('window');

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
    };
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
      this.setState({
        songIndex: this.state.songIndex - 1,
        currentTime: 0,
      });
    } else {
      this.refs.audio.seek(0);
      this.setState({
        currentTime: 0,
      });
    }
  }

  goForward(){
    this.setState({
      songIndex: this.state.shuffle ? this.randomSongIndex() : this.state.songIndex + 1,
      currentTime: 0,
    });
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
    this.refs.audio.seek( this.state.currentTime );
    this.setState({ sliding: false });
  }

  onEnd(){
    this.setState({ playing: false });
  }

  onTapCompose() {
    let songPlaying = this.props.songs[this.state.songIndex];
    Actions.compose({song: songPlaying, second: this.state.currentTime});
    this.setState({ playing: false });
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
      forwardButton = <Icon style={ styles.forward } name="ios-skip-forward" size={25} color="#333" />;
    } else {
      forwardButton = <Icon onPress={ this.goForward.bind(this) } style={ styles.forward } name="ios-skip-forward" size={25} color="#fff" />;
    }

    let image = songPlaying.albumImage ? songPlaying.albumImage : this.props.image;
    return (
      <View style={styles.container}>
        <Video source={{uri: songPlaying.trackURL }}
            ref="audio"
            volume={ this.state.muted ? 0 : 1.0}
            muted={false}
            paused={!this.state.playing}
            onLoad={ this.onLoad.bind(this) }
            onProgress={ this.setTime.bind(this) }
            onEnd={ this.onEnd.bind(this) }
            resizeMode="cover"
            repeat={false}/>

        <View style={ styles.header }>
          <Text style={ styles.headerText }>
            { this.props.repetition.title }
          </Text>
        </View>
        <View style={ styles.headerClose }>
          <Icon onPress={ Actions.pop } name="ios-arrow-back" size={15} color="#fff" />
        </View>
        <Text style={ styles.songTitle }>
          { songPlaying.title }
        </Text>
        <Text style={ styles.albumTitle }>
          { songPlaying.album }
        </Text>
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
          <Icon onPress={ this.goBackward.bind(this) } style={ styles.back } name="ios-skip-backward" size={25} color="#fff" />
          { playButton }
          { forwardButton }
        </View>
        <Icon style={styles.headerComment} name="ios-chatbubbles-outline" size={25} color="#fff" onPress = { this.onTapCompose.bind(this) }/>
       
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
  header: {
    marginTop: 17,
    marginBottom: 17,
    width: window.width,
  },
  headerClose: {
    position: 'absolute',
    top: 10,
    left: 0,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
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

  composeToolbar: {
    width: window.width,
  },
  headerText: {
    color: "#FFF",
    fontSize: 18,
    textAlign: 'center',
  },
  songImage: {
    marginBottom: 20,
  },
  songTitle: {
    color: "white",
    fontFamily: "Helvetica Neue",
    marginBottom: 10,
    marginTop: 13,
    fontSize: 19
  },
  albumTitle: {
    color: "#BBB",
    fontFamily: "Helvetica Neue",
    fontSize: 14,
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    marginTop: 30,
  },
  back: {
    marginTop: 22,
    marginLeft: 45,
  },
  play: {
    marginLeft: 50,
    marginRight: 50,
  },
  forward: {
    marginTop: 22,
    marginRight: 45,
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

const MIN_COMPOSER_HEIGHT = Platform.select({
  ios: 33,
  android: 41,
});
const MAX_COMPOSER_HEIGHT = 100;
const MIN_INPUT_TOOLBAR_HEIGHT = 44;

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

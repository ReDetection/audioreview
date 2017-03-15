'use strict';
import React, {
  Component,
} from 'react';
import {
  Dimensions,
  StyleSheet,
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

const window = Dimensions.get('window');

class Mentions extends Component {

  openSongFromComment(comment) {
    let song = this.props.model.findTrackWithComment(comment);
    Actions.player({songIndex: 0, songs: [song]});
  }

  render() {
    return (
      <View style={styles.background}>
        <View style={ styles.header } />
        <BackButton />
        <RealmListView
          collection={this.props.collection}
          renderRow={ ( comment ) => <CommentItem comment={ comment } onSelectComment={()=>{this.openSongFromComment(comment)}} {...this.props} /> }/>
      </View>
    );
  }
}

class CommentItem extends Component {
  constructor(props){
    super(props);
    this.onSelectComment = props.onSelectComment || ((comment)=>{});
    this.onLongSelectComment = props.onLongSelectComment || ((comment)=>{});
  }

  render() {
    return (
      <TouchableHighlight 
        onPress={ () => this.onSelectComment(this.props.comment) } 
        onLongPress={ () => this.onLongSelectComment(this.props.comment)}
        activeOpacity={ 100 } underlayColor="#ea4b54">
        <View style={ styles.horizontalContainer }>
          <View>
            <Text style={ styles.authorName }>{ this.props.comment.author }
              <Text style={ styles.time }>{'\n'}{ formattedTime(this.props.comment.second) }</Text>
            </Text>
          </View>
          <View style={{flexShrink: 1}}>
            <Text style={ styles.comment } >{ this.props.comment.text }</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  horizontalContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    flexDirection: 'row',
    marginLeft: 4,
    width: window.width,
  }, 
  header: {
    paddingTop: 10,
    marginTop: 17,
    marginBottom: 25,
    flexDirection: 'row',
  },
  authorName: {
    color: "#FFF",
    backgroundColor: 'transparent',
    fontFamily: "Helvetica Neue",
    fontSize: 14,
    marginBottom: 5,
    paddingRight: 5,
  },
  time: {
    color: "gray",
    backgroundColor: 'transparent',
    fontFamily: "Helvetica Neue",
    fontSize: 14,
    marginBottom: 5,
    paddingRight: 5,
    paddingTop: 2,
  },
  comment: {
    color: "#CCC",
    backgroundColor: 'transparent',
    fontFamily: "Helvetica Neue",
    fontSize: 14,
    textAlign: 'left',
    paddingLeft: 2,
    flexWrap: 'wrap',
  },
  commentSong: {
    color: "#CCC",
    backgroundColor: 'transparent',
    fontFamily: "Helvetica Neue",
    fontSize: 14,
    textAlign: 'left',
    paddingLeft: 2,
    flexWrap: 'wrap',
    fontWeight: 'bold',
  },
  background: {
    backgroundColor: "#000",
    width: window.width,
    height: window.height,
  },
  stickySectionTitle: {
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
  song: {
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#111",

  },
  songTitle: {
    color: "white",
    fontFamily: "Helvetica Neue",
    marginBottom: 5,
  },
  albumTitle: {
    color: "#BBB",
    fontFamily: "Helvetica Neue",
    fontSize: 12
  },

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

module.exports = Mentions;

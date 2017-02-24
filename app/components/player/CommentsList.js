'use strict';

import React, {
  Component,
} from 'react';
import {
  StyleSheet,
  Image,
  Dimensions,
  TouchableHighlight,
  Text,
  TextInput,
  View,
} from 'react-native';
import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import { model } from '../../Model';
import RealmListView from '../general/RealmListView';

const window = Dimensions.get('window');

class CommentsList extends Component {

  constructor(props){
    super(props);
    this.state = {song: props.song};
    this.onSelectComment = props.onSelectComment || (()=>{});
  }

  render() {
    return (
        <RealmListView
          collection={this.state.song.comments}
          renderRow={ ( comment ) => <CommentItem comment={ comment } /> }/>
    );
  }

};

class CommentItem extends Component {
  render() {
    return (
      <TouchableHighlight onPress={ () => this.onSelectComment() } activeOpacity={ 100 } underlayColor="#ea4b54">
        <View style={ styles.horizontalContainer }>
            <Text style={ styles.authorName }>{ this.props.comment.author }
            <Text style={ styles.time }>{'\n'}{ formattedTime(this.props.comment.second) }</Text></Text>
          <Text style={ styles.comment } >{ this.props.comment.text }</Text>
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
    width: window.width,
  }, 
  verticalContainer: {
    flex: 1,
  },
  authorName: {
    color: "#FFF",
    backgroundColor: 'transparent',
    fontFamily: "Helvetica Neue",
    fontWeight: "500",
    fontSize: 14,
    marginBottom: 5,
    paddingRight: 5,
  },
  time: {
    color: "gray",
    backgroundColor: 'transparent',
    fontFamily: "Helvetica Neue",
    fontWeight: "500",
    fontSize: 14,
    marginBottom: 5,
    paddingRight: 5,
    paddingTop: 2,
  },
  comment: {
    color: "#CCC",
    backgroundColor: 'transparent',
    fontFamily: "Helvetica Neue",
    fontWeight: "300",
    fontSize: 14,
    textAlign: 'left',
    paddingRight: 2,
    marginRight: 3,
    paddingLeft: 2,
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

module.exports = CommentsList;
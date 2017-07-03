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
import RealmListView from '../general/RealmListView';

const window = Dimensions.get('window');

class CommentsList extends Component {

  constructor(props){
    super(props);
    this.state = {song: props.song};
  }

  componentWillReceiveProps(newProps) {
    if (this.props.song !== newProps.song) {
      this.setState({song: newProps.song});
    }
  }

  render() {
    return (
        <RealmListView
          enableEmptySections={true}
          collection={this.state.song.comments.sorted(['second', 'date'])}
          renderRow={ ( comment ) => <CommentItem comment={ comment } {...this.props} /> }/>
    );
  }

};

class CommentItem extends Component {
  constructor(props){
    super(props);
    this.onSelectComment = props.onSelectComment || ((comment)=>{});
    this.onLongSelectComment = props.onLongSelectComment || ((comment)=>{});
  }

  render() {
    return (
      <TouchableHighlight 
        onPress={ () => this.props.onSelectComment(this.props.comment) } 
        onLongPress={ () => this.props.onLongSelectComment(this.props.comment)}
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
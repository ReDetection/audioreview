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
import BackButton from '../general/BackButton';

const window = Dimensions.get('window');

class ComposeComment extends Component {

  constructor(props){
    super(props);
    this.state = {text: props.initialText || ''};
  }

  componentDidMount() {
    this.refs.commentInput.focus();
  }

  sendComment() {
    this.props.model.createComment(this.state.text, this.props.song, this.props.second);
    Actions.pop();
  }

  render() {
    return (
      <View style={styles.background}>
        <View style={ styles.header }>
          <Text style={ styles.headerText }>
            Comment at { formattedTime(this.props.second) }
          </Text>
        </View>
        <BackButton />
        <View style={ styles.headerSend }>
          <Icon style={ styles.headerSendButton } onPress={ this.sendComment.bind(this) } name="ios-checkmark" size={30} color="#fff" />
        </View>
        <TextInput ref='commentInput' style={styles.input} autoCorrect={false} numberOfLines={8} placeholder="Enter comment" multiline={true} onChangeText={(text) => this.setState({text: text})} editable={true} value={this.state.text}/>
      </View>
    );
  }

};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#000",
    flex: 1,
  },
  input: {
    color: "white",
    width: window.width,
    height: 100,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  header: {
    paddingTop: 10,
    marginTop: 17,
    marginBottom: 17,
    width: window.width,
  },
  headerSend: {
    position: 'absolute',
    top: 12,
    right: 0,
  },
  headerSendButton: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerText: {
    color: "#FFF",
    fontSize: 18,
    textAlign: 'center',
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    // width: window.width,
    backgroundColor: 'rgba(0,0,0,.8)',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#fff',
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

module.exports = ComposeComment;
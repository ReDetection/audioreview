'use strict';
import React, {
  Component,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';

class RoundedButton extends Component {
  render() {
    return (
      <View style={ styles.playButton }>
        <Text
          {...this.props}
          style={ styles.playButtonText }>
          {this.props.innerText}
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  playButton: {
    marginTop: 15,
    backgroundColor: "#f62976",
    borderRadius: 200,
    padding: 2,
  },
  playButtonText: {
    color: "#FFF",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 70,
    paddingRight: 70,
    backgroundColor: "transparent",
    fontFamily: "Helvetica Neue",
    fontSize: 13,
  },
});

module.exports = RoundedButton;

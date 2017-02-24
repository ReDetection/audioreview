'use strict';
import React, {
  Component,
} from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';

class BackButton extends Component {
  render() {
    return (
      <View style={ styles.headerClose }>
        <Icon onPress={ Actions.pop } name="ios-arrow-back" size={15} color="#fff" {...this.props} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  headerClose: {
    position: 'absolute',
    top: 20,
    left: 0,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

module.exports = BackButton;

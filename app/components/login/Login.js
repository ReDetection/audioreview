'use strict';
import React, {
  Component,
} from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View
} from 'react-native';
import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
import RoundedButton from '../general/RoundedButton';
const Realm = require('realm');

class Login extends Component {

  doRegister() {
    let username = this.refs.username._lastNativeText;
    let password = this.refs.password._lastNativeText;
    Realm.Sync.User.register(this.props.authURL, username, password, (error, user) => { 
      if (user) {
        this.connectUser(username, user);
      } else if (error) {
        this.refs.error.value=error;
      }
    });
  }

  doLogin() {
    let username = this.refs.username._lastNativeText;
    let password = this.refs.password._lastNativeText;
    Realm.Sync.User.login(this.props.authURL, username, password, (error, user) => { 
      if (user) {
        this.connectUser(username, user);
      } else if (error) {
        this.refs.error.value=error;
      }
    });
  }

  connectUser(username, user) {
    this.props.model.connectWithUser(user);
    if (this.props.model.nickname == undefined) {
      this.props.model.registerNickname(username);
    }
    Actions.root();
  }

  render() {
    return (
      <View style={styles.horizontalContainer}>
        <View>
          <Text ref="error" style={{height: 60, color:"red"}} />
          <TextInput ref="username" style={styles.textInput} placeholer="Username" autoCorrect={false} />
          <TextInput ref="password" style={styles.textInput} placeholer="Password" secureTextEntry={true} autoCorrect={false} />
          <RoundedButton innerText="LOGIN" onPress={this.doLogin.bind(this)} autoCapitalize='none' />
          <RoundedButton innerText="register" onPress={this.doRegister.bind(this)} autoCapitalize='none' />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  horizontalContainer: {
    flexDirection:"row",
    alignItems: "flex-start",
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#111',
  },
  textInput: {
    height: 44,
    width: 180,
    color: '#fff',
    borderWidth: 1,
    borderColor: "#f62976",
    marginTop: 15,
  },
  instructions: {
    textAlign: 'center',
    color: '#aaa',
    marginBottom: 5,
  },
});

module.exports = Login;

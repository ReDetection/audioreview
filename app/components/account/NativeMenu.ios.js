import React, {
  Component,
} from 'react';
import {
  StyleSheet,
  View,
  ActionSheetIOS,
} from 'react-native';

class NativeMenu extends Component {

  present() {
    let keys = Object.keys(this.props.options);
    var buttons = keys.slice();
    buttons.push("Cancel");
    let destructive = keys.findIndex((value)=>{return this.props.options[value].destructive});
    ActionSheetIOS.showActionSheetWithOptions({
      options: buttons,
      cancelButtonIndex: keys.length,
      destructiveButtonIndex: destructive,
    }, (buttonIndex)=>{
      if (buttonIndex < keys.length) {
        this.props.options[keys[buttonIndex]].handler();
      }
    });
  }

  render() {
    return <View style={styles.container}>
      {this.props.children}
    </View>;
  }

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#111',
  },
});

export default NativeMenu;

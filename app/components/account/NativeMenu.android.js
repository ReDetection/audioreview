import React, {
  Component,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  DrawerLayoutAndroid,
} from 'react-native';

class NativeMenu extends Component {

  present() {
    this.refs.drawer.openDrawer();
  }

  render() {
    return <DrawerLayoutAndroid style={styles.container}
      ref="drawer"
      drawerWidth={300}
      drawerPosition={DrawerLayoutAndroid.positions.Left}
      renderNavigationView={this.renderOptions.bind(this)}>
      {this.props.children}
    </DrawerLayoutAndroid>;
  }

  renderOptions() {
    let contents = Object.keys(this.props.options).map((key)=>{return this.renderOption(key, this.props.options[key].handler)});
    return <View style={{flex: 1, backgroundColor: '#000'}}>
      {contents}
    </View>
  }

  renderOption(title, handler) {
    return <TouchableHighlight onPress={ handler } activeOpacity={ 100 } underlayColor="#ea4b54">
      <View style={ styles.itemContainer }>
        <Text style={ styles.artistName }>{ title }</Text>
      </View>
    </TouchableHighlight>;
  }

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#111',
  },
  itemContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
  },
  artistName: {
    color: "#FFF",
    backgroundColor: 'transparent',
    fontFamily: "Helvetica Neue",
    fontWeight: "500",
    fontSize: 18,
    marginBottom: 5
  },
});

export default NativeMenu;

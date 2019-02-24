'use strict';
import React, {
  Component,
} from 'react';
import { ListView } from 'realm/react-native';

class RealmListView extends Component {
  constructor(props){
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => true }),
      collection: props.collection,
    };
    this.listener = (rows, changes) => {
      this.setState({dataSource: this.state.dataSource.cloneWithRows(rows)});
    };
  }

  componentWillMount() {
    this.applyCollection(this.props.collection);
  }

  componentWillUnmount() {
    if (this.state.collection != undefined) {
      this.state.collection.removeListener(this.listener);
    }
  }

  applyCollection(collection) {
    if (this.state.collection != undefined) {
      this.state.collection.removeListener(this.listener);
    }
    collection.addListener(this.listener);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(collection),
      collection: collection,
    });
  }

  componentWillReceiveProps(newProps) {
    if (this.props.collection !== newProps.collection) {
      this.applyCollection(newProps.collection);
    }
  }

  render() {
    return (
      <ListView 
        indicatorStyle="white"
        dataSource={this.state.dataSource}
        {...this.props} />
    );
  }

};

module.exports = RealmListView;

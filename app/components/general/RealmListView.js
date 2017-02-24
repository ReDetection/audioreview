'use strict';
import React, {
  Component,
} from 'react';
import { ListView } from 'realm/react-native';

class RealmListView extends Component {
  constructor(props){
    super(props);
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => true });
    let collection = props.collection;
    collection.addListener((rows, changes) => {
      this.setState({dataSource: ds.cloneWithRows(rows)});
    });
    this.state = {
      dataSource: ds.cloneWithRows(collection),
    }
  }

  render() {
    return (
      <ListView 
        dataSource={this.state.dataSource}
        {...this.props} />
    );
  }

};

module.exports = RealmListView;

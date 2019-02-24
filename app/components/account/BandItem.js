'use strict';
import React, {
  Component,
} from 'react';
import AlbumItemRaw from '../albums/AlbumItemRaw';


class BandItem extends Component {

  render() {
    return (
      <AlbumItemRaw onPress={ this.props.onPress } 
                    title={this.props.band.title}
      />
    );
  }

}

module.exports = BandItem;

'use strict';
import React, {
  Component,
} from 'react';
import AlbumItemRaw from './AlbumItemRaw';


class AlbumItem extends Component {

  render() {
    let tracksCount = this.props.repetition.tracks.length;
    let commentsCount = this.props.repetition.tracks.reduce((accumulator, track) => {
      return accumulator + track.comments.length;
    }, 0);

    return (
      <AlbumItemRaw onPress={ this.props.onPress } 
                    title={this.props.repetition.title}
                    subtitle={ tracksCount + (tracksCount == 1 ? " track" : " tracks") }
                    description={ commentsCount + (commentsCount == 1 ? " comment" : " comments") }
                    imageURL={this.props.repetition.imageURL}
      />
    );
  }

}

module.exports = AlbumItem;

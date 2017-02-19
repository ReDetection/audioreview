var Realm = require('realm');

const RepetitionSchema = {
  name: 'Repetition',
  properties: {
    title: 'string',
    date: 'date',
    imageURL: {type: 'string', optional: true},
    tracks: {type: 'list', objectType: 'Track'},
  }
};
const TrackSchema = {
  name: 'Track',
  properties: {
    title:     'string',
    duration: {type: 'int', default: 0},
    trackURL:  'string',
    comments: {type: 'list', objectType: 'Comment'},
  }
};
const CommentSchema = {
  name: 'Comment',
  properties: {
    author:     'string',
    text:     'string',
    second: {type: 'int', default: 0},
    date: 'date',
  }
};


class Model {

    constructor(realm) {
        this.realm = realm;
    }

    get repetitions() {
        return this.realm.objects('Repetition');
    }

};


module.exports = { model: new Model(new Realm({
    schema: [RepetitionSchema, TrackSchema, CommentSchema],
    schemaVersion: 1,
})) };

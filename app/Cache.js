'use strict';
var RNFS = require('react-native-fs');
var url = require("url");


class Cache {
    
    constructor() {

    }

    localPathForURL(url) {
        return RNFS.DocumentDirectoryPath + url.parse(url).pathname;
    }

    hasLocalCacheForURL(url) {
        return this.hasFile(this.localPathForURL(url));
    }

    hasFile(url) {
        return RNFS.exists(url);
    }

};

module.exports = Cache;

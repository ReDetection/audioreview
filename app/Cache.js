'use strict';
var RNFS = require('react-native-fs');
var parse = require("url-parse");


class Cache {
    
    constructor() {

    }

    localPathForURL(url) {
        return RNFS.DocumentDirectoryPath + parse(url).pathname;
    }

    hasLocalCacheForURL(url) {
        return this.hasFile(this.localPathForURL(url));
    }

    hasFile(url) {
        return RNFS.exists(url);
    }

    downloadURL(url) {
        let localpath = this.localPathForURL(url);
        let localdir = localpath.substring(0, localpath.lastIndexOf("/"));
        console.log(localpath);
        return RNFS.mkdir(localdir, {NSURLIsExcludedFromBackupKey: true})
            .then(()=>{
                let job = RNFS.downloadFile({
                    fromUrl: url,
                    toFile: localpath,
                });
                return job.promise;
            });
    }

};

module.exports = Cache;

"use strict";
const gutil = require("gulp-util");
const path = require("path");
const through = require("through2");
const fs = require('fs');

const File = gutil.File;
const PluginError = gutil.PluginError;

var PLUGIN_NAME = "gulp-ui5-cachebuster";

exports.default = function(time, prefix) {
  let cacheBuster = {};
  let cacheDirectory = String(time);

  function bufferContents(file, enc, cb) {
    // Ignore empty files
    if (file.isNull()) {
      cb();
      return;
    }

    // We don't support streams
    if (file.isStream()) {
      this.emit("error", new PluginError(PLUGIN_NAME, "Streaming not supported"));
      cb();
      return;
    }
    var code = file.contents.toString();

    cacheBuster[(prefix) ? `${prefix}/${file.relative}` : file.relative] = cacheDirectory;
    cb();
  }

  function endStream(cb) {
    fs.writeFileSync('./sap-ui-cachebuster-info.json', JSON.stringify(cacheBuster));
    cb();
  }

  return through.obj(bufferContents, endStream);
};
module.exports = exports.default;

"use strict";

var renderer = require('./lib/renderer'),
    Templatist = {};

renderer(Templatist);

module.exports = Templatist;

// Define for amd
window.define('nodebb-templatist', function() {
    return Templatist;
});


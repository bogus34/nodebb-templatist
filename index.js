"use strict";

var compiler = require('./lib/compiler'),
    renderer = require('./lib/renderer'),
    express = require('./lib/express'),
    Templatist = {};

compiler(Templatist);
renderer(Templatist);
express(Templatist);

module.exports = Templatist;

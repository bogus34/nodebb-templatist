"use strict";

var Templatist = {};
require('./compiler')(Templatist);
require('./renderer')(Templatist);
require('./express')(Templatist);

module.exports = Templatist;

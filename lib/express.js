"use strict";

var merge = require('merge-util');

module.exports = function(Templatist) {
    Templatist.augmentExpress = function(app) {
        app.render = function(name, options, fn) {
            var opts = {};
            if ('function' == typeof options) {
                fn = options, options = {};
            }
            merge(opts, this.locals);
            if (options._locals) {
                merge(opts, options._locals);
            }
            merge(opts, options);
            try {
                Templatist.render(name, '', opts, fn);
            } catch (err) {
                fn(err);
            }
        };
    };
};

"use strict";

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('nodebb-templatist/renderer', factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.TemplatistRenderer = factory();
    }
}(this, function () {
    return function(Templatist) {
        var templatesCache = {},
            typesCache = {},
            loaders = {},
            helpers = {};

        Templatist.updateTypesCache = function(obj) {
            for (var name in obj) {
                if (obj.hasOwnProperty(name)) {
                    typesCache[name] = obj[name];
                }
            }
        };

        Templatist.lookupType = function(name) {
            return typesCache[name];
        };

        Templatist.registerLoader = function(ext, loader) {
            loaders[ext] = loader;
            for (var name in helpers) {
                Templatist.registerHelper(name, helpers[name], ext);
            }
        };

        Templatist.registerHelper = function(name, helper, ext) {
            if (!ext) {
                helpers[name] = helper;
                for (var key in loaders) {
                    Templatist.registerHelper(name, helper, key);
                }
            }
            else {
                loaders[ext].registerHelper(name, helper);
            }
        };

        Templatist.load = function(name, callback) {
            if (templatesCache[name]) {
                callback(null, templatesCache[name]);
                return;
            }

            var ext = Templatist.lookupType(name);
            if (!ext) {
                callback(new Error('Can\'t determine template type: ' + name));
                return;
            }

            if (!loaders[ext]) {
                callback(new Error('Loader not found for extension ' + ext));
                return;
            }

            try {
                loaders[ext](name, callback);
            } catch (err) {
                callback(err);
            };
        };

        Templatist.render = function(name, block, data, callback) {
            Templatist.load(name, function(err, render) {
                if (err) {
                    callback(err);
                    return;
                }

                try {
                    render(name, block, data, callback);
                } catch (err) {
                    callback(err);
                }
            });
        };
    };
}));

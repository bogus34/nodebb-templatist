"use strict";

module.exports = function(Templatist) {
    var templatesCache = {},
        typesCache = {},
        loaders = {},
        helpers = {},
        WILDCARD = '*',
        globals = {};

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
        var hs = Templatist.getHelpers(ext);
        for (var name in hs) {
            loader.registerHelper(name, hs[name]);
        }

        for (name in globals) {
            loader.setGlobal(name, globals[name]);
        }
    };

    Templatist.registerHelper = function(name, helper, ext) {
        ext = ext || WILDCARD;
        helpers[ext] = helpers[ext] || {};

        if (ext == WILDCARD) {
            for (var key in loaders) {
                // Specific helpers are always takes precedence over wildcard
                if (!helpers[key] || !helpers[key][name]) {
                    loaders[key].registerHelper(name, helper);
                }
            }
        } else {
            if (loaders[ext]) {
                loaders[ext].registerHelper(name, helper);
            }
        }
    };

    Templatist.getHelpers = function(ext) {
        var hs = {};
        if (helpers[ext]) {
            for (var name in helpers[ext]) {
                hs[name] = helpers[ext][name];
            }
        }
        if (helpers[WILDCARD]) {
            for (name in helpers[WILDCARD]) {
                if (!hs[name]) {
                    hs[name] = helpers[WILDCARD][name];
                }
            }
        }

        return hs;
    };

    Templatist.setGlobal = function(name, value, ext) {
        if (!ext) {
            globals[name] = value;
            for (var key in loaders) {
                Templatist.setGlobal(name, value, key);
            }
        }
        else {
            loaders[ext].setGlobal(name, value);
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
            loaders[ext](name, function(err, render) {
                if (err) {
                    callback(err);
                    return;
                }

                templatesCache[name] = render;
                callback(null, render);
            });
        } catch (err) {
            callback(err);
        };
    };

    Templatist.render = function(name, block, data, callback) {
        if (typeof data == 'function' && typeof callback == 'undefined') {
            callback = data;
            data = null;
        }

        if (typeof block == 'object') {
            data = block;
            block = '';
        }

        if (typeof name != 'string'
            || typeof block != 'string'
            || typeof data != 'object'
            || typeof callback != 'function') {
            console.log("[Templatist warning] render arguments looks wrong: " + arguments);
        }

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

    Templatist.flush = function() {
        templatesCache = {};
    };
};


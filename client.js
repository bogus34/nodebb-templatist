/*** AUTOGENERATED FILE - DO NOT EDIT DIRECTLY ***/

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
            helpers = {},
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

        function registerSomething(store, method, name, value, ext) {
            if (!ext) {
                store[name] = value;
                for (var key in loaders) {
                    registerSomething(store, method, name, value, key);
                }
            }
            else {
                loaders[ext][method].call(loaders[ext], name, value);
            }
        }

        Templatist.registerLoader = function(ext, loader) {
            loaders[ext] = loader;
            var name;
            for (name in helpers) {
                Templatist.registerHelper(name, helpers[name], ext);
            }
            for (name in globals) {
                Templatist.setGlobal(name, globals[name], ext);
            }
        };

        Templatist.registerHelper = function(name, helper, ext) {
            registerSomething(helpers, 'registerHelper', name, helper, ext);
        };

        Templatist.setGlobal = function(name, value, ext) {
            registerSomething(globals, 'setGlobal', name, value, ext);
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
                || typeof callback != 'function')
            {
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
    };
}));
"use strict";
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as a module.
        define('nodebb-templatist/compiler', ['path'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('path'));
    } else {
        // Browser globals (root is window)
        root.TemplatistCompiler = factory(root.path);
    }
}(this, function (path) {
    return function(Templatist) {
        var compilers = {};

        Templatist.registerCompiler = function(extension, compiler) {
            compilers[extension] = compiler;
        };

        Templatist.compile = function(paths, relativePath, callback) {
            var ext = path.extname(relativePath).substr(1);
            var compiler = compilers[ext];

            if (!compiler) {
                callback(new Error('Compiler not found for extension ' + ext));
                return;
            }

            compiler(paths, relativePath, callback);
        };
    };
}));
"use strict";

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as a module.
        define('nodebb-templatist', ['nodebb-templatist/compiler', 'nodebb-templatist/renderer'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./lib/compiler'), require('./lib/renderer'), require('./lib/express'));
    } else {
        // Browser globals (root is window)
        root.Templatist = factory(root.TemplatistCompiler, root.TemplatistRenderer);
    }
}(this, function (compiler, renderer, /* optional */ express) {
    var Templatist = {};
    compiler(Templatist);
    renderer(Templatist);
    if (express) {
        express(Templatist);
    }

    return Templatist;
}));

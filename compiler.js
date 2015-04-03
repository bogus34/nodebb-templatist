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

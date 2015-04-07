"use strict";
var path = require('path');

module.exports = function(Templatist) {
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

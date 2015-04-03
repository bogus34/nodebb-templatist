"use strict";

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as a module.
        define('nodebb-templatist', ['nodebb-templatist/compiler', 'nodebb-templatist/renderer'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./compiler'), require('./renderer'), require('./express'));
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

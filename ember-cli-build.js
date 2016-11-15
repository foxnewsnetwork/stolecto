/*jshint node:true*/
/* global require, module */
// Stolen from https://github.com/tildeio/glimmer/blob/master/ember-cli-build.js
var path = require('path');
var existsSync = require('exists-sync');
var concat = require('broccoli-concat');
var merge = require('broccoli-merge-trees');
var typescript = require('broccoli-typescript-compiler');
var transpileES6 = require('emberjs-build/lib/utils/transpile-es6');
// var handlebarsInlinedTrees = require('./build-support/handlebars-inliner');
var stew = require('broccoli-stew');
var TSLint = require('broccoli-tslinter');
var mv = stew.mv;
var find = stew.find;
var rename = stew.rename;
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

function transpile(tree, options, label) {
  return transpileES6(tree, label, options);
}

function buildTSOptions(compilerOptions) {
  var tsOptions = {
    tsconfig: {
      compilerOptions: {
        target: "es2015",
        inlineSourceMap: true,
        inlineSources: true,
        moduleResolution: "node",

        /* needed to get typescript to emit the desired sourcemaps */
        rootDir: '.',
        mapRoot: '/'
      }
    }
  };

  Object.assign(tsOptions.tsconfig.compilerOptions, compilerOptions);

  return tsOptions;
}

function buildBabelOptions(options) {
  var externalHelpers = options.shouldExternalizeHelpers || false;
  var stripRuntimeChecks = options.stripRuntimeChecks || false;

  return {
    externalHelpers: externalHelpers,
    stripRuntimeChecks: stripRuntimeChecks,
    sourceMaps: 'inline'
  };
}

module.exports = function(_options) {
  var options = _options || {};
  var packages = __dirname + '/packages';
  var tslintConfig = __dirname + '/tslint.json';
  var bower = __dirname + '/bower_components';
  var hasBower = existsSync(bower);
  var babelOptions = buildBabelOptions(options);

  var tsOptions = buildTSOptions();

  var tsTree = find(packages, {
    include: ['**/*.ts'],
    exclude: ['**/*.d.ts']
  });

  var tsLintTree = new TSLint(tsTree, {
    configuration: tslintConfig
  });
  /* tslint:enable:no-unused-variable */
  var transpiledTSLintTree = typescript(tsLintTree, tsOptions);

  var jsTree = typescript(tsTree, tsOptions);

  var libTree = find(jsTree, {
    include: ['*/index.js', '*/lib/**/*.js']
  });

  libTree = merge([libTree]);

  var es6LibTree = mv(libTree, 'es6');

  /*
   * ES5 Named AMD Build
   */
  libTree = transpile(libTree, babelOptions, 'ES5 Lib Tree');
  var es5LibTree = mv(libTree, 'named-amd');

  /*
   * CommonJS Build
   */
  tsOptions = buildTSOptions({
    module: "commonjs",
    target: "es5"
  });

  var cjsTree = typescript(tsTree, tsOptions);
  // Test Assets

  var testHarnessTrees = [
    find(__dirname + '/tests', {
      srcDir: '/',
      files: [ 'index.html' ],
      destDir: '/tests'
    })
  ];

  if (hasBower) {
    testHarnessTrees.push(find(bower, {
      srcDir: '/qunit/qunit',
      destDir: '/tests'
    }));
  }

  var testHarness = merge(testHarnessTrees);

  var finalTrees = [
    testHarness,
    cjsTree,
    es5LibTree,
    es6LibTree
  ];

  if (hasBower) {
    var loader = find(__dirname + '/node_modules', {
      srcDir: '/loader.js/lib/loader',
      files: [ 'loader.js' ],
      destDir: '/assets'
    });

    finalTrees.push(loader);
  }

  return merge(finalTrees);
};

/*jshint node:true*/
/* global require, module */
// Stolen from https://github.com/tildeio/glimmer/blob/master/ember-cli-build.js
var path = require('path');
var existsSync = require('exists-sync');
var concat = require('broccoli-concat');
var merge = require('broccoli-merge-trees');
var typescript = require('broccoli-typescript-compiler');
var transpileES6 = require('emberjs-build/lib/utils/transpile-es6');
var stew = require('broccoli-stew');
var TSLint = require('broccoli-tslinter');
var mv = stew.mv;
var find = stew.find;
var rename = stew.rename;

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
  var libDir = __dirname + '/lib';
  var testDir = __dirname + '/tests';
  var tslintConfig = __dirname + '/tslint.json';
  var babelOptions = buildBabelOptions(options);

  var tsOptions = buildTSOptions();

  var tsTree = find(libDir, {
    include: ['**/*.ts'],
    exclude: ['**/*.d.ts']
  });

  var tsTestTree = find(testDir, {
    include: ['**/*.ts'],
    exclude: ['**/*.d.ts']
  });

  var jsTree = find(libDir, {
    include: ['**/*.js']
  });

  var jsTestTree = find(testDir, {
    include: ['**/*.js']
  })

  var tsLintTree = new TSLint(tsTree, {
    configuration: tslintConfig
  });
  /* tslint:enable:no-unused-variable */
  var transpiledTSLintTree = typescript(tsLintTree, tsOptions);

  jsTree = merge([jsTree, typescript(tsTree, tsOptions)]);
  jsTestTree = merge([jsTestTree, typescript(tsTestTree, tsOptions)]);

  var libTree = find(jsTree, {
    include: ['**/*.js']
  });

  var testTree = find(jsTestTree, {
    include: ['**/*.js']
  });

  /*
  * ES6 Build
  */
  var es6LibTree = mv(libTree, 'es6');
  var es6TestTree = mv(testTree, 'es6');

  /*
   * ES5 Named AMD Build
   */
  libTree = transpile(libTree, babelOptions, 'ES5 Lib Tree');
  testTree = transpile(testTree, babelOptions, 'ES5 Test Tree');

  testTree = merge([
    testTree,
    transpiledTSLintTree
  ]);

  var es5LibTree = mv(libTree, 'named-amd');
  var es5TestTree = mv(testTree, 'named-amd');

  /*
  * CommonJS Build
  */
  tsOptions = buildTSOptions({
    module: "commonjs",
    target: "es5"
  });

  var cjsTree = typescript(tsTree, tsOptions);
  var cjsTestTree = typescript(tsTestTree, tsOptions);

  cjsTree = mv(cjsTree, 'node_modules');
  cjsTestTree = mv(cjsTestTree, 'tests');

  var finalTrees = [
    cjsTree,
    cjsTestTree,
    es5LibTree,
    es5TestTree,
    es6LibTree,
    es6TestTree
  ];

  return merge(finalTrees);
};

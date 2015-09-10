mimosa-sass
===========

## Overview

This is a SASS compiler for the Mimosa build tool.

You can use this module for both Ruby SASS and [node-sass](https://github.com/andrew/node-sass).

For more information regarding Mimosa, see http://mimosa.io

Note: Using version `3.0+` of the node-sass compiler requires `3.0+` of this module.

## Usage

Add `'sass'` to your list of modules.  That's all!  Mimosa will install the module for you when you start `mimosa watch` or `mimosa build`.

## Functionality

This module will compile SASS files during `mimosa watch` and `mimosa build` and includes compilation with [compass](http://compass-style.org/).

For SASS compilation there are two compiling options, using Ruby SASS ([SASS Ruby gem install)](http://sass-lang.com/) or node.js SASS (via the [node-sass](https://github.com/andrew/node-sass) library).

### Ruby

Ruby is SASS' source language and the node.js version is a port of the Ruby functionality to node.js.

### node-sass

This module does not come bundled with the node.js version as it can occasionally cause installation issues, but this module is ready to use the node version if it is provided. Use the `lib` setting to provide a node-sass compiler. (Ex: `lib: require('node-sass')`). By default the Ruby version is enabled, but if `lib` is provided, node-sass will be used.

### Compass

Compass [(Ruby install)](http://compass-style.org/install/) does not have a node.js port, so to use SASS and Compass together, Ruby SASS must be used.

## Source Maps

If using node-sass, this module includes support for inline (dynamic) source maps.  Source maps will be created for your compiled sass file and included at the bottom of the compiled CSS.  This is enabled by default for `mimosa watch`.  `mimosa build` is presumed to not be a dev time task, therefore source maps are disabled.

## Default Config

```javascript
sass: {
  sourceMap: true,
  lib: undefined,
  extensions: ["sass", "scss"],
  includePaths: []
}
```

* `sourceMap`, a boolean, whether or not source maps are provided during `mimosa watch` for node-sass compilation.  If you are using Ruby sass, this setting is not used.  If you are running `mimosa build`, set setting is automatically set to `false`.
* `lib`: Using the `lib` property you can provide a node version of SASS. You must have `node-sass` `npm install`ed into your project and then provide it to `lib`. For instance: `lib: require('node-sass')`.
* `extensions`: an array of strings, the extensions of your SASS files.
* `includePaths`: an array of path strings to look for any @imported files.
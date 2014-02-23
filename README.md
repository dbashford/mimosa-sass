mimosa-sass
===========

## Overview

This is a SASS compiler for the Mimosa build tool. This module is for use with Mimosa `2.0+`.  This replicates the functionality of the SASS compiler that was built into Mimosa before `2.0`.

You can use this module for both Ruby SASS and [node-sass](https://github.com/andrew/node-sass).

For more information regarding Mimosa, see http://mimosa.io

Note: Version `1.1.0` works with Mimosa `2.0.8` and above.

## Usage

Add `'sass'` to your list of modules.  That's all!  Mimosa will install the module for you when you start `mimosa watch` or `mimosa build`.

## Functionality

This module will compile SASS files during `mimosa watch` and `mimosa build` and includes compilation with [compass](http://compass-style.org/).

For SASS compilation there are two options, using Ruby SASS ([SASS Ruby gem install)](http://sass-lang.com/) or node.js SASS (via the [node-sass](https://github.com/andrew/node-sass) library). Ruby is SASS' source language and the node.js version is a port of the Ruby functionality to node.js. This module does not come bundled with the node.js version as it can occasionally cause installation issues, but this module is ready to use the node version if it is provided. Use the `lib` setting to provide a node-sass compiler. (Ex: `lib: require('node-sass')`). By default the Ruby version is enabled.

Compass [(Ruby install)](http://compass-style.org/install/) does not have a node.js port, so to use SASS and Compass together, Ruby SASS must be used.

## Default Config

```javascript
sass: {
  lib: undefined,
  extensions: ["sass", "scss"],
  includePaths: []
}
```

* `lib`: Using the `lib` property you can provide a node version of SASS. You must have `node-sass` `npm install`ed into your project and then provide it to `lib`. For instance: `lib: require('node-sass')`.
* `extensions`: an array of strings, the extensions of your SASS files.
* `includePaths`: an array of path strings to look for any @imported files.
"use strict";

var exec = require( "child_process" ).exec;

exports.defaults = function() {
  return {
    sass: {
      sourceMap: true,
      extensions: [ "sass", "scss" ]
    }
  };
};

var _doRubySASSChecking = function ( config ) {
  config.log.debug( "Checking if Compass/SASS is available" );
  exec( "compass --version", function ( error, stdout, stderr ) {
    config.sass.hasCompass = !error;
  });

  if ( process.platform === "win32" ) {
    config.sass.runSass = "sass.bat";
  } else {
    config.sass.runSass = "sass";
  }

  exec( config.sass.runSass + " --version", function ( error, stdout, stderr ) {
    config.sass.hasSASS = !error;
  });
};

exports.validate = function( config, validators ) {
  var errors = [];

  if ( validators.ifExistsIsObject( errors, "sass config", config.sass ) ) {
    if ( validators.isArrayOfStringsMustExist( errors, "sass.extensions", config.sass.extensions ) ) {
      if (config.sass.extensions.length === 0) {
        errors.push( "sass.extensions cannot be an empty array");
      }
    }
  }

  validators.ifExistsIsBoolean( errors, "sass.sourceMap", config.sass.sourceMap );

  if ( config.isBuild ) {
    config.sass.sourceMap = false;
  }

  if ( !config.sass.lib ) {
    _doRubySASSChecking( config );
  }

  return errors;
};

"use strict";

var exec = require( "child_process" ).exec;

exports.defaults = function() {
  return {
    sass: {
      extensions: [ "sass", "scss" ]
    }
  };
};

exports.placeholder = function() {
  return "\t\n\n" +
         "  sass:                        # config settings for the SASS compiler module\n" +
         "    lib: undefined             # use this property to provide a specific version of SASS\n" +
         "    extensions: [\"sass\", \"scss\"]   # default extensions for SASS files\n" +
         "    includePaths: []           # an array of paths to include for sass compilation\n";
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

  if ( !config.sass.lib ) {
    _doRubySASSChecking( config );
  }

  return errors;
};




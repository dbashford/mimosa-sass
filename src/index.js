"use strict";

var path = require( "path" )
  , spawn = require( "child_process" ).spawn
  , logger = null
  , config = require( "./config" )
  , importRegex = /@import[\s]+['"]([^;]*)['"]/gm
  , importSplitRegex = /['"],\s*['"']/gm
  , importPathReplace = /(\w+\.|[\w-]+$)/
  , getExtensions = function ( mimosaConfig ) {
    logger = mimosaConfig.log;
    return mimosaConfig.sass.extensions;
  }
  , isInclude = function ( fileName, includeToBaseHash ) {
    return ( includeToBaseHash[fileName] || path.basename( fileName ).charAt( 0 ) === "_" );
  };

var getImportFilePath = function ( baseFile, importPath ) {
  var dir = path.dirname( baseFile );
  return [
    path.join( dir, importPath.replace( importPathReplace, "_$1" ) ),
    path.join( dir, importPath )
  ];
};

var _compileRuby = function ( mimosaConfig, file, done ) {
  var text = file.inputFileText
    , fileName = file.inputFileName
    , result = ""
    , error = null
    , includePaths = ( mimosaConfig.sass.includePaths || [] ).concat( mimosaConfig.watch.sourceDir ).concat( path.dirname( fileName ) )
    , compilerOptions = [ "--stdin", "--no-cache" ];

  includePaths.forEach( function( includePath ) {
    compilerOptions.push( "--load-path" );
    compilerOptions.push( includePath );
  });

  if ( logger.isDebug() ) {
    logger.debug( "Beginning Ruby compile of SASS file [[ " + fileName + " ]]" );
  }

  if ( mimosaConfig.sass.hasCompass ) {
    compilerOptions.push( "--compass" );
  }

  if ( /\.scss$/.test( fileName ) ) {
    compilerOptions.push( "--scss" );
  }

  var sass = spawn( mimosaConfig.sass.runSass, compilerOptions );
  sass.stdin.end( text );
  sass.stdout.on( "data", function ( buffer ) {
    result += buffer.toString();
  });
  sass.stderr.on( "data", function ( buffer ) {
    if ( !error ) {
      error = "";
    }
    error += buffer.toString();
  });

  sass.on( "exit", function ( code ) {
    if ( logger.isDebug() ) {
      logger.debug( "Finished Ruby SASS compile for file [[ " + fileName + " ]], errors? " + !!error );
    }
    done( error, result );
  });
};

var _preCompileRubySASS = function ( mimosaConfig, file, done ) {
  if ( mimosaConfig.sass.hasCompass !== undefined && mimosaConfig.sass.hasSASS !== undefined && mimosaConfig.sass.hasSASS ) {
    return _compileRuby( mimosaConfig, file, done );
  }

  if ( mimosaConfig.sass.hasSASS !== undefined && !mimosaConfig.sass.hasSASS ) {
    return done(
      "You have SASS files but do not have Ruby SASS available. Either install Ruby SASS or provide sass.lib: require('node-sass') in the mimosa-config to use node-sass.",
      "" );
  }

  var compileOnDelay = function() {
    if ( mimosaConfig.sass.hasCompass !== undefined && mimosaConfig.sass.hasSASS !== undefined ) {
      if ( mimosaConfig.sass.hasSASS ) {
        _compileRuby( mimosaConfig, file, done );
      } else {
        return done(
          "You have SASS files but do not have Ruby SASS available. Either install Ruby SASS or provide sass.lib: require('node-sass') in the mimosa-config to use node-sass.",
          "" );
      }
    } else {
      setTimeout( compileOnDelay, 100 );
    }
  };
  compileOnDelay();
};

var _compileNode = function ( mimosaConfig, file, done ) {
  if ( logger.isDebug() ) {
    logger.debug( "Beginning node compile of SASS file [[ " + file.inputFileName + " ]]" );
  }

  var finished = function ( error, text ) {
    if ( logger.isDebug() ) {
      logger.debug( "Finished node compile for file [[ " + file.inputFileName + " ]], errors? " + !!error );
    }
    done( error, text );
  };

  mimosaConfig.sass.lib.render({
    data: file.inputFileText,
    includePaths: [ mimosaConfig.watch.sourceDir, path.dirname( file.inputFileName ) ]
      .concat( mimosaConfig.sass.includePaths || [] ),
    success: function ( css ) {
      finished( null, css );
    },
    error: function ( error ) {
      finished( error, "" );
    }
  });
};

var determineBaseFiles = function ( allFiles ) {
  var baseFiles = allFiles.filter( function ( file ) {
    return ( !isInclude( file, {} ) && file.indexOf( "compass" ) < 0 );
  });

  if ( logger.isDebug() ) {
    logger.debug( "Base files for SASS are:\n" + baseFiles.join( "\n" ) );
  }

  return baseFiles;
};

var compile = function ( mimosaConfig, file, done ) {
  if ( mimosaConfig.sass.lib ) {
    _compileNode( mimosaConfig, file, done );
  } else {
    _preCompileRubySASS( mimosaConfig, file, done );
  }
};

module.exports = {
  name: "sass",
  compilerType: "css",
  importRegex: importRegex,
  importSplitRegex: importSplitRegex,
  compile: compile,
  determineBaseFiles: determineBaseFiles,
  getImportFilePath: getImportFilePath,
  isInclude: isInclude,
  extensions: getExtensions,
  defaults: config.defaults,
  placeholder: config.placeholder,
  validate: config.validate
};
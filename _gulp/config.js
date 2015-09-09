var p      = require('path');
var start  = require('./util/start');

var appDir     = './';
var appName    = 'sassqwatch';
var sourceDir  = './lib';
var distDir    = './dist';
var mainjs     = appName + '.js';

exports.concat = {
  basedir: sourceDir,
  entry: './sassqwatch.js',
  dest: appDir,
  filename: mainjs,
  alias: appName,
  uglify: {
    mangle: false
  }
};

exports.buildDist = {
  src: p.join(appDir, 'sassqwatch.js'),
  dest: appDir
}

exports.watch = {
  base: sourceDir,
  match: [
    {
      when: '**/*.js',
      then: start('build-dist')
    }
  ]
};

exports.eta = {
  scaffold: {
    assets: {
      styles: ''
    }
  },
  globs: {
    scripts: '**/*.+(js|ejs|jsx)'
  },
  browserify: {
    transform: ['reactify', 'browserify-shim']
  },
  browserSync: {
    settings: {
      files: [
        './**/*.html'
      ]
    }
  },
  sprites: {
    destSass: './_src/sass/',
    settings: {
      style: '_components.sprites.scss',
      cssPath: 'images/sprites/',
      margin: 5
    }
  },
  symbols: {
    destSass: './_src/sass/',
    fontPath: 'fonts/symbols/',
    renameSass: {
      basename: '_components.symbols',
      extname: '.scss'
    }
  }
}
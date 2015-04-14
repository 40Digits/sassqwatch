// Paths
var distDir = './dist',
  sourceDir = './lib',
  appDir    = './';

// Gulp options/settings for tasks.
module.exports = {
  browserify: {
    debug: false,
    src: sourceDir,
    bundleConfigs: [{
      entries: [],
      ignore: ['jquery'],
      noParse: ['jquery'],
      basedir: appDir,
      dest: appDir,
      outputName: 'sassqwatch',
      outputFile: 'sassqwatch.js',
      sourceJS: sourceDir + '/sassqwatch.js'
    }]
  },
  watch: {
    src: sourceDir,
    dest: appDir
  },
  production: {
    jsSrc: appDir + 'sassqwatch.js',
    jsSrcMin: appDir + 'sassqwatch.min.js',
    jsDest: appDir
  }
};

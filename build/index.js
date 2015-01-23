(function() {

  var exclude = [];
  var build = '../linoleum-tmp.js';

  return {
    baseUrl: '../js',
    paths: {
      'emoney': 'includes/emoney-0.2.3.min',
      'asap': 'includes/asap',
      'amd-loader': '../build/vendor/amd-loader'
    },
    include: [ 'amd-loader' , 'emoney' , 'linoleum' ],
    exclude: exclude,
    out: build,
    wrap: {
      startFile: 'wrap.start.js',
      endFile: 'wrap.end.js'
    },
    optimize: 'none'
  };

}())
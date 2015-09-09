module.exports = [
  {
    method: 'min',
    scale: true,
    explanationString: 'above',
    js: 'sassqwatch.min(\'{target}\', callback);'
  },
  {
    method: 'max',
    scale: true,
    explanationString: 'below',
    js: 'sassqwatch.max(\'{target}\', callback);'
  },
  {
    method: 'only',
    scale: true,
    explanationString: '',
    js: 'sassqwatch.only(\'{target}\', callback);'
  },
  {
    method: 'responsiveImages',
    scale: false,
    initial: '/assets/images/480x270.jpg',
    images: {
      'tiny': '/assets/images/480x270.jpg',
      'tiny-2x': '/assets/images/480x270-retina.jpg',
      'small': '/assets/images/800x450.jpg',
      'small-2x': '/assets/images/800x450-retina.jpg',
      'large': '/assets/images/1024x575.jpg',
      'large-2x': '/assets/images/1024x575-retina.jpg',
    },
    js: 'sassqwatch.responsiveImages();',
    html: '<img\n' +
      '  data-tiny="/assets/images/480x270.jpg"\n' + 
      '  data-tiny-2x="/assets/images/480x270-retina.jpg"\n' + 
      '  data-small="/assets/images/800x450.jpg"\n' + 
      '  data-small-2x="/assets/images/800x450-retina.jpg"\n' + 
      '  data-large="/assets/images/1024x575.jpg"\n' + 
      '  data-large-2x="/assets/images/1024x575-retina.jpg" />'
  }
];
module.exports = function($el) {
  if ($el.hasAttributes()) {
    var i = 0,
      data = {},
      mqName = '',
      attr;
    
    for(i; i < $el.attributes.length; i++) {
      attr = $el.attributes[i];
      
      if (attr.name.indexOf('data-') != -1) {
        mqName = attr.name.slice(5);
        data[mqName] = attr.value;
      }
    }
    
    return data;
  }
}
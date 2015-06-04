// Media query scale - for a visual representation of what's happening with SassQwatch
(function(global) {
  global.Scale = (function() {
    var sassqwatch = require('sassqwatch'),
        lastMQ     = 'mq-xxlarge',
        lastIndex  = sassqwatch.fetchMqIndex(lastMQ),
        current    = sassqwatch.fetchMediaQuery(),
        $scale     = document.getElementById('breakpoint-scale'),
        html       = '',
        i          = 0,
        $points,
        $activePoint;

    var updateActive = function(mq) {
      var index = sassqwatch.fetchMqIndex(mq);

      if ($activePoint) {
        $activePoint.classList.remove('is-active');
      }
      $activePoint = $points[index];
      $activePoint.classList.add('is-active');
    };

    var resetAffected = function() {
      var i = 0;
      
      for(i; i <= lastIndex; i++) {
        if ($points[i].classList.contains('is-affected')) {
          $points[i].classList.remove('is-affected');
        }
      }
    };

    var updateAffected = function(targetMQ) {
      var index = sassqwatch.fetchMqIndex(targetMQ);

      if (!$points[index].classList.contains('is-affected')) {
        resetAffected();
        $points[index].classList.add('is-affected');
      }
    };

    var updateAffectedMin = function(targetMQ) {
      var index = sassqwatch.fetchMqIndex(targetMQ),
          i = index;

      if (!$points[index + 1].classList.contains('is-affected')) {
        resetAffected();
        for(i; i <= lastIndex; i++) {
          $points[i].classList.add('is-affected');
        }
      }
    };

    var updateAffectedMax = function(targetMQ) {
      var index = sassqwatch.fetchMqIndex(targetMQ),
          i = index - 1;

      if (!$points[index - 1].classList.contains('is-affected')) {
        resetAffected();
        for(i; i >= 0; i--) {
          $points[i].classList.add('is-affected');
        }
      }
    };

    for(i; i<=lastIndex; i++) {
      html = html + '<div class="scale__point"><div class="scale__label">' + sassqwatch.fetchMqName(i) + '</div></div>';
    }

    $scale.innerHTML = html;
    $points = document.getElementsByClassName('scale__point');

    updateActive(current);
    sassqwatch.onChange(updateActive);

    return {
      updateAffected:    updateAffected,
      updateAffectedMin: updateAffectedMin,
      updateAffectedMax: updateAffectedMax,
      resetAffected:     resetAffected
    };
  })();
})(window);
var jq_throttle;

exports.throttle = jq_throttle = function( delay, no_trailing, callback, debounce_mode ) {
  // After wrapper has stopped being called, this timeout ensures that
  // `callback` is executed at the proper times in `throttle` and `end`
  // debounce modes.
  var timeout_id,
    
    // Keep track of the last time `callback` was executed.
    last_exec = 0;
  
  // `no_trailing` defaults to falsy.
  if ( typeof no_trailing !== 'boolean' ) {
    debounce_mode = callback;
    callback = no_trailing;
    no_trailing = undefined;
  }
  
  // The `wrapper` function encapsulates all of the throttling / debouncing
  // functionality and when executed will limit the rate at which `callback`
  // is executed.
  function wrapper() {
    var that = this,
      elapsed = +new Date() - last_exec,
      args = arguments;
    
    // Execute `callback` and update the `last_exec` timestamp.
    function exec() {
      last_exec = +new Date();
      callback.apply( that, args );
    };
    
    // If `debounce_mode` is true (at_begin) this is used to clear the flag
    // to allow future `callback` executions.
    function clear() {
      timeout_id = undefined;
    };
    
    if ( debounce_mode && !timeout_id ) {
      // Since `wrapper` is being called for the first time and
      // `debounce_mode` is true (at_begin), execute `callback`.
      exec();
    }
    
    // Clear any existing timeout.
    timeout_id && clearTimeout( timeout_id );
    
    if ( debounce_mode === undefined && elapsed > delay ) {
      // In throttle mode, if `delay` time has been exceeded, execute
      // `callback`.
      exec();
      
    } else if ( no_trailing !== true ) {
      // In trailing throttle mode, since `delay` time has not been
      // exceeded, schedule `callback` to execute `delay` ms after most
      // recent execution.
      // 
      // If `debounce_mode` is true (at_begin), schedule `clear` to execute
      // after `delay` ms.
      // 
      // If `debounce_mode` is false (at end), schedule `callback` to
      // execute after `delay` ms.
      timeout_id = setTimeout( debounce_mode ? clear : exec, debounce_mode === undefined ? delay - elapsed : delay );
    }
  };
  
  // Return the wrapper function.
  return wrapper;
};

exports.debounce = function( delay, at_begin, callback ) {
  return callback === undefined
    ? jq_throttle( delay, at_begin, false )
    : jq_throttle( delay, callback, at_begin !== false );
};
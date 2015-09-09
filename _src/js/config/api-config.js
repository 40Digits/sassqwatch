module.exports = [
  {
    title: "properties",
    items: [
      {
        title: ".breakpoints",
        description: "An array of the names of the breakpoints in order.",
        example: "console.log(sassqwatch.breakpoints);\n" + 
        "// ['mq-mini', 'mq-small', 'mq-medium', 'mq-large', 'mq-xlarge']'"
      },
      {
        title: ".current",
        description: "The name of the current breakpoint.",
        example: "console.log(sassqwatch.current);\n" + 
        "// mq-xlarge"
      }
    ]
  },
  {
    title: "methods",
    items: [
      {
        title: ".onChange( callback )",
        chainable: true,
        params: [
          {
            title: "callback (function)",
            description: "the callback function to call when the breakpoint changes"
          }
        ],
        description: "Fires a callback on every breakpoint change. The callback is provided the name of the new breakpoint and the name of the previous breakpoint.",
        example: "sassqwatch.onChange(function (newBreakpoint, oldBreakpoint) {\n" + 
          "  console.log('breakpoint switched to ' + newBreakpoint + ' from ' + oldBreakpoint);\n" + 
          "});"
      },
      {
        title: ".min( breakpoint, callback, fireOnce )",
        chainable: true,
        params: [
          {
            title: "breakpoint (string)",
            description: "the name of the breakpoint to check against"
          },
          {
            title: "callback (function)",
            description: "the callback function to call"
          },
          {
            title: "fireOnce (boolean)",
            description: "causes the callback to only be fired the first time the condition is met. If set to false the callback will be fired on every breakpoint change where the condition is met. (Default: true)"
          },
        ],
        description: "A convenience method that functions similarly to a `min-width` breakpoint in CSS. The callback is fired on the specified breakpoint as well as any breakpoint that is above it. The callback is provided the name of the new breakpoint and the name of the previous breakpoint.",
        example: "sassqwatch.min('mq-medium', function (newBreakpoint, oldBreakpoint) {\n" + 
          "  console.log('now min mq-medium');\n" + 
          "});"
      },
      {
        title: ".max( breakpoint, callback, fireOnce )",
        chainable: true,
        params: [
          {
            title: "breakpoint (string)",
            description: "the name of the breakpoint to check against"
          },
          {
            title: "callback (function)",
            description: "the callback function to call"
          },
          {
            title: "fireOnce (boolean)",
            description: "causes the callback to only be fired the first time the condition is met. If set to false the callback will be fired on every breakpoint change where the condition is met. (Default: true)"
          },
        ],
        description: "A convenience method that functions similarly to a `max-width` breakpoint in CSS. The callback is fired on any breakpoint that is below it and is not inclusive. The callback is provided the name of the new breakpoint and the name of the previous breakpoint.",
        example: "sassqwatch.max('mq-medium', function (newBreakpoint, oldBreakpoint) {\n" + 
          "  console.log('now max mq-medium');\n" + 
          "}, false);"
      },
      {
        title: ".only( breakpoint, callback )",
        chainable: true,
        params: [
          {
            title: "breakpoint (string)",
            description: "the name of the breakpoint to check against"
          },
          {
            title: "callback (function)",
            description: "the callback function to call"
          }
        ],
        description: "A convenience method that fires a callback only on a specified breakpoint. The callback is provided the name of the previous breakpoint.",
        example: "sassqwatch.only('mq-medium', function (oldBreakpoint) {\n" + 
          "  console.log('now on mq-medium');\n" + 
          "});"
      },
      {
        title: ".query( type, breakpoint, callback, fireOnce )",
        chainable: true,
        params: [
          {
            title: "type (string)",
            description: "\"min\", \"max\", or \"only\""
          },
          {
            title: "breakpoint (string)",
            description: "the name of the breakpoint to check against"
          },
          {
            title: "callback (function)",
            description: "the callback function to call"
          },
          {
            title: "fireOnce (boolean)",
            description: "causes the callback to only be fired the first time the condition is met. If set to false the callback will be fired on every breakpoint change where the condition is met. Only applies to 'min' and 'max' types. (Default: true)"
          }
        ],
        description: "Fires a callback when the current breakpoint is min, max, or only the specified breakpoint. If checking for \"min\" or \"max\" then the callback receives the name of the new breakpoint. If checking for \"only\" the callback receives the name of the old breakpoint.",
        example: "sassqwatch\n" + 
          "  .query('min', 'mq-medium', function (newBreakpoint, oldBreakpoint) {\n" + 
          "    console.log('now min mq-medium');\n" + 
          "  })\n" + 
          "  .query('only', 'mq-xxlarge', function (oldBreakpoint) {\n" + 
          "    console.log('now on mq-xxlarge');\n" + 
          "  });"
      },
      {
        title: ".isBelow( breakpoint, inclusive )",
        chainable: false,
        params: [
          {
            title: "breakpoint (string)",
            description: "the breakpoint to check against"
          },
          {
            title: "inclusive (boolean)",
            description: "whether or not to include the breakpoint in the check; <= instead of <. (Default: false)"
          }
        ],
        description: "Returns `true` if the current breakpoint is below a specified breakpoint, and `false` otherwise.",
        example: "if ( sassqwatch.isBelow('mq-large') ) {\n" + 
          "  console.log('breakpoint is below mq-large.');\n" + 
          "}"
      },
      {
        title: ".isAbove( breakpoint, inclusive )",
        chainable: false,
        params: [
          {
            title: "breakpoint (string)",
            description: "the breakpoint to check against"
          },
          {
            title: "inclusive (boolean)",
            description: "whether or not to include the breakpoint in the check; >= instead of >. (Default: true)"
          }
        ],
        description: "Returns `true` if the current breakpoint is above a specified breakpoint, and `false` otherwise.",
        example: "if ( sassqwatch.isAbove('mq-large') ) {\n" + 
        "  console.log('breakpoint is above mq-large.');\n" + 
        "}"
      },
      {
        title: ".matches( breakpoint )",
        chainable: false,
        params: [
          {
            title: "breakpoint (string)",
            description: "the breakpoint to check against"
          }
        ],
        description: "Returns `true` if the current media query matches a specified media query, and `false` otherwise.",
        example: "if ( sassqwatch.matches('mq-large') ) {\n" + 
          "  console.log('breakpoint is mq-large.');\n" + 
          "}"
      }
    ]
  }
];
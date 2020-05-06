// Avoid `console` errors in browsers that lack a console with this handy polyfill
~function()
{
    var method,
        noop    = function noop() {},
        console = (window.console = window.console || {}),
        methods =
        [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ],

        length  = methods.length;

    while(length--)
    {
        method = methods[length];

        // Only stub undefined methods
        if(!console[method])
            console[method] = noop;
    }
}();

// Any other bootstrapping goes here

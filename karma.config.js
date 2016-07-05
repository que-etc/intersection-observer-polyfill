var webpack = require('karma-webpack');

module.exports = function (config) {
    config.set({
        singleRun: true,
        frameworks: ['jasmine'],
        files: [
            'tests/**/*.spec.js'
        ],
        plugins: [
            webpack,
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-ie-launcher',
            'karma-spec-reporter'
        ],
        reporters: ['spec'],
        browsers: [
            'Chrome',
            'Firefox',
            'IE',
            'IE10',
            'IE9'
        ],
        customLaunchers: {
            IE10: {
                base: 'IE',
                'x-ua-compatible': 'IE=EmulateIE10'
            },
            IE9: {
                base: 'IE',
                'x-ua-compatible': 'IE=EmulateIE9'
            }
        },
        preprocessors: {
            'tests/**/*.spec.js': ['webpack'],
            'src/**/*.js': ['webpack']
        },
        webpack: require('./dev/builds').general,
        webpackMiddleware: { noInfo: true }
    });
};

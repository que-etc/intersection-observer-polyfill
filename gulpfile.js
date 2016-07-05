const gulp = require('gulp');
const webpack = require('webpack');
const gutil = require('gulp-util');
const builds = require('./dev/builds');
const Server = require('karma').Server;

function createWebpackCallback(callback) {
    return (err, stats) => {
        if (err) {
            throw new gutil.PluginError("webpack", err);
        }

        gutil.log("[webpack]", stats.toString());

        callback();
    };
}

gulp.task('build:production', ['build:production:global'], callback => {
    webpack(builds.production, createWebpackCallback(callback));
});

gulp.task('build:production:global', callback => {
    webpack(builds.prodGlobal, createWebpackCallback(callback));
});

gulp.task('test', callback => {
    new Server({
        configFile: __dirname + '/karma.config.js'
    }, callback).start();
});

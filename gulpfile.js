const gulp = require('gulp');
const webpack = require('webpack');
const gutil = require('gulp-util');

gulp.task('build', callback => {
    webpack({
        resolve: {
            extensions: ['', '.js']
        },
        entry: './app.js',
        output: {
            path: './dist/',
            filename: 'app.build.js'
        },
        module: {
            loaders: [{
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015-loose', 'stage-1'],
                    plugins: ['add-module-exports', 'transform-es2015-modules-commonjs']
                }
            }]
        }
    }, (err, stats) => {
        if (err) {
            throw new gutil.PluginError("webpack", err);
        }

        gutil.log("[webpack]", stats.toString());

        callback();
    });
});

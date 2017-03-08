'use strict';
// 模块引入
let gulp = require('gulp');
let webpack = require('webpack');
let gutil = require('gulp-util');
// 配置
let webpackConf = require('./webpack.config');
let src = process.cwd() + '/src';
let dist = process.cwd() + '/dist';

// js check
gulp.task('hint', () => {
    let jshint = require('gulp-jshint');
    let stylish = require('jshint-stylish');

    return gulp.src([
            '!' + src + '/js/components/**/*.js',
            src + '/js/**/*.js'
        ])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

// clean dist
gulp.task('clean', ['hint'], () => {
    let clean = require('gulp-clean');

    return gulp.src(dist, {read: true}).pipe(clean());
});

// run webpack pack
gulp.task('pack', ['clean'], (done) => {
    webpack(webpackConf, (err, stats) => {
        if(err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString({colors: true}));
        done();
    })
});

// watch task
// gulp.task('watch', function () {
//     gulp.watch('src/**/*.*', function () {
//         let clean = require('gulp-clean');
//         gulp.src(dist, {read: true}).pipe(clean());
//         webpack(webpackConf, (err, stats) => {
//             if(err) throw new gutil.PluginError('webpack', err);
//             gutil.log('[webpack]', stats.toString({colors: true}));
//         })
//     })
// });

// html process
gulp.task('default', ['pack']);

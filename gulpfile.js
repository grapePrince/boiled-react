let gulp = require('gulp');
let gutil = require('gulp-util');
let less = require('gulp-less');
let cleanCSS = require('gulp-clean-css'); // minify css
let webpack = require('webpack');
let webpackConfig = require('./webpack.config.js');
let path = require('path');
let nodemon = require('gulp-nodemon');

const DIR = {
    SRC: 'src',
    DEST: 'dist'
};

const SRC = {
    JS: DIR.SRC + '/js/**/*.js',
    CSS: DIR.SRC + '/less/**/*.less',
    HTML: DIR.SRC + '/*.html'
};

const DEST = {
    JS: DIR.DEST + '/js',
    CSS: DIR.DEST + '/css',
    HTML: DIR.DEST + '/'
};

gulp.task("webpack", function(callback) {
    // run webpack
    webpack(webpackConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
});

gulp.task('static', function() {
  gulp.src(SRC.HTML)
  .pipe(gulp.dest(DEST.HTML));
});

gulp.task('less', function() {
  gulp.src(SRC.CSS)
    .pipe(less())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(DEST.CSS));
});

gulp.task('watch', ['webpack', 'static', 'less'], () => {
    let watcher = {
        js: gulp.watch(SRC.JS, ['webpack']),
        css: gulp.watch(SRC.CSS, ['less']),
        html: gulp.watch(SRC.HTML, ['static'])
    };
    let notify = (event) => {
        gutil.log('File', gutil.colors.yellow(event.path), 'was', gutil.colors.magenta(event.type));
    };
    for(let key in watcher) {
        watcher[key].on('change', notify);
    }
});

gulp.task('build', ['watch'], function() {
  nodemon({
    script: 'devServer.js'
  })
});

// gulp deploy (with minify and gzip)
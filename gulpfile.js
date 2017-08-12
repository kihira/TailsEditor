const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const webserver = require('gulp-webserver');
const uglify = require('gulp-uglify');
const gutil = require("gulp-util");
const browserify = require('browserify');
const watchify = require('watchify');
const tsify = require('tsify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const b = browserify({
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    plugin: [watchify],
    cache: {},
    packageCache: {}
}).plugin(tsify, {
    noImplicitAny: true,
    target: "es6",
    lib: [ "es2015", "dom"]
})
.transform('babelify', {
    presets: ['es2015'],
    extensions: ['.ts']
})
.on('update', bundle)
.on('log', gutil.log);

function error(err) {
    gutil.log(gutil.colors.red('[Error]'), err.toString());
    this.emit('end');
}

function bundle() {
    return b
        .bundle()
        .on('error', error)
        .pipe(source('bundle.js'))
        .on('error', error)
        .pipe(buffer())
        .on('error', error)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .on('error', error)
        .pipe(sourcemaps.write('./'))
        .on('error', error)
        .pipe(gulp.dest('dist'))
}

gulp.task('copy-assets', () => {
    return gulp.src(['src/**/*.html', 'src/**/*.png'])
        .pipe(gulp.dest('dist'))
});

gulp.task('webserver', () => {
    gulp.src('dist')
        .pipe(webserver({
            livereload: true,
            path: '/'
        }))
        .on('error', error)
});

gulp.task('default', ['copy-assets', 'webserver'], bundle);
var gulp = require('gulp');

//For cleaning out the build dir
var clean = require('gulp-clean');

//For processing react and other files into minimized files
var rename = require('gulp-rename');

var react = require('gulp-react');

var gutil = require("gulp-util");
var fs = require("fs");

var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");
var subtree = require('gulp-subtree');

gulp.task('deploy_site', function () {
    return gulp.src('doc/site/dist')
        .pipe(subtree());
});

function genJSTask(taskName,destDir,jsxFiles) {
    gulp.task(taskName, function() {

        gutil.log(taskName + ": transforming jsx to build");

        // Take every JS file in jsxFiles pattern
        return gulp.src(jsxFiles)
            // Turn their React JSX syntax into regular javascript
            .pipe(react())
            // Output each one of those --> ./build/js/ directory
            .pipe(gulp.dest(destDir))
    });
}

genJSTask('doc_js_public','build/docstage/public','public/js/**/*.js')
genJSTask('doc_js_lib','build/docstage/lib','lib/**/*.js')
genJSTask('doc_js_top','build/docstage/','./*.js')

// generate .js files via JSX for doc generation
gulp.task('doc_js', ['doc_js_public','doc_js_lib','doc_js_top'], function() {})

// Delete everything inside the build directory
gulp.task('clean', function() {
  return gulp.src(['build/*'], {read: false}).pipe(clean());
});

// build manifest by copying it
// TODO: use macros and inject version number to avoid duplication!
gulp.task('build_manifest', function() {
    gutil.log("copy src/manifest.json to build");

    return gulp.src('src/manifest.json')
        .pipe(gulp.dest('build'));
});

gulp.task('build_css', function() {
    gutil.log("copy css to build");

    return gulp.src('src/css/*')
        .pipe(gulp.dest('build/css'));
});

gulp.task('build_html', ['build_css'], function() {
    gutil.log("copy html and css to build");

    return gulp.src('src/html/*')
        .pipe(gulp.dest('build'));
});

gulp.task('build_images', function() {
    gutil.log("copy images to build");

    return gulp.src(['src/images/*','src/assets/*.png'])
        .pipe(gulp.dest('build/images'));
});

gulp.task('build_testData', function() {
    gutil.log("copy test data to build");

    return gulp.src('test/*.json')
        .pipe(gulp.dest('build/testData'));
});

// Copy all jquery files to dist:
gulp.task('build_jquery', function() {
    gutil.log("copy jquery/dist from node_modules to build");

    return gulp.src('node_modules/jquery/dist/**/*')
        .pipe(gulp.dest('build/js'));
});

// Copy all bootstrap files from node_modules/bootstrap/dist:
gulp.task('build_bootstrap',['build_jquery'],function() {
    gutil.log("copy bootstrap/dist from node_modules to build");

    return gulp.src('node_modules/bootstrap/dist/**/*')
        .pipe(gulp.dest('build'));
});

// Copy font-awesome css to build/css:
gulp.task('build_fa', function() {
    gutil.log("copy font-awesome from node_modules to build");

    return gulp.src(['node_modules/font-awesome/css/*','node_modules/font-awesome/fonts/*'],
                    {base: 'node_modules/font-awesome/' })
        .pipe(gulp.dest('build'));
});


gulp.task('build_assets',['build_jquery','build_bootstrap','build_fa','build_html','build_images','build_testData']);

// Build and watch cycle (another option for development)
// Advantage: No server required, can run app from filesystem
// Disadvantage: Requests are not blocked until bundle is available,
//               can serve an old app on refresh
gulp.task("build-dev", ["webpack:build-dev"], function() {
    gulp.watch(["public/**/*","./*"], ["webpack:build-dev"]);
});


gulp.task("webpack:build", function(callback) {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);
    if (myConfig.plugins) {
        myConfig.plugins = myConfig.plugins.concat(
            new webpack.DefinePlugin({
                "process.env": {
                    // This has effect on the react lib size
                    "NODE_ENV": JSON.stringify("production")
                }
            }),
            new webpack.optimize.UglifyJsPlugin()
        );
    }

    // run webpack
    webpack(myConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build", err);
        gutil.log("[webpack:build]", stats.toString({
            colors: true
        }));
        callback();
    });
});

// Production build
gulp.task("build_js", ["webpack:build"]);

// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = "sourcemap";

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);

gulp.task("webpack:build-dev", function(callback) {
    // run webpack
    devCompiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build-dev", err);
        gutil.log("[webpack:build-dev]", stats.toString({
            colors: true
        }));
        callback();
    });
});


gulp.task("default", ["build_assets", "build_manifest", "build_js"] );

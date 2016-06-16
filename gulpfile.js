"use strict";
var amdOptimize = require("amd-optimize");
var concat = require("gulp-concat");
var gulp = require("gulp");
var mergeStream = require("merge-stream");
var removeFiles = require("gulp-remove-files");
var sass = require("gulp-sass");


gulp.task("clean", function() {
    return gulp.src(["out/**/*"])
        .pipe(removeFiles());
});

gulp.task("compileCss", function () {
    var srcPath = "src/styles/**/";
    var outPath = "out/styles/";
    return gulp.src([srcPath + "*.css", srcPath +"*.scss"])
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest(outPath));
});

gulp.task("compileHtml", function() {
    var srcPath = "src/**/*.html";
    var outPath = "out/";
    return gulp.src(srcPath)
        .pipe(gulp.dest("out/"))
});

gulp.task("compileJs", function() {
    var srcPath = "src/scripts/";
    var outPath = "out/scripts/";

    var amdOptions = {
        configFile: srcPath + "requireConfig.js",
        baseUrl: srcPath + "/module/",
        wrapShim: true
    };

    var admin = gulp.src(srcPath + "**/*.js")
        .pipe(amdOptimize("admin", amdOptions))
        .pipe(concat("admin.js"))
        .pipe(gulp.dest(outPath));
    
    var index = gulp.src(srcPath + "**/*.js")
        .pipe(amdOptimize("index", amdOptions))
        .pipe(concat("index.js"))
        .pipe(gulp.dest(outPath));

    var requireConfig = gulp.src(srcPath + "requireConfig.js")
        .pipe(gulp.dest(outPath));

    var libs = gulp.src(srcPath + "lib/require-v2.2.0/require.min.js")
        .pipe(gulp.dest(outPath + "lib/require-v2.2.0/"));
    return mergeStream(admin, index, libs);
});

gulp.task("compilePhp", function() {
    var srcPath = "src/backend/**/*.php";
    var outPath = "out/backend/";
    return gulp.src(srcPath)
        .pipe(gulp.dest(outPath));
});

gulp.task("compileRes", function() {
    var audio = gulp.src("src/audio/**/*")
        .pipe(gulp.dest("out/audio/"));
    var images = gulp.src("src/images/**/*")
        .pipe(gulp.dest("out/images/"));
    return mergeStream(audio, images);
});

gulp.task("compile", [
    "compileCss",
    "compileHtml",
    "compileJs",
    "compilePhp",
    "compileRes"
]);

gulp.task("default", [
    "clean",
    "compile"
]);

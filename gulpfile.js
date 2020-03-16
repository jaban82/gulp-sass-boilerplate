const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const spritesmith = require("gulp.spritesmith");
const buffer = require("vinyl-buffer");
const imagemin = require("gulp-imagemin");
const browsersync = require("browser-sync");

gulp.task("sass", function() {
  return gulp
    .src("scss/**/*.scss")
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest("css/"))
    .pipe(browsersync.stream({ match: "**/*.css" }));
});

gulp.task("sprite", function() {
  const spriteData = gulp.src("sprites/*.png").pipe(
    spritesmith({
      imgName: "sprite.png",
      cssName: "_sprite.scss",
      imgPath: "../css/sprite.png"
    })
  );

  const imgStream = new Promise(function(resolve) {
    spriteData.img
      .pipe(buffer())
      .pipe(imagemin())
      .pipe(gulp.dest("img/"))
      .on("end", resolve);
  });

  const cssStream = new Promise(function(resolve) {
    spriteData.css.pipe(gulp.dest("scss/common")).on("end", resolve);
  });

  return Promise.all([imgStream, cssStream]);
});

gulp.task("browser-sync", function() {
  browsersync.init({
    server: {
      baseDir: "./"
    }
  });
});

gulp.task("watch", ["browser-sync"], function() {
  gulp.watch("scss/**/*.scss", ["sass"]);
  gulp.watch("*.html").on("change", browsersync.reload);
});

gulp.task("default", ["watch"]);

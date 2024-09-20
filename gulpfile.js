const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const pug = require("gulp-pug");
const webp = require("gulp-webp");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const notify = require("gulp-notify");
const browserSync = require("browser-sync").create();

gulp.task("sass", () => {
  return gulp
    .src("./src/sass/main-*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer("last 2 versions"))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("./dist/css/"))
    .pipe(browserSync.stream());
});

// Deflate macks main html en and sub html is ar

// mainLang var is for switching languages button
// Deflate her set lang button target to ar lang

gulp.task("pugToHtmlEnglish", () => {
  return gulp
    .src("./src/pug/*.pug")
    .pipe(
      pug({
        pretty: true,
        locals: { lang: "en", direction: "ltr", mainLang: "" }
      }).on("error", notify.onError("Error: <%= error.message %>"))
    )
    .pipe(gulp.dest("./dist/"))
    .pipe(browserSync.stream());
});

gulp.task("pugToHtmlArabic", () => {
  return gulp
    .src("./src/pug/*.pug")
    .pipe(
      pug({
        pretty: true,
        locals: { lang: "ar", direction: "rtl", mainLang: "en" }
      })
    )
    .pipe(
      rename(function (path) {
        path.basename += "-ar";
      })
    )
    .pipe(gulp.dest("./dist/"))
    .pipe(browserSync.stream());
});

gulp.task("fonts", () => {
  return gulp.src("./src/fonts/**/*").pipe(gulp.dest("./dist/fonts/"));
});

gulp.task("javaScript", () => {
  return gulp.src("./src/js/**/*").pipe(gulp.dest("./dist/js/"));
});

gulp.task("cssVendor", () => {
  return gulp.src("./src/cssVendor/*").pipe(gulp.dest("./dist/css/vendor/"));
});

gulp.task("imgSquash", () => {
  return gulp
    .src("./src/images/**/*")
    .pipe(webp({ lossless: true }))
    .pipe(gulp.dest("./dist/images"));
});

gulp.task("serve", () => {
  gulp.watch("./src/sass/**/*.scss", gulp.series("sass"));
  gulp.watch("./src/pug/**/*.pug", gulp.series("pugToHtmlEnglish"));
  gulp.watch("./src/pug/**/*.pug", gulp.series("pugToHtmlArabic"));
  gulp.watch("./src/images/**/*", gulp.series("imgSquash"));
  gulp.watch("./src/js/**/*", gulp.series("javaScript"));
  gulp.watch("./src/cssVendor/*", gulp.series("cssVendor"));
  gulp.watch("./dist/*.html").on("change", browserSync.reload);
  browserSync.init({
    server: "./dist/"
  });
});

gulp.task(
  "default",
  gulp.series(
    "sass",
    "pugToHtmlEnglish",
    "pugToHtmlArabic",
    "imgSquash",
    "fonts",
    "javaScript",
    "cssVendor",
    "serve"
  )
);

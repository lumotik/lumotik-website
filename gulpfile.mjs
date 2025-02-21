import gulp from "gulp";
import * as sassCompiler from "sass"; // Updated import
import gulpSass from "gulp-sass";
import pug from "gulp-pug";
import webp from "gulp-webp";
import autoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
import rename from "gulp-rename";
import browserSync from "browser-sync";
import mergeJson from "gulp-merge-json";
import { deleteAsync as del } from "del"; // Use named import for del
import fs from "fs";
import path from "path";
import changed from "gulp-changed"; // Use gulp-changed

const sass = gulpSass(sassCompiler);
const { create } = browserSync;

// Delete old data.json files
gulp.task("clean-json", async () => {
  await del(["./src/data/en/data.json", "./src/data/ar/data.json"]);
});

// Combine JSON files into data.json
gulp.task(
  "combine-json",
  gulp.series("clean-json", () => {
    // Combine English JSON files
    gulp
      .src("./src/data/en/*.json")
      .pipe(
        mergeJson({
          fileName: "data.json",
          edit: (json, file) => {
            const fileName = path.basename(file.path, ".json");
            return json; // Return JSON content directly
          },
        })
      )
      .pipe(gulp.dest("./src/data/en"));

    // Combine Arabic JSON files
    return gulp
      .src("./src/data/ar/*.json")
      .pipe(
        mergeJson({
          fileName: "data.json",
          edit: (json, file) => {
            const fileName = path.basename(file.path, ".json");
            return json; // Return JSON content directly
          },
        })
      )
      .pipe(gulp.dest("./src/data/ar"));
  })
);

// Helper function to read JSON data
const getJsonData = (lang) => {
  const dataPath = path.join(process.cwd(), "src", "data", lang, "data.json");
  if (!fs.existsSync(dataPath)) {
    throw new Error(`File not found: ${dataPath}`);
  }
  return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
};

// Compile Pug to HTML for English
gulp.task("pugToHtmlEnglish", () => {
  const jsonData = getJsonData("en");
  return gulp
    .src("./src/pug/*.pug")
    .pipe(changed("./dist")) // Only process changed files
    .pipe(
      pug({
        pretty: true,
        locals: {
          lang: "en",
          direction: "ltr",
          data: jsonData,
        },
      })
    )
    .pipe(gulp.dest("./dist/"));
});

// Compile Pug to HTML for Arabic
gulp.task("pugToHtmlArabic", () => {
  const jsonData = getJsonData("ar");
  return gulp
    .src("./src/pug/*.pug")
    .pipe(changed("./dist")) // Only process changed files
    .pipe(
      pug({
        pretty: true,
        locals: {
          lang: "ar",
          direction: "rtl",
          data: jsonData,
        },
      })
    )
    .pipe(
      rename(function (path) {
        path.basename += "-ar"; // Append "-ar" to Arabic files
      })
    )
    .pipe(gulp.dest("./dist/"));
});

// Compile SCSS to CSS
gulp.task("sass", () => {
  return gulp
    .src("./src/sass/main-*.scss")
    .pipe(changed("./dist/css")) // Only process changed files
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer("last 2 versions"))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("./dist/css/"))
    .pipe(create().stream());
});

// Copy fonts to dist
gulp.task("fonts", () => {
  return gulp
    .src("./src/fonts/**/*")
    .pipe(changed("./dist/fonts")) // Only process changed files
    .pipe(gulp.dest("./dist/fonts/"));
});

// Copy JavaScript to dist
gulp.task("javaScript", () => {
  return gulp
    .src("./src/js/**/*")
    .pipe(changed("./dist/js")) // Only process changed files
    .pipe(gulp.dest("./dist/js/"));
});

// Copy vendor CSS to dist
gulp.task("cssVendor", () => {
  return gulp
    .src("./src/cssVendor/*")
    .pipe(changed("./dist/css/vendor")) // Only process changed files
    .pipe(gulp.dest("./dist/css/vendor/"));
});

// Convert images to WebP
gulp.task("imgSquash", () => {
  return gulp
    .src("./src/images/**/*")
    .pipe(changed("./dist/images")) // Only process changed files
    .pipe(webp({ lossless: true }))
    .pipe(gulp.dest("./dist/images"));
});

// Serve and watch for changes
gulp.task("serve", () => {
  create().init({
    server: "./dist/",
  });

  // Watch for changes in JSON files (ignore data.json)
  gulp.watch(["./src/data/**/*.json", "!./src/data/**/data.json"], gulp.series("combine-json", "pugToHtmlEnglish", "pugToHtmlArabic"));

  // Watch for other changes
  gulp.watch("./src/sass/**/*.scss", gulp.series("sass"));
  gulp.watch("./src/pug/**/*.pug", gulp.series("pugToHtmlEnglish", "pugToHtmlArabic"));
  gulp.watch("./src/images/**/*", gulp.series("imgSquash"));
  gulp.watch("./src/js/**/*", gulp.series("javaScript"));
  gulp.watch("./src/cssVendor/*", gulp.series("cssVendor"));
  gulp.watch("./dist/*.html").on("change", create().reload);
});

// Default task
gulp.task("default", gulp.series("clean-json", "combine-json", "sass", "pugToHtmlEnglish", "pugToHtmlArabic", "imgSquash", "fonts", "javaScript", "cssVendor", "serve"));

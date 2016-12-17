var gulp = require("gulp");
var jasmine = require("gulp-jasmine");

gulp.task("test", () => {
  gulp.src("dist/test/test/**/*.js")
    .pipe(jasmine({
      verbose: true,
      includeStackTrace: true,
      errorOnFail: false
    }));
});



const gulp = require('gulp');

/**
 * 执行构建
 */
gulp.task('build', () => {
  gulp.src('./index.js')
    .pipe(gulp.dest('./lib/'));
});

gulp.task('bin', () => {
  gulp.src('./index.js')
    .pipe(gulp.dest('./bin/'));
});

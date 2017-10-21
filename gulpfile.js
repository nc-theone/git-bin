
const gulp = require('gulp');

// gulp.task('build', () => {
//   gulp.src('./index.js')
//     .pipe(gulp.dest('./lib/'));
// });

gulp.task('bin', () => {
  gulp.src('./index.js')
    .pipe(gulp.dest('./bin/'));
});

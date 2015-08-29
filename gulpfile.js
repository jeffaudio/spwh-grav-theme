var gulp = require('gulp');
var del = require('del');

var pkg = require("./package.json");

var plug = require('gulp-load-plugins')();

var gutil = plug.loadUtils(['colors', 'env', 'log', 'date']);

var type = gutil.env.production ? 'production' : 'development';
gutil.log('Building for', gutil.colors.magenta(type));
gutil.beep();

gulp.task('clean', function(cb) {
	del([
		pkg.paths.dest.css + "/**/*"
	], cb);
});

gulp.task('minify-css', ['compile-sass'], function() {
	return gulp.src(pkg.paths.dest.css + "/*.css")
		.pipe(plug.minifyCss({ 
			keepSpecialComments: "*"
		}))
		.pipe(gulp.dest(pkg.paths.dest.css));
})

gulp.task('compile-sass', ['clean'], function() {
	return gulp.src(pkg.paths.src.scss)
		.pipe(plug.sass({
			includePaths: pkg.paths.lib.scss
		}))
		.pipe(gulp.dest(pkg.paths.dest.css));
});

gulp.task('default', ['minnify-css'], function() {

	return 
		plug.notify({
			onLast: true,
			message: "Compiled and copied to production directory!"
      });

});

gulp.task('watch', ['compile-sass'], 	function() {
	var watcher = gulp.watch(pkg.paths.src.scss, ['compile-sass']);

	watcher.on('change', function(evt) {
		plug.notify({message: "SPWH Updated."});
	});
});
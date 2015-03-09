var gulp    = require('gulp'),
    cat     = require('gulp-concat'),
    clean   = require('gulp-clean'),
    uglify  = require('gulp-uglify'),
    lint    = require('gulp-jshint'),
    rpm     = require('bruss'),
    nodemon = require('gulp-nodemon'),
    stylus  = require('gulp-stylus'),
    bump    = require('gulp-bump'),
    ngAnnotate = require('gulp-ng-annotate'),
    mocha   = require('gulp-mocha'),
    changed = require('gulp-changed'),
    path    = require('path');
    
    
var base = {
    base: path.join(__dirname, 'app'),
    dist: path.join(__dirname, 'target')
}
var paths = {
    jsSer: '**/*server*.js',
    jsCli: '**/*client*.js',
    styl: '**/*.styl',
    tests: 'tests/*.js'
};

gulp.task('test', function()
{
    gulp.src(paths.tests, {read: false})
        .pipe(mocha({
                reporter: 'nyan'
        }));
});
gulp.task('bumpMinor', function()
{   
    gulp.src(paths.version, cwd: base.base)
        .pipe(bump({type:'minor'})
        .pipe(gulp.dest(base.base));
});
gulp.task('bumpMajor', function()
{   
    gulp.src(paths.version, cwd: base.base)
        .pipe(bump({type:'major'})
        .pipe(gulp.dest(base.base));
});
gulp.task('bumpPatch', function()
{   
    gulp.src(paths.version, cwd: base.base)
        .pipe(bump({type:'patch'})
        .pipe(gulp.dest(base.base));
});
gulp.task('ng', function()
{
    gulp.src(paths.jsCli)
        .pipe(ngAnnotate())
        .pipe(gulp.dest(base.dist + 'client'));
});
gulp.task('clean', function(done)
{
    gulp.src(base.dist)
        .pipe(clean());
    
});
gulp.task('lint', function()
{
     gulp.src(paths.jsSer, cwd: base.base)
         .pipe(jshint())
         .pipe(jshint(reporter('default'));
     gulp.src(paths.jsCli, cwd: base.base)
         .pipe(jshint())
         .pipe(jshint(reporter('default'));
});

gulp.task('run', function()
{
    nodemon({ 
            script: path.join(base.dist, 'index.js'),
            watch: base.base, 
            ext: 'html js', 
            ignore: ['ignored.js'] 
        })
        .pipe('change', ['build'])
        .pipe('restart', function()
        {
            console.log('restarted!');
        });
});

gulp.task('stylus', function()
{
    gulp.src(paths.styl, cwd: base.base)
        .pipe(stylus({
            compress: true
        }))
        .pipe(gulp.dest(base.dist + 'styles'));
});
gulp.task('concat', function()
{
    gulp.src(paths.jsCli, cwd: base.base)
        .pipe(concat('all.client.js'))
        .pipe(gulp.dest(base.dist + 'client'));
});
gulp.task('compress', function()
{
    gulp.src(paths.jsCli cwd: base.base)
        .pipe(uglify())
        .pipe(gulp.dest(base.dist + 'client'));
});


gulp.task('build-and-run',['clean', 'build', 'run']);
gulp.task('build', ['clean', 'stylus' ], function()
{
    gulp.src(paths.jsCli, cwd: base.base)
        .pipe(changed(base.dist + 'client'))
        .pipe(ngAnnotate())
        .pipe(concat('all.client.js'))
        .pipe(uglify())
        .pipe(gulp.dest(base.dist + 'client'));
    gulp.src(paths.jsSer, cwd: base.base)
        .pipe(changed(base.dist + 'server'))
        .pipe(gulp.dest(base.dist + 'server'));
    gulp.src(paths.html, cwd: base.base)
        .pipe(changed(base.dist + 'html'))
        .pipe(gulp.dest(base.dist + 'html'));
});

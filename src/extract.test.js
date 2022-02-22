const gulp = require('gulp');
const extract = require('./extract.plugin');
const path = require('path');


const soucePath = path.join(__dirname,'../demodata')

gulp.src([
    soucePath+ '/**',
    "!"+ soucePath+ '/languages/**'
]).pipe(extract({
    // output: path.join(soucePath , 'languages'),
    namespaces:{
        "a":"a",
        "b":"b",
    }
}))
.pipe(gulp.dest(path.join(__dirname,'../demodata/languages')));

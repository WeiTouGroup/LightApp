/**
 * Created by PuTi(编程即菩提) 9/9/16.
 * -source output js source,minify js code by default
 */
var gulp = require('gulp');
var gulpsync = require('gulp-sync')(gulp);
var path = require('path');
var fs = require('fs');
var rename = require('gulp-rename');
var pkg = require('./package.json');
var del = require('del');
var jade = require('gulp-jade');
var data = require('gulp-data');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var gulpif = require('gulp-if');
var sprity = require('sprity');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');

var foreach = require('gulp-foreach');
var version = pkg.version;
var jadeTaskList = [];

var devCssMap = {};
var devJsMap = {};
var distCssMap = {};
var distJsMap = {};
var distCssTaskList = [];
var distJsTaskList = [];

var outputSource = process.argv.indexOf('-source') > 0;
var mockup = process.argv.indexOf('-mockup') > 0;
var product = process.argv.indexOf('-product') > 0;

function addConfigJs(inJsLIst){
    var ioPath = product ?  'product':'uat';
    var files = fs.readdirSync(path.join(__dirname, 'src/js/config/', ioPath));
    var relPath = 'js/config/' + ioPath;
    var index;
    for (index in files) {
        var temp = relPath + '/' + files[index];
        inJsLIst.push(temp);
    }
}
function initShareData() {
    var data = require('./src/jade/data/shared.json');
    var devCssList = [];
    var devJsList = [];
    var distRefCssList = [];

    var distRefJsList = [];
    var css = data.css;
    var js = data.js;

    var i, j, count, temp, tempName, tempSrc, tempPath;

    count = css.length;
    for (i = 0; i < count; i++) {
        temp = css[i];
        tempName = temp.name;
        tempSrc = temp.src;
        for (j = 0; j < tempSrc.length; j++) {
            tempPath = tempSrc[j];
            devCssList.push('./' + tempPath);
            distRefCssList.push('./src/' + tempPath);
        }
        devCssMap[tempName] = devCssList;
        distCssMap[tempName] = distRefCssList;
    }

    for (i = 0; i < js.length; i++) {
        temp = js[i];
        tempName = temp.name;
        tempSrc = temp.src;
        for (j = 0; j < tempSrc.length; j++) {
            tempPath = tempSrc[j];
            if (typeof tempPath === 'object') {
                tempPath = mockup ? tempPath.mockup : tempPath.dev;
            }
            devJsList.push('./' + tempPath);
            distRefJsList.push('./src/' + tempPath);
        }
        devJsMap[tempName] = devJsList;
        distJsMap[tempName] = distRefJsList;
    }
}
function addSubJs(absPath, relPath, jsList) {
    var files = fs.readdirSync(absPath);
    var index;
    for (index in files) {
        var filePath = path.join(absPath, files[index]);
        var stats = fs.lstatSync(filePath);
        if (stats.isDirectory()) {
            addSubJs(filePath, relPath + files[index] + '/', jsList);
        } else if (stats.isFile()) {
            jsList.push(relPath + files[index]);
        }
    }
}

function addPageJs(absPath, relPath, jsList, registerList) {
    var registerJS = null;
    var pageJsList = [];
    var jsList = [];
    var index;
    var files = fs.readdirSync(absPath);
    for (index in files) {
        var filePath = path.join(absPath, files[index]);
        var stats = fs.lstatSync(filePath);
        if (stats.isDirectory()) {
            addSubJs(filePath, relPath + files[index] + '/', jsList);
        } else if (stats.isFile()) {
            if (files[index] === 'register.js') {
                registerJS = relPath + files[index];
            } else {
                pageJsList.push(relPath + files[index]);
            }
        }
    }
    return {
        registerJs: registerJS,
        pageJsList: pageJsList,
        jsList: jsList
    }
}

function addModelJs(inJsList) {
    var absPath = path.join(__dirname, 'src/js/model');
    var files = fs.readdirSync(absPath);
    var relPath = 'js/model';
    var index;
    for (index in files) {
        var filePath = path.join(absPath, files[index]);
        var stats = fs.lstatSync(filePath);
        if (stats.isFile()) {
            inJsList.push(relPath + '/' + files[index]);
        }
    }
    return inJsList;
}
function addModelListenerJs(inJsList) {
    var files = fs.readdirSync(path.join(__dirname, 'src/js/model/listener'));
    var relPath = 'js/model/listener';
    var index;
    for (index in files) {
        inJsList.push(relPath + '/' + files[index]);
    }
    return inJsList;
}
function addIOJs(inJsList) {
    var ioPath = mockup ? 'mockup' : 'dev';
    var files = fs.readdirSync(path.join(__dirname, 'src/js/io/', ioPath));
    var relPath = 'js/io/' + ioPath;
    var index;
    for (index in files) {
        inJsList.push(relPath + '/' + files[index]);
    }
    return inJsList;
}
function addViewJs(inJsList) {
    var files = fs.readdirSync(path.join(__dirname, 'src/js/view'));
    var relPath = 'js/view/';
    var index;
    for (index in files) {
        //inJsList.push(relPath + '/' + files[index]);

        var filePath = path.join('./src/'+relPath, files[index]);
        var stats = fs.lstatSync(filePath);
        if (stats.isDirectory()) {
            addSubJs(filePath, relPath + files[index] + '/', inJsList);
        } else if (stats.isFile()) {
            inJsList.push(relPath + files[index]);
        }
    }
    return inJsList;
}
function initSPAJS(inData) {
    var flag = inData.flag || 0;
    var js = inData.js;
    var unshared = js.unshared;
    var relPageRootDir = 'js/page/';
    var pageRootDir = path.join(__dirname, 'src/' + relPageRootDir);
    var index, count;
    var files = fs.readdirSync(pageRootDir);
    var jsList = [];
    var registerList = [];
    var modelJsList = [];
    var ioJsList = [];
    var viewJsList = [];
    var listenerList = [];
    if (flag == 1) {
        return inData;
    }

    for (index in files) {
        var pageDir = path.join(pageRootDir, files[index]);
        var stats = fs.lstatSync(pageDir);
        var result;
        if (stats.isDirectory()) {
            result = addPageJs(pageDir, relPageRootDir + files[index] + '/', jsList, registerList);
            jsList = jsList.concat(result.jsList);
            jsList = jsList.concat(result.pageJsList);
            registerList = registerList.concat(result.registerJs);
        }
    }
    addModelJs(modelJsList);
    count = modelJsList.length;
    for (index = 0; index < count; index++) {
        unshared.push(modelJsList[index]);
    }
    count = jsList.length;
    for (index = 0; index < count; index++) {
        unshared.push(jsList[index]);
    }
    count = registerList.length;
    for (index = 0; index < count; index++) {
        unshared.push(registerList[index]);
    }

    addModelListenerJs(listenerList);
    count = listenerList.length;
    for (index = 0; index < count; index++) {
        unshared.push(listenerList[index]);
    }
    addViewJs(viewJsList);
    count = viewJsList.length;
    for (index = 0; index < count; index++) {
        unshared.push(viewJsList[index]);
    }
    addConfigJs(unshared);
    addIOJs(ioJsList);
    count = ioJsList.length;
    for (index = 0; index < count; index++) {
        unshared.push(ioJsList[index]);
    }

    unshared.push('js/Application.js');
    unshared.push('js/Model.js');
    unshared.push('js/shell.js');
    return inData;
}
console.log('output source:' + outputSource);
initShareData();
gulp.task('default', gulpsync.sync(['clean', 'jade-data', 'build']));
gulp.task('build', ['jade', 'js', 'css', 'dist-music','dist-fonts', 'dist-images']);
gulp.task('css', gulpsync.sync([['sprite', 'sass'], 'dist-pre-css', 'dist-css']));
gulp.task('js', gulpsync.sync(['dist-pre-js', 'dist-js']));
gulp.task('output-source', function () {
    if (!outputSource) {
        return del(['./web/js/*.source.js'])
    }
});
function createJadeTask(inPageKey, inJadePath, inData, inDest) {
    var key = 'jade:' + inDest + '/' + inPageKey + '.html';
    gulp.task(key, function () {
        return gulp.src(inJadePath)
            .pipe(data(function (file) {
                return inData;
            }))
            .pipe(jade({
                pretty: true
            }))
            .pipe(rename({
                basename: inPageKey,
                extname: '.html'
            }))
            .pipe(gulp.dest(inDest));
    });
    jadeTaskList.push(key);
}

function createDistJsTask(inName, inRefJsList) {
    var key = 'js-' + inName;
    gulp.task(key, function () {
        var g = gulp.src(inRefJsList)
            .pipe(sourcemaps.init())
            .pipe(concat(inName + '.' + version + '.js'));
        if (outputSource) {
            g.pipe(gulp.dest('./web/js'))
        } else {
            g.pipe(uglify())
                .pipe(rename({suffix: '.min'}))
                .pipe(gulp.dest('./web/js'));
        }
        return g;
    });
    distJsTaskList.push(key);
}

function createDistCssTask(inName, inPathList) {
    var key = 'css-min-' + inName;
    gulp.task(key, function () {
        return gulp.src(inPathList)
            .pipe(concat(inName + '.' + version + '.min.css'))
            .pipe(cleanCSS({debug: true}, function (details) {
                //console.log(details.name + ': ' + details.stats.originalSize + '--->' + details.stats.minifiedSize);
            }))
            .pipe(gulp.dest('./web/css'));
    });
    distCssTaskList.push(key);
}

gulp.task('clean', function () {
    return del(['./src/img/sprite', './src/*.html', './src/css', './web'])
});

gulp.task('jade-data', function () {
    return gulp.src('./src/jade/*.json')
        .pipe(foreach(function (stream, file) {
            var fullPath = file.path;
            var json = path.parse(fullPath);
            var name = json.name;
            var dir = json.dir;
            var jadeFile = path.join(dir, name + '.jade');
            var data = initSPAJS(require(fullPath));
            var js = data.js;
            var jsShared = js.shared || [];
            var jsUnshared = js.unshared || [];

            var devCssList = [];
            var devJsList = [];
            var distRefCssList = [];
            var distCssList = [];

            var distRefJsList = [];
            var distJsList = [];
            var css = data.css;
            var cssShared = css.shared || [];
            var cssUnshared = css.unshared || [];

            var devData = {
                title: data.title
            };
            var distData = {
                title: data.title
            };
            var i, j, count, temp, tempName;
            var tempPath = './src/css/' + temp;

            for (i = 0; i < cssShared.length; i++) {
                temp = cssShared[i];
                tempPath = devCssMap[temp];
                for (j = 0; j < tempPath.length; j++) {
                    devCssList.push(tempPath[j]);
                }
                distCssList.push('./css/' + temp + '.' + version + '.min.css');
            }
            for (i = 0; i < cssUnshared.length; i++) {
                temp = cssUnshared[i];
                tempPath = temp;
                devCssList.push('./' + tempPath);
                distRefCssList.push('./src/' + tempPath);
            }
            if (distRefCssList && distRefCssList.length > 0) {
                distCssMap[name] = distRefCssList;
                distCssList.push('./css/' + name + '.' + version + '.min.css');
            }

            devData.cssList = devCssList;
            distData.cssList = distCssList;

            for (i = 0; i < jsShared.length; i++) {
                temp = jsShared[i];
                tempPath = devJsMap[temp];
                for (j = 0; j < tempPath.length; j++) {
                    devJsList.push(tempPath[j]);
                }
                distJsList.push('js/' + temp + '.' + version + (outputSource ? '.js' : '.min.js'));
            }

            count = jsUnshared.length;
            for (i = 0; i < count; i++) {
                temp = jsUnshared[i];
                if (typeof temp === 'object') {
                    temp = mockup ? temp.mockup : temp.dev;
                }
                devJsList.push('./' + temp);
                distRefJsList.push('./src/' + temp);
            }
            if (distRefJsList && distRefJsList.length > 0) {
                distJsMap[name] = distRefJsList;
                distJsList.push('js/' + name + '.' + version + (outputSource ? '.js' : '.min.js'));
            }

            if (!fs.existsSync(jadeFile)) {
                jadeFile = path.join(dir, 'default.jade');
            }
            devData.jsList = devJsList;
            distData.jsList = distJsList;
            createJadeTask(name, jadeFile, devData, './src');
            console.log(JSON.stringify(distData));
            createJadeTask(name, jadeFile, distData, './web');
            return stream;
        }));
});
gulp.task('jade', jadeTaskList);
gulp.task('dist-js', distJsTaskList);
gulp.task('dist-pre-js', function () {
    var name, i, count, array = [];
    for (name in distJsMap) {
        createDistJsTask(name, distJsMap[name]);
    }
});
gulp.task('dist-css', distCssTaskList);
gulp.task('dist-pre-css', function () {
    var name, path;
    for (name in distCssMap) {
        createDistCssTask(name, distCssMap[name]);
    }
});

gulp.task('dist-css', distCssTaskList);
gulp.task('sprite', function () {
    return sprity.src({
            src: './src/images/icon/**/*.{png,jpg}',
            style: './sprite.css',
            cssPath: '../images/sprite',
            'dimension': [{
                ratio: 1, dpi: 72
            }, {
                ratio: 2, dpi: 192
            }],
            margin: 0,
            split: true
        })
        .pipe(gulpif('*.png', gulp.dest('./src/images/sprite'), gulp.dest('./src/css/')))
});
gulp.task('dist-music', function () {
    return gulp.src('./src/music/**/*.*')
        .pipe(gulp.dest('./web/music'));
});
gulp.task('dist-fonts', function () {
    return gulp.src('./src/fonts/**/*.*')
        .pipe(gulp.dest('./web/fonts'))
});
gulp.task('dist-images', function () {
    return gulp.src('./src/images/**/*.*')
        .pipe(gulp.dest('./web/images'))
});
gulp.task('sass', function () {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['> 0%']
            //> 0%: webkit moz 0
            //> 1%: webkit
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./src/css'));
});

gulp.task('debug', function () {
    console.log('cssMap:' + JSON.stringify(distCssMap));
    console.log('jsMap:' + JSON.stringify(distJsMap));
});

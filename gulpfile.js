const { src, dest, series, parallel } = require('gulp');
const del = require('del');
const fs   = require('fs');
const zip = require('gulp-zip');
const log = require('fancy-log');
var exec = require('child_process').exec;

const paths = {
  prod_build: './prod-build',
  server_file_name: 'server.bundle.js',
  react_src: './client/build/**/*',
  react_dist: './prod-build/client/build',
  zipped_file_name: 'react-nodejs.zip'
};

function clean()  {
  log('removing the old files in the directory')
  return del('./prod-build/**', {force:true});
}

function createProdBuildFolder() {

  const dir = paths.prod_build;
  log(`Creating the folder if not exist  ${dir}`)
  if(!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    log('📁  folder created:', dir);
  }

  return Promise.resolve('the value is ignored');
}

function buildReactCodeTask(cb) {
  log('building React code into the directory')
  return exec('cd ./client && npm run build', function (err, stdout, stderr) {
    log(stdout);
    log(stderr);
    cb(err);
  })
}

function copyReactCodeTask() {
  log('copying React code into the directory')
  return src(`${paths.react_src}`)
        .pipe(dest(`${paths.react_dist}`));
}

function copyNodeJSCodeTask() {
  log('building and copying server code into the directory')
  return src(['package.json','server.js'])
    .pipe(dest(`${paths.prod_build}`))
}

function copyNodeJSRoutesCodeTask() {
  log('building and copying routes directory')
  return src(['./routes/**/*'])
    .pipe(dest(`${paths.prod_build}/routes`))
}

function copyNodeJSConfigCodeTask() {
  log('building and copying routes directory')
  return src(['./config/**/*'])
    .pipe(dest(`${paths.prod_build}/config`))
}

function copyNodeJShelpersCodeTask() {
  log('building and copying routes directory')
  return src(['./helpers/**/*'])
    .pipe(dest(`${paths.prod_build}/helpers`))
}

function copyNodeJSmiddlewareCodeTask() {
  log('building and copying routes directory')
  return src(['./middleware/**/*'])
    .pipe(dest(`${paths.prod_build}/middleware`))
}

function copyNodeJSmodelsCodeTask() {
  log('building and copying routes directory')
  return src(['./models/**/*'])
    .pipe(dest(`${paths.prod_build}/models`))
}

function copyNodeJSModulesCodeTask() {
  log('building and copying routes directory')
  return src(['./node_modules/**/*'])
    .pipe(dest(`${paths.prod_build}/node_modules`))
}

function copyNodeJSvalidationCodeTask() {
  log('building and copying routes directory')
  return src(['./validation/**/*'])
    .pipe(dest(`${paths.prod_build}/validation`))
}


function zippingTask() {
  log('zipping the code ')
  return src(`${paths.prod_build}/**`)
      .pipe(zip(`${paths.zipped_file_name}`))
      .pipe(dest(`${paths.prod_build}`))
}

exports.default = series(
  clean,
  createProdBuildFolder,
  buildReactCodeTask,
  parallel(
    copyReactCodeTask,
    copyNodeJSCodeTask,
    copyNodeJSRoutesCodeTask,
    copyNodeJSConfigCodeTask,
    copyNodeJShelpersCodeTask,
    copyNodeJSmiddlewareCodeTask,
    copyNodeJSmodelsCodeTask,
    copyNodeJSModulesCodeTask,
    copyNodeJSvalidationCodeTask
  ),
  zippingTask
)

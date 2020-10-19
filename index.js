const path = require('path');
const gulp = require('gulp');
const rollup = require('gulp-rollup-each');
const { babel } = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const uglify = require('gulp-uglify');
const noop = require("gulp-noop");

const production = process.env.NODE_ENV !== 'development';

const jsCompile = (src, dest) =>
  gulp
    .src(src)
    .pipe(
      rollup(
        {
          plugins: [
            nodeResolve(),
            commonjs(),
            babel({
              babelHelpers: 'bundled',
              presets: ['@babel/preset-env'],
            }),
          ],
        },
        (file) => {
          return {
            format: 'umd',
            name: path.basename(file.path, '.js'),
          };
        },
      ),
    )
    .pipe(
      !production
        ? noop() // eslint-disable-next-line
        : uglify({ mangle: false }).on('error', function (e) {
            const message =
              'Javascript minification (gulp-uglify) has failed. Likely due to javascript errors listed above.';

            // Console colors
            // https://coderwall.com/p/yphywg/printing-colorful-text-in-terminal-when-run-node-js-script
            // eslint-disable-next-line no-console
            console.log('\x1b[44m', message);
            // console.log(e);
          }),
    )
    .pipe(gulp.dest(dest));

module.exports = {
  jsCompile,
};
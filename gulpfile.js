import {
  src, dest, series, parallel, watch,
} from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import concat from 'gulp-concat';
import terser from 'gulp-terser';
import sourcemaps from 'gulp-sourcemaps';

const sass = gulpSass(dartSass);

// Пути к файлам
const paths = {
  html: {
    src: 'src/*.html',
    dest: 'dist/',
  },
  styles: {
    src: 'src/sass/styles.sass',
    dest: 'dist/css/',
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'dist/js/',
  },
};

// Задача для обработки HTML
function html() {
  return src(paths.html.src)
    .pipe(dest(paths.html.dest));
}

// Задача для обработки и компиляции Sass
function styles() {
  return src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.styles.dest));
}

// Задача для объединения и минификации JavaScript файлов
function scripts() {
  return src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.scripts.dest));
}

// Задача для отслеживания изменений
function watchFiles() {
  watch(paths.html.src, html);
  watch(paths.styles.src, styles);
  watch(paths.scripts.src, scripts);
}

// Экспорт задач для использования в командной строке
export const htmlTask = html;
export const stylesTask = styles;
export const scriptsTask = scripts;
export const watchTask = watchFiles;

export default series(
  parallel(html, styles, scripts),
  watchFiles,
);

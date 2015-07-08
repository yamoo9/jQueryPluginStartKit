/**
 * ----------------------------------------------------------------
 * CONFIG
 * 환경설정
 * ----------------------------------------------------------------
 */

 	// 프로젝트 폴더 설정
var SRC = 'src/',
	OUT = 'dist/',
	BID = 'build/',
	IMG = 'images/',

	// 동기 실행 시간(ms) 설정
	wait = 600,

	// 파일 경로 설정
	paths = {
		html: {
			src : SRC + 'html/**/*.html',
			out : OUT + 'html/**/*.html',
		},
		css: {
			src   : [ SRC + 'css/style.css', SRC + 'css/part/**/*' ],
			out   : [ OUT + 'css/style.css', OUT + 'css/part/**/*' ],
			build : [BID + 'css/', BID + 'css/part'],
		},
		js: {
			src: [ SRC + 'js/**/*.js', SRC + '!test/*' ],
			out: OUT + 'js/',
		},
		img: {
			src: SRC + IMG + '**/*',
			out: OUT + IMG,
		}
	},

	// Gulp 플러그인 로더 설정
	// https://www.npmjs.com/package/gulp-load-plugins
	pluginsRules = {
		pattern       : ['gulp-*', 'gulp.*'],
		replaceString : /^gulp(-|\.)/,
		camelize      : true,
		lazy          : true,
		// NPM 패키지 모듈 이름 재정의
		rename        : {
			'gulp-html-ssi'       : 'includer',
			'gulp-html-replace'   : 'replacer',
			'gulp-autoprefixer'   : 'prefixer',
			'gulp-requirejs'      : 'rjs',
			'gulp-combine-mq'     : 'mq',
		}
	},

	// HTML 문법 검사 설정
	// https://github.com/yaniswang/HTMLHint/wiki/Rules
	htmlHintRules = {
		"doctype-first"            : true,
		"doctype-html5"            : true,

		"tagname-lowercase"        : true,
		"tag-pair"                 : true,
		"tag-self-close"           : !true,

		"attr-lowercase"           : true,
		"attr-value-double-quotes" : true,
		"attr-value-not-empty"     : true,
		"attr-no-duplication"      : true,

		"id-unique"                : true,
		"id-class-value"           : "dash",

		"img-alt-require"          : true,
		"src-not-empty"            : true,
	},

	// HTML 압축(최적화) 설정
	// https://github.com/kangax/html-minifier#options-quick-reference
	htmlMinRules = {
		collapseWhitespace            : true,
		preserveLineBreaks            : true,
		conservativeCollapse          : true,
		removeStyleLinkTypeAttributes : true,
		removeScriptTypeAttributes    : true,
		removeEmptyAttributes         : true,
	},

	// CSS3 브라우저 벤더 프리픽스 설정
	// https://github.com/ai/browserslist
	// https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements
	prefixRules = [
		'> 5% in KR',
		// 'ie >= 8',
		// 'Chrome >= 41',
		// 'Firefox ESR',
		// 'Safari >= 7'
		// 'Opera >= 12',
		// 'Android 2.3',
		// 'Android >= 4',
		// 'iOS >= 7',
	],

	// RequireJS(r.js) Optimize 설정
	// https://github.com/jrburke/r.js/blob/master/build/example.build.js
	requireJSRules = {
		// 앱 디렉토리 설정
		appDir: OUT,
		// 모듈 관리 기본 경로 설정
		baseUrl: 'js/libs',
		// 아웃풋 디렉토리 설정
		dir: BID,
		// 모듈 경로 설정
		paths: {
			'common'  : '../common',
			'pages'   : '../pages',
			'plugins' : '../plugins',
			'utils'   : '../utils',
		},
		// AMD 미지원 모듈 지원 설정 및 의존성 관리
		shim: {
			'modernizr': {
				exports: 'Modernizr'
			},
			'detectizr': {
				deps    : ['modernizr'],
				exports : 'Modernizr.Detectizr'
			},
			'jquery': {
				exports: '$'
			},
			'utils/jquery.utils': {
				deps    : ['jquery']
			},
			'plugins/radioClass/jquery.radioClass': {
				deps    : ['jquery'],
				exports : '$.fn.radioClass'
			},
			'plugins/skipNav/jquery.skipNav': {
				deps    : ['jquery'],
				exports : '$.fn.skipNav'
			},
		},
		// 멀티 페이지 모듈 병합 설정
		modules: [
			{
				name: 'common',
				include: [
					'modernizr',
					'detectizr',
					'jquery',
					'utils/jquery.utils',
					'plugins/radioClass/jquery.radioClass',
					'plugins/skipNav/jquery.skipNav',
				]
			},
			{
				name: 'pages/main',
				include: ['pages/main'],
				exclude: ['common']
			},
			{
				name: 'pages/sub',
				include: ['pages/sub'],
				exclude: ['common']
			},
		],
		// 압축 설정
		optimize: 'uglify2', // none, uglify, uglify2, closure, closure.keepLines
		// 소스맵 생성 설정
		generateSourceMaps: !true,
		// 라이선스 주석 보존 설정
		preserveLicenseComments: !false,
		// i18n (Internationalization) 리소스 설정
		// https://ko.wikipedia.org/wiki/%EA%B5%AD%EC%A0%9C%ED%99%94%EC%99%80_%EC%A7%80%EC%97%AD%ED%99%94
		locale: 'ko-KR',
	};











/**
 * ----------------------------------------------------------------
 * NODE PACKAGE MODULES
 * 노드 패키지 모듈 호출
 * ----------------------------------------------------------------
 */
var gulp = require('gulp'),
	rjs  = require('requirejs'),
	$    = require('gulp-load-plugins')( pluginsRules );


/**
 * ----------------------------------------------------------------
 * DEFAULT / WATCH / BUILD
 * 기본, 관찰, 빌드 업무 등록
 * ----------------------------------------------------------------
 */
gulp.task('default', ['html:hint', 'css:concat', 'js:move', 'img:move']);

gulp.task('watch', function() {
	gulp.watch( paths.html.src, ['html:include'] );
	gulp.watch( paths.css.src, ['css:concat'] );
	gulp.watch( paths.js.src, ['js:move'] );
});

gulp.task('build', ['remove', 'html:build', 'css:build', 'img:move', 'js:build'], function() {
	gulp.start('html:min');
});



/**
 * ----------------------------------------------------------------
 * TASK LISTS
 * 개별 업무 목록
 * ----------------------------------------------------------------
 */

/**
 * ----------------------------------------------------------------
 * HTML 업무
 */

// HTML 빌드
// html:build ＜ html:hint ＜ html:include
gulp.task('html:build', ['html:hint']);

// HTML 병합
// https://www.npmjs.com/package/gulp-html-ssi
gulp.task('html:include', function(cb) {
	gulp.src( paths.html.src )
		.pipe( $.includer() )
		.pipe( gulp.dest( OUT + 'html/' ) );

	cb && setTimeout(cb, wait);
});

// HTML 문법검사
// https://www.npmjs.com/package/gulp-htmlhint
gulp.task('html:hint', ['html:include'], function() {
    gulp.src( paths.html.out )
    	.pipe( $.htmlhint( htmlHintRules ) )
    	.pipe( $.htmlhint.reporter() );
});

// HTML 압축
// https://www.npmjs.com/package/gulp-htmlmin
gulp.task('html:min', function() {
	gulp.src( paths.html.out )
		.pipe( $.htmlmin( htmlMinRules ) )
		.pipe( gulp.dest( BID + 'html/' ) );
});


/**
 * ----------------------------------------------------------------
 * CSS 업무
 */

// CSS 빌드
// css:build ＜ css:opt ＜ css:concat & css:prefixer & css:mq
gulp.task('css:build', ['css:opt']);

// CSS 병합
// https://www.npmjs.com/package/gulp-concat-css
// CSS3 Autoprefixer
// https://www.npmjs.com/package/gulp-autoprefixer
// CSS3 미디어쿼리 병합
// https://www.npmjs.com/package/gulp-combine-mq
gulp.task('css:concat', function(cb) {

	paths.css.src.forEach(function(item, index) {
		var path = paths.css.src[index];
		gulp.src( path )
			.pipe( $.if( !!path.match(/style.css/), $.concatCss('style.css') ) )
			.pipe( $.prefixer( prefixRules ) )
			.pipe( $.mq({
				beautify: true
			}) )
			.pipe( $.if( !!path.match(/style.css/), gulp.dest( OUT + 'css/' ), gulp.dest( OUT + 'css/part/' ) ) );
	});

	cb && setTimeout(cb, wait);
});

// CSS 압축
// https://www.npmjs.com/package/gulp-csso
gulp.task('css:opt', ['css:concat'], function() {
	paths.css.out.forEach(function(item, index) {
		gulp.src( paths.css.out[index] )
			.pipe( $.csso() )
			.pipe( gulp.dest( paths.css.build[index] ) );
	});
});



/**
 * ----------------------------------------------------------------
 * Javascripts 업무
 */

// JS 빌드
// js:build ＜ js:opt ＜ js:move
gulp.task('js:build', ['js:opt']);

// SRC js 디렉토리, OUT 경로로 이동
gulp.task('js:move', function(cb) {
	gulp.src( paths.js.src )
		.pipe( $.changed( paths.js.out ) )
		.pipe( gulp.dest( paths.js.out ) );

	cb && setTimeout(cb, wait);
});

// r.js 최적화
gulp.task('js:opt', ['js:move'], function(cb) {
	rjs.optimize(requireJSRules);
	cb && setTimeout(cb, wait);
});

/**
 * --------------------------------
 * Images 업무
 */

// SRC images 디렉토리, OUT 경로로 이동
gulp.task('img:move', function(cb) {
	gulp.src( paths.img.src )
		.pipe( $.changed( paths.img.out ) )
		.pipe( gulp.dest( paths.img.out ) );

	cb && setTimeout(cb, wait);
});



/**
 * ----------------------------------------------------------------
 * REMOVE WORKING & BUILD DIRECTORIES
 * 디렉토리 제거 CLI 명령
 * https://www.npmjs.com/package/gulp-shell
 * ----------------------------------------------------------------
 */
gulp.task('remove',                      $.shell.task('rm -rf ' + OUT + ' ' + BID));
gulp.task('remove:'+OUT.replace('/',''), $.shell.task('rm -rf ' + OUT));
gulp.task('remove:'+BID.replace('/',''), $.shell.task('rm -rf ' + BID));

/**
 * ----------------------------------------------------------------
 * SERVER
 * 서버 설정
 * https://www.npmjs.com/package/http-server
 * ----------------------------------------------------------------
 */

gulp.task('server', $.shell.task('http-server -a localhost -p 9090 -o'));
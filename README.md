### [jQuery Plugin](https://www.npmjs.com/browse/keyword/jquery-plugin 'NPM 기반 jQuery 플러그인') StartKit ─ [Gulp](http://gulpjs.com) Project

[AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md "Asynchronous Module Definition") 개발 패턴이 적용된 jQuery 플러그인 개발 스타트킷.

#### 지원 기능 목록

구분 | 기능 | 설명
---|---|---
HTML | [HTML SSI(Server Side Include)](https://www.npmjs.com/package/gulp-html-ssi "gulp-html-ssi") | 파일 병합
 | [HTML Hint](https://www.npmjs.com/package/gulp-htmlhint "gulp-htmlhint") | 문법 검사
 | [HTML Minification](https://www.npmjs.com/package/gulp-htmlmin "gulp-htmlmin") | 압축 (최적화)
CSS | [CSS Concatenation](https://www.npmjs.com/package/gulp-concat-css "gulp-concat-css") | 파일 병합
 | [CSS Optimization](https://www.npmjs.com/package/gulp-csso "gulp-csso") | 압축 (최적화)
 | [CSS3 Autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer "gulp-autoprefixer") | 자동 벤더프리픽스 적용
 | [CSS3 Media Queries Combine](https://www.npmjs.com/package/gulp-combine-mq "gulp-combine-mq") | 미디어쿼리 묶음처리
Javascript | AMD Pattern Development [[RequireJS](http://requirejs.org/)] | 모듈 관리
 | `r.js` Optimization ([Multi Pages](https://github.com/phated/requirejs-example-gulpfile)) | 병합/압축 (최적화) - 페이지별 관리

-

#### Gulp 업무 명령어 목록

구분 | 명령어 | 역할
---|---|---
 | `gulp (default)` | 기본
 | `gulp watch` | 관찰
 | `gulp build` | 빌드
HTML | `gulp html:include` | HTML 병합 (인클루드)
 | `gulp html:hint` | HTML 문법 검사
 | `gulp html:min` | HTML 압축(최적화)
CSS | `gulp css:concat` | CSS 병합 + 자동 벤더프리픽스 적용 + 미디어쿼리 통합
 | `gulp css:opt` | css 압축(최적화)
Javascript | `gulp js:move` | js 디렉토리 이동
 | `gulp js:opt` | js 압축(최적화)
Images | `gulp img:move` | images 디렉토리 이동
REMOVE | `gulp remove` | 생성된 디렉토리 모두 제거
SERVER | `gulp server` | 웹 서버 실행

-

#### 플러그인 쉘
```js
/*! jquery.plugin.shell.js © yamoo9.net, 2015 */
define([
	// 의존 모듈 설정
	'utils/jquery.utils'
],
function() {
	'use strict';

	var plugin = '플러그인 이름';

	// 플러그인 존재 유무 확인
	if (!$.fn[plugin]) {

		// 플러그인에 적용될 생성자
		function PluginObj(domEl, settings) {
			this.el = domEl;
			this.settings = settings;
			this.init
		}

		// 생성자 프로토타입
		PluginObj.fn = PluginObj.prototype = {};

		// 플러그인 정의
		$.fn[plugin] = function(options) {

			// 플러그인이 적용된 jQuery() 인스턴스 객체 참조
			var $this = this;

			// 사용자정의 옵션으로 기본 옵션 오버라이딩 설정
			var settings = $.extend(true, {}, $.fn[plugin].defaults, options);

			// jQuery() 인스턴스 객체 집합을 반복적으로 순환하여 플러그인 개별 적용
			return $.each($this, function(index, el) {

				// jQuery() 개별 인스턴스 객체 참조
				var $el = $this.eq(index);

				// jQuery() 개별 인스턴스 객체의 data(plugin)에 생성자 프로토타입 인스턴스 객체 참조
				$el.data(plugin, new pluginObj(el, settings));

				// 체이닝 설정
				return $el;

			});
		};

		// 플러그인 기본 옵션
		$.fn[plugin].defaults = {};

	}

});
```

-

#### AMD 개발 패턴을 적용한 RequireJS 멀티 페이지 작성 방법

```js
/**
 * --------------------------------
 * 공통(Common) 설정 파일 호출
 * --------------------------------
 */
require(['../common'], function(common) {

	/**
	 * --------------------------------
	 * 메인 페이지 모듈 코드
	 * --------------------------------
	 */
	require([
		// 모듈 호출 (등록된 paths 기준)
		'detectizr',
		'utils/jquery.utils'
	],
	function(Detectizr) {
		'use strict';

		// Detectizr 활용
		Detectizr.detect();

		// jQuery 버전, 콘솔 출력
		console.log($.version, '\n메인페이지 호출');

	});

});
```
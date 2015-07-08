/**
 * --------------------------------
 * 공통(Common) 설정 파일 호출
 * --------------------------------
 */
require(['../common'], function(common) {

	/**
	 * --------------------------------
	 * 서브 페이지 모듈 코드
	 * --------------------------------
	 */
	require([
		// 모듈 호출
		'plugins/skipNav/jquery.skipNav',
	],
	function() {
		'use strict';

		console.log($.version, '\n서브페이지 호출');

	});

});
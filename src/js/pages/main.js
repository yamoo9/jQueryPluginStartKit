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
		// 모듈 호출
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
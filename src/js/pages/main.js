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
		'utils/jquery.utils',
		'plugins/navigationBar/jquery.navigationBar'
	],
	function(Detectizr) {
		'use strict';

		// Detectizr 활용
		Detectizr.detect();

		// $gnb 인스턴스 객체에 플러그인 navigationBar() 연결
		var $gnb = $('#gnb').navigationBar({
			'prefix': 'yamoo9',
			// 'aria': false,
		});

	});

});
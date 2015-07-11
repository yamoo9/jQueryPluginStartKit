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


		// 플러그인 기본 값 변경
		$.fn.navigationBar.defaults = {
			// 플러그인 식별자(접두사)
			'prefix': 'yamoo9',
			// <nav> 클래스 속성
			'navClass': 'navigation-bar',
			// 레벨(뎁스) 클래스 속성
			'levelClasses': {
				'lv1': 'lv-1',
				'lv2': 'lv-2',
				'lv3': 'lv-3'
			},
			// 활성화 클래스 속성
			'activeClass': 'on',
			// 내비게이션 방향
			'direction': 'horizontal',
			// 이벤트 유형 설정
			'hoverFocus': true,
			// WAI-ARIA 설정
			'aria': true,
			// 탭키 포커스 설정
			'useTabFocus': true,
			// 자동 메뉴 닫힘 설정
			'autoClose': true,
		};

		// $gnb 인스턴스 객체에 플러그인 navigationBar() 연결
		var $gnb = $('#gnb').navigationBar();

	});

});
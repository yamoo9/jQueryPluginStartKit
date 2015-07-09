define([
	'utils/jquery.utils'
], function() {
	'use strict';

	/**
	 * 플러그인 이름
	 * -------------------------------- */
	var plugin = 'navigationBar';

	/**
	 * 플러그인 객체 생성자
	 * -------------------------------- */
	var NavigationBar = function($el, options) {

		// 플러그인 적용 대상 객체 참조 및
		// 옵션 오버라이딩(덮어쓰기)
		this.$el    = $el;
		this.el     = $el[0];
		this.config = $.extend(true, {}, $.fn[plugin].defaults, options);

		// 플러그인 초기화 실행
		this.init();
	};

	/**
	 * 플러그인 객체 생성자 프로토타입
	 * -------------------------------- */
	NavigationBar.prototype = {

		'init': function() {

			// 내비게이션 객체 초기화 과정에서
			// 대상 및 옵션을 제대로 받아오는지 테스트
			console.log('this.$el: ', this.$el);
			console.log('this.el: ', this.el);
			console.log('this.config: ', this.config);
		},

	};

	/**
	 * 플러그인 코드
	 * -------------------------------- */
	$.fn[plugin] = $.fn[plugin] || function(options) {

		// $this에 jQuery() 인스턴스 객체(집합) 참조
		var $this = this;

		// $this 인스턴스 객체(집합)에 개별적으로 플러그인 적용
		return $.each($this, function(index, el) {

			// $el 변수에 jQuery() 인스턴스(개별) 객체를 참조
			var $el = $this.eq(index);

			// NavigationBar 객체 생성 및 인자 전달
			new NavigationBar($el, options);

			// jQuery 체이닝 처리를 위한 return
			return $el;

		});
	};

	/**
	 * 플러그인 기본 옵션
	 * -------------------------------- */
	$.fn[plugin].defaults = {

		// 회사 식별자(접두사)
		'prefix': 'y9',

	};

});
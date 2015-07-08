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
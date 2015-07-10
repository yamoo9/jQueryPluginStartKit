define([
	// 의존 모듈 호출
	'plugins/radioClass/jquery.radioClass',
	'utils/jquery.utils'
], function() {
	'use strict';

	/**
	 * 플러그인 이름
	 * 플러그인 생성(빌드) 카운트
	 * ----------------------------------------------------------------------------------- */
	var plugin = 'navigationBar',
		build  = 0;



	/**
	 * 플러그인 객체 생성자
	 * ----------------------------------------------------------------------------------- */
	var NavigationBar = function($el, options) {
		// 플러그인 적용 대상 객체 참조 및
		// 옵션 오버라이딩(덮어쓰기)
		this.$el    = $el;
		this.el     = $el[0];
		this.config = $.extend(true, {}, $.fn[plugin].defaults, options);

		// 메뉴아이템(<a>) ID 인덱스
		// 메뉴아이템 요소 ID 동적 생성에 활용
		this.menuitemIndex   = 0;

		// 메뉴아이템 현재 활성화된 인덱스
		// 키보드 방향키를 통한 내비게이션 설정에 활용
		this.menuitemCurrent = 0;

		// 플러그인 초기화 실행
		this.init();
	};



	/**
	 * 플러그인 객체 생성자 프로토타입
	 * ----------------------------------------------------------------------------------- */
	NavigationBar.prototype = {


		/**
		 * 초기화
		 * -----------------------------------------------------------------------------------
		 */
		'init': function() {
			// 플러그인 빌드 넘버
			this.build = ++build;
			// 초기화: 플러그인 초기 환경설정
			this.settings();
			// 초기화: 플러그인 이벤트 설정
			this.events();

		},


		/**
		 * 설정: refLvEls, class, WAI-ARIA
		 * -----------------------------------------------------------------------------------
		 */
		'settings': function() {
			// 각 레벨 요소 참조 설정
			this.refLvEls();
			// 클래스 속성 설정
			this.setClass();
			// WAI-ARIA 설정 유무 확인 후 처리
			this.config.aria && this.setARIA();
		},

		// 설정: 내비게이션 레벨별 참조 요소 설정
		'refLvEls': function() {
			// this 객체 widget 변수에 참조
			// $.each() 내부 콜백 function 내부의 this 참조 대상이 바뀌기 때문
			var widget = this;

			// 레벨 1, 2, 3 요소(<ul>) 참조
			$.each([1, 2, 3], function(index, item) {
				// $lv1, $lv2, $lv3 변수에 참조
				// index 값이 0일 경우와 아닌 경우 조건 처리
				widget['$lv'+item] = (index === 0) ?
					widget.$el.children('ul') :
					widget['$lv'+(item-1)+'Li'].children('ul');
				// $lv1Li, $lv2Li, $lv3Li 변수에 참조
				widget['$lv'+item+'Li']    = widget['$lv'+item].children('li');
				// $lv1Links, $lv2Links, $lv3Links 변수에 참조
				widget['$lv'+item+'Links'] = widget['$lv'+item+'Li'].children('a');
			});

			// $lv1Links 집합 순환하여 각 요소에 인덱스 처리
			// 키보드 방향키를 통한 내비게이션 설정에 활용
			$.each(widget.$lv1Links, function(index, link) {
				widget.$lv1Links.eq(index).data('idx', index);
			});
		},

		// 설정: class 속성
		'setClass': function() {
			var config = this.config;
			// nav 클래스 속성 설정
			this.$el
				.addClass( config.prefix + '-' + config.navClass )
				.addClass( config.direction );
			// nav > ul 클래스 속성 설정
			this.$lv1.addClass( config.levelClasses.lv1 + ' ' + 'menubar' );
			// nav > ul > li > ul 클래스 속성 설정
			this.$lv2.addClass( config.levelClasses.lv2 + ' ' + 'menu' );
			// nav > ul > li > ul > li > ul 클래스 속성 설정
			this.$lv3.addClass( config.levelClasses.lv3 + ' ' + 'menu' );
		},

		// 설정: WAI-ARIA 역할/속성/상태
		'setARIA': function() {
			this.setARIARoles();      // 역할 설정
			this.setARIAProperties(); // 속성 설정
			this.setARIAStates();     // 상태 설정
		},
		// 설정: WAI-ARIA 역할
		'setARIARoles': function() {
			// nav 역할: navigation 설정
			this.$el.attr('role', 'navigation');
			// nav li 역할: presentation 설정
			this.$el.find('li').attr('role', 'presentation');
			// nav a 역할: menuitem 설정
			this.$el.find('a').attr('role', 'menuitem');
			// nav > ul 역할: menubar 설정
			this.$lv1.attr('role', 'menubar');
			// nav > ul ul 역할: menu 설정
			this.$lv1.find('ul').attr('role', 'menu');
		},
		// 설정: WAI-ARIA 속성
		'setARIAProperties': function() {
			var widget    = this,
				$menuitem = widget.$el.find('a');
			$.each($menuitem, function(index, el) {
				var $item = $menuitem.eq(index);

				$item.attr('id', widget.config.prefix + '-popup-' + widget.build + '-' + ++widget.menuitemIndex);

				// nav a 속성: 인접한 요소(메뉴)를 가지고 있는 nav a일 경우
				if( $item.next().length ) {
					// nav a 속성
					$item.attr({
						// id 속성 설정 (this.menuitemIndex 선 증가)
						// widget.build 값은 플러그인이 여러번 사용되었을 때 식별자로 사용
						// 'id': widget.config.prefix + '-popup-' + widget.build + '-' + ++widget.menuitemIndex,
						// aria-haspopup 속성 설정
						'aria-haspopup': true
					})
					// nav a + ul 속성 설정
					.next().attr('aria-describedby', $item.attr('id'));
				}
			})
		},
		// 설정: WAI-ARIA 상태
		'setARIAStates': function() {
			// 현재 상태를 제공할 span 요소 동적 생성
			$('<span>', {
				'id'   : 'a11y-current-desc',
				'class': 'a11y-hidden'
			}).appendTo( this.$el );

			// 메뉴바(ul) 요소에 현재 활성화된 상태의 자손 요소 ID 설정을 위한 준비
			this.$lv1.attr('aria-activedescendant', '');

			// this.config.useTabFocus 값이 거짓(false)일 경우,
			// 메뉴아이템(a) 요소 중 첫번째를 제외한 나머지 요소는 tabindex 속성 값을 -1로 설정
			// 탭으로 메뉴를 탐색할 수 없도록 설정
			this.config.useTabFocus || this.$lv1Links.filter(':not(:eq(0))').attr('tabindex', -1);
			this.$lv1Links.eq(0).attr('tabindex', 0);

			// 메뉴(ul) 요소를 순환하여 펼쳐짐 상태 확인 및
			// 펼쳐짐 상태, 보임 상태 설정
			var $menus = this.$lv1.find('ul'); // lv2, lv3
			$.each($menus, function(index, el) {
				var $menu = $menus.eq(index);
				if ( $menu.is(':visible') ) {
					$menu.attr({
						'aria-expanded': true,
						'aria-hidden': false
					});
				} else {
					$menu.attr({
						'aria-expanded': false,
						'aria-hidden': true
					});
				}
			});
		},

		/**
		 * 이벤트 핸들링
		 * -----------------------------------------------------------------------------------
		 */
		'events': function() {
			var widget    = this,
				// this.config.hoverFocus 값이 참인지 유무를 확인하여 이벤트 처리하는 변수
				assignEvt = this.config.hoverFocus ? 'mouseenter mouseleave focus blur' : 'click';

			// 내비게이션 메뉴아이템 assignEvt 이벤트 핸들링
			this.$el.on(assignEvt, 'a', $.proxy(this.expandToggleMenu, this));

			// 내비게이션 메뉴아이템 focusin, focusout 이벤트 핸들링
			assignEvt = assignEvt === 'click' ? assignEvt + ' focus blur' : assignEvt;
			this.$el.on(assignEvt, 'a', $.proxy(this.updateARIAStates, this));

			// 키보드 방향키 컨트롤 이벤트 핸들링
			this.$lv1Links.on('keydown keypress click', $.proxy(this.keyboardControls, this));

			// this.config.autoClose 설정 값이 참일 경우,
			// this.$el 요소에 mouseleave 이벤트 핸들링 : 자동으로 펼쳐진 메뉴 닫기
			this.config.autoClose && this.$el.on('mouseleave', $.proxy(this.removeAllActiveClass, this));

		},
		// 이벤트 핸들링: 메뉴 펼침 토글
		'expandToggleMenu': function(e) {
			var config = this.config,
				// Firefox에서 $.$() 문제 발생으로 $()로 대신 처리
				// 추후 확인 필요
				$link  = $(e.target);

			// $link.next() 요소가 존재하면 lv1 <a> 요소 브라우저 기본 동작 차단
			if($link.next().length) { e.preventDefault(); }
			// lv1 <a> 요소의 부모 <li>에 라디오 클래스 적용
			$link.parent().radioClass(config.activeClass);
			// lv1 <a> 요소의 부모 <li> 내부에서 활성화 클래스 속성을 포함한 요소에서 클래스 속성 제거
			$link.next().find('.'+config.activeClass).removeClass(config.activeClass);
			// 현재 활성화 메뉴아이템 인덱스를 this.menuitemCurrent에 참조
			// 키보드 방향키 탐색 컨트롤에서 this.menuitemCurrent 참조
			this.menuitemCurrent = $link.data('idx');
		},
		// 이벤트 핸들링: 업데이트 WAI-ARIA 상태
		'updateARIAStates': function(e) {
			var widget = this;

			// $lv1(<ul>) 요소의 aria-activedescendant 속성 값에 현재 활성화된 포커스 요소 ID 설정
			this.$lv1.attr('aria-activedescendant', $.activeElement().id);

			// 요소에 포커스 되었을 때
			switch (e.type) {

				case 'focusin':
					// 포커스가 적용된 대상
					widget.$focusEl = $.$($.activeElement());
				case 'click':
				case 'mouseenter':
					// 마우스가 올라간 대상
					widget.$focusEl = $.$(e.target);

					// 현재 활성화된 $link에 aria-describedby 상태 업데이트
					widget.$focusEl.attr('aria-describedby', 'a11y-current-desc');
					$.$('#a11y-current-desc').text('현재 키보드가 활성화된 위치는 "' + widget.$focusEl.text() +'" 메뉴 입니다.');

					// 접혀진 메뉴(<ul>) 상태 업데이트
					widget.$lv2.add(widget.$lv3).filter(':hidden').attr({
						'aria-hidden'   : true,
						'aria-expanded' : false
					});
					// 펼쳐진 메뉴(<ul>) 상태 업데이트
					widget.$focusEl.next(':visible').attr({
						'aria-hidden'   : false,
						'aria-expanded' : true
					});

				break;

				case 'focusout':
				case 'mouseleave':

					// 현재 비활성화된 $link에 aria-describedby 상태 업데이트
					widget.$focusEl.attr('aria-describedby', '');

			}

			// this.config.autoClose 설정 값이 참일 경우,
			// this.autoClose(e) 실행
			this.config.autoClose && this.autoClose(e);
		},
		// 이벤트 핸들링: 키보드 방향키 탐색
		'keyboardControls': function(e) {
			var lv1LinksLen = this.$lv1Links.length,
				key         = e.keyCode || e.which;

			// 사용자가 누른 화살표키를 조건 분기하여 lv1 <a> 포커스 이동
			switch(key) {
				case 37: // 왼쪽 화살표 키
				case 38: // 위쪽 화살표 키
					if ( --this.menuitemCurrent < 0 ) {
						this.menuitemCurrent = lv1LinksLen-1;
					}
					this.$lv1Links.attr('tabindex', -1);
					this.$lv1Links.eq(this.menuitemCurrent).attr('tabindex', 0).focus();
				break;
				case 39: // 오른쪽 화살표 키
				case 40: // 아래쪽 화살표 키
					if ( ++this.menuitemCurrent >= lv1LinksLen ) {
						this.menuitemCurrent = 0;
					}
					this.$lv1Links.attr('tabindex', -1);
					this.$lv1Links.eq(this.menuitemCurrent).attr('tabindex', 0).focus();
			}
		},
		// 자동 닫힘 설정
		'autoClose': function(e) {
			var widget = this;
			if (e.type === 'focusout') {
				setTimeout(function() {
					if(widget.$lv1.attr('aria-activedescendant') == '') {
						widget.removeAllActiveClass();
					}
				}, 1);
			}
		},
		// 모든 활성화 클래스 제거
		'removeAllActiveClass': function() {
			var cn = this.config.activeClass;
			this.$el.find('.'+cn).removeClass(cn);
		},

	};

	/**
	 * 플러그인 코드
	 * ----------------------------------------------------------------------------------- */
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
	 * ----------------------------------------------------------------------------------- */
	$.fn[plugin].defaults = {

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

});
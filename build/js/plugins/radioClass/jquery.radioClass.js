/*! jquery.radioClass.js © yamoo9.net, 2015 */

define(["utils/jquery.utils"],function(){"use strict";$.fn.radioClass||($.fn.radioClass=function(s,r){if(r=r||"","string"!==$.type(s))throw new TypeError("전달된 name 인자는 문자열이어야 합니다.");if("string"!==$.type(r))throw new TypeError("전달된 context 인자는 문자열이어야 합니다.");var t=r?this.closest(r):this;t.addClass(s);var e=t.siblings();return $.each(e,function(r){var t=e.eq(r);t.hasClass(s)&&t.removeClass(s)}),this})});
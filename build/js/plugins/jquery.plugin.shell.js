/*! jquery.plugin.shell.js © yamoo9.net, 2015 */

define(["utils/jquery.utils"],function(){"use strict";function t(t,n){this.el=t,this.settings=n,this.init}var n="플러그인 이름";$.fn[n]||(t.fn=t.prototype={},$.fn[n]=function(t){var e=this,i=$.extend(!0,{},$.fn[n].defaults,t);return $.each(e,function(t,u){var f=e.eq(t);return f.data(n,new pluginObj(u,i)),f})},$.fn[n].defaults={})});
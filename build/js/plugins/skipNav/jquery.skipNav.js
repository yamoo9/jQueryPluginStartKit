/*! jquery.skipNav.js © yamoo9.net, 2015 */

define(["utils/jquery.utils"],function(){"use strict";var t="skipNav",s={init:function(s,i){return this.$el=s.eq(0),this.$links=this.$el.find("a"),this.settings=$.extend(!0,{},$.fn[t].defaults,i),this.controls(),this.events(),this},controls:function(){this.$el.addClass(this.settings.containerClass),this.$links.addClass(this.settings.linkClasses.hidden+" "+this.settings.linkClasses.focusable).attr("aria-hidden",!0)},events:function(){this.$el.on("click","a",$.proxy(this.linksAction,this)).on("focusin focusout","a",this.toggleHidden)},linksAction:function(t){t.preventDefault();var s=t.target.getAttribute("href"),i=$.$(s);this.settings.setContainerFocuing?i.attr("tabindex",0).focus().on("blur",$.proxy(this.setTabIndexMinus,i)):i.find("*:focusable").eq(0).focus(),this.settings.setHash&&(window.location.hash=s)},setTabIndexMinus:function(){this.attr("tabindex",-1)},toggleHidden:function(t){var s=$.$(this);"focusin"===t.type?s.attr("aria-hidden",!1):s.attr("aria-hidden",!0)}};$.fn[t]||($.fn[t]=function(t,i){var n=s.init(this,t,i);return this.data("_skipNav",n),this},$.fn[t].defaults={containerClass:"skipNav-container",linkClasses:{hidden:"a11y-hidden",focusable:"focusable"},setHash:!0,setContainerFocuing:!0})});
import e from"@babel/runtime-corejs3/core-js-stable/weak-map";import t from"@babel/runtime-corejs3/core-js-stable/instance/reduce";import r from"@babel/runtime-corejs3/core-js-stable/object/keys";import n from"@babel/runtime-corejs3/core-js-stable/object/create";import a from"@babel/runtime-corejs3/core-js-stable/symbol/replace";import o from"@babel/runtime-corejs3/core-js-stable/array/from";import s from"@babel/runtime-corejs3/core-js-stable/symbol";import i from"@babel/runtime-corejs3/core-js/get-iterator-method";import l from"@babel/runtime-corejs3/core-js-stable/reflect/construct";import"core-js/modules/es.regexp.constructor.js";import"core-js/modules/es.regexp.dot-all.js";import"core-js/modules/es.regexp.sticky.js";import"core-js/modules/es.regexp.test.js";import"core-js/modules/es.reflect.to-string-tag.js";import c from"@babel/runtime-corejs3/helpers/asyncToGenerator";import u from"@babel/runtime-corejs3/helpers/classCallCheck";import f from"@babel/runtime-corejs3/helpers/createClass";import m from"@babel/runtime-corejs3/helpers/assertThisInitialized";import g from"@babel/runtime-corejs3/helpers/possibleConstructorReturn";import p from"@babel/runtime-corejs3/helpers/getPrototypeOf";import h from"@babel/runtime-corejs3/helpers/typeof";import b from"@babel/runtime-corejs3/helpers/toConsumableArray";import v from"@babel/runtime-corejs3/helpers/slicedToArray";import y from"@babel/runtime-corejs3/helpers/taggedTemplateLiteral";import d from"@babel/runtime-corejs3/helpers/inherits";import j from"@babel/runtime-corejs3/helpers/setPrototypeOf";import k from"@babel/runtime-corejs3/regenerator";import"core-js/modules/es.regexp.exec.js";import"core-js/modules/es.string.split.js";import"core-js/modules/es.string.substr.js";import"core-js/modules/es.function.name.js";import"core-js/modules/es.error.to-string.js";import"core-js/modules/es.date.to-string.js";import"core-js/modules/es.object.to-string.js";import"core-js/modules/es.regexp.to-string.js";import"core-js/modules/esnext.array.last-index.js";import"core-js/modules/es.string.replace.js";import"core-js/modules/es.error.cause.js";import"core-js/modules/es.array.iterator.js";import"core-js/modules/es.promise.js";import"core-js/modules/es.promise.all-settled.js";import"core-js/modules/es.string.iterator.js";import"core-js/modules/web.dom-collections.iterator.js";import _ from"@babel/runtime-corejs3/core-js-stable/string/raw";import x from"@babel/runtime-corejs3/core-js-stable/instance/includes";import w from"@babel/runtime-corejs3/core-js-stable/instance/map";import L from"@babel/runtime-corejs3/core-js-stable/instance/trim";import S from"@babel/runtime-corejs3/core-js-stable/instance/index-of";import $ from"@babel/runtime-corejs3/core-js-stable/instance/last-index-of";import A from"@babel/runtime-corejs3/core-js-stable/parse-int";import E from"@babel/runtime-corejs3/core-js-stable/instance/starts-with";import F from"@babel/runtime-corejs3/core-js-stable/instance/ends-with";import M from"@babel/runtime-corejs3/core-js-stable/instance/find-index";import I from"@babel/runtime-corejs3/core-js-stable/object/assign";import N from"@babel/runtime-corejs3/core-js/instance/replace-all";import T from"@babel/runtime-corejs3/core-js-stable/array/is-array";import"@babel/runtime-corejs3/core-js-stable/json/stringify";import D from"@babel/runtime-corejs3/core-js-stable/instance/concat";import C from"@babel/runtime-corejs3/core-js-stable/instance/splice";import O from"@babel/runtime-corejs3/core-js-stable/instance/for-each";import R from"@babel/runtime-corejs3/core-js-stable/object/entries";import V from"@babel/runtime-corejs3/core-js-stable/instance/slice";import z from"@babel/runtime-corejs3/core-js-stable/promise";import B from"@babel/runtime-corejs3/core-js-stable/object/get-prototype-of";import P from"@babel/runtime-corejs3/core-js-stable/set";import U from"@babel/runtime-corejs3/core-js/global-this";import Y from"@babel/runtime-corejs3/core-js-stable/instance/bind";var H,W=function(e){if("object"!==h(e)||null===e)return!1;var t=B(e);if(null===t)return!0;for(var r=t;null!==B(r);)r=B(r);return t===r},G=function(e){return!isNaN(A(e))},J=function e(t,r){var n,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o=I({},t);return O(n=R(r)).call(n,(function(t){var r=v(t,2),n=r[0],s=r[1];if(n in o)if("object"===h(s)&&null!==s)if(T(s)){if(0===a.array)o[n]=s;else if(1===a.array){var i;o[n]=D(i=[]).call(i,b(o[n]),b(s))}else if(2===a.array){var l;o[n]=b(new P(D(l=[]).call(l,b(o[n]),b(s))))}}else o[n]=e(o[n],s,a);else o[n]=s;else o[n]=s})),o},q=function(e){return null===e?"Null":void 0===e?"Undefined":"function"==typeof e?"Function":e.constructor&&e.constructor.name},K=function(){function e(){u(this,e),this._callbacks=[]}var t;return f(e,[{key:"on",value:function(e){var t;x(t=this._callbacks).call(t,e)||this._callbacks.push(e)}},{key:"off",value:function(e){for(var t=0;t<this._callbacks.length;t++){var r;if(this._callbacks[t]===e)C(r=this._callbacks).call(r,t,1)}}},{key:"offAll",value:function(){this._callbacks=[]}},{key:"emit",value:(t=c(k.mark((function e(){var t,r,n,a,o,s=arguments;return k.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:for(t=s.length,r=new Array(t),n=0;n<t;n++)r[n]=s[n];if(!z.allSettled){e.next=6;break}return e.next=4,z.allSettled(w(a=this._callbacks).call(a,(function(e){return e.apply(void 0,r)})));case 4:e.next=8;break;case 6:return e.next=8,z.all(w(o=this._callbacks).call(o,(function(e){return e.apply(void 0,r)})));case 8:case"end":return e.stop()}}),e,this)}))),function(){return t.apply(this,arguments)})}]),e}(),Q=["String","Number","Boolean","Object","Array","Function","Null","Undefined","Symbol","Date","RegExp","Error"],X=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=arguments.length>1?arguments[1]:void 0;if(u(this,e),this._id=t.id||(new Date).getTime().toString()+A(1e3*Math.random()),this._languages=t.languages,this._defaultLanguage=t.defaultLanguage||"zh",this._activeLanguage=t.activeLanguage,this._default=t.default,this._messages=t.messages,this._idMap=t.idMap,this._formatters=t.formatters,this._loaders=t.loaders,this._global=null,this.$cache={activeLanguage:null,typedFormatters:{},formatters:{}},!U.VoerkaI18n){var n=Le.I18nManager;U.VoerkaI18n=new n({defaultLanguage:this.defaultLanguage,activeLanguage:this.activeLanguage,languages:t.languages})}this.global=U.VoerkaI18n,this._loading=!1,this.register(r)}var t;return f(e,[{key:"id",get:function(){return this._id}},{key:"defaultLanguage",get:function(){return this._defaultLanguage}},{key:"activeLanguage",get:function(){return this._activeLanguage}},{key:"default",get:function(){return this._default}},{key:"messages",get:function(){return this._messages}},{key:"idMap",get:function(){return this._idMap}},{key:"formatters",get:function(){return this._formatters}},{key:"loaders",get:function(){return this._loaders}},{key:"global",get:function(){return this._global},set:function(e){this._global=e}},{key:"register",value:function(e){"function"===!h(e)&&(e=function(){}),this.global.register(this).then(e).catch(e)}},{key:"registerFormatter",value:function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=r.language,a=void 0===n?"*":n;if("function"===!h(t)||"string"!=typeof e)throw new TypeError("Formatter must be a function");x(Q).call(Q,e)?this.formatters[a].$types[e]=t:this.formatters[a][e]=t}},{key:"_fallback",value:function(){this._messages=this._default,this._activeLanguage=this.defaultLanguage}},{key:"refresh",value:(t=c(k.mark((function e(t){var r,n,a;return k.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this._loading=z.resolve(),t||(t=this.activeLanguage),t!==this.defaultLanguage){e.next=5;break}return this._messages=this._default,e.abrupt("return");case 5:if("function"!=typeof(r=this.loaders[t])){e.next=20;break}return e.prev=7,e.next=10,r();case 10:this._messages=e.sent.default,this._activeLanguage=t,e.next=18;break;case 14:e.prev=14,e.t0=e.catch(7),console.warn(D(n=D(a="Error while loading language <".concat(t,"> on i18nScope(")).call(a,this.id,"): ")).call(n,e.t0.message)),this._fallback();case 18:e.next=21;break;case 20:this._fallback();case 21:case"end":return e.stop()}}),e,this,[[7,14]])}))),function(e){return t.apply(this,arguments)})},{key:"on",get:function(){var e;return Y(e=this.global.on).call(e,this.global)}},{key:"off",get:function(){var e;return Y(e=this.global.off).call(e,this.global)}},{key:"offAll",get:function(){var e;return Y(e=this.global.offAll).call(e,this.global)}},{key:"change",get:function(){var e;return Y(e=this.global.change).call(e,this.global)}}]),e}();function Z(e){var t=function(){if("undefined"==typeof Reflect||!l)return!1;if(l.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(l(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=p(e);if(t){var a=p(this).constructor;r=l(n,arguments,a)}else r=n.apply(this,arguments);return g(this,r)}}function ee(e,t){var r=void 0!==s&&i(e)||e["@@iterator"];if(!r){if(T(e)||(r=function(e,t){var r;if(!e)return;if("string"==typeof e)return te(e,t);var n=V(r=Object.prototype.toString.call(e)).call(r,8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return o(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return te(e,t)}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,a=function(){};return{s:a,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var l,c=!0,u=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return c=e.done,e},e:function(e){u=!0,l=e},f:function(){try{c||null==r.return||r.return()}finally{if(u)throw l}}}}function te(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function re(){re=function(e,t){return new i(e,void 0,t)};var o=RegExp.prototype,s=new e;function i(e,t,r){var n=new RegExp(e,t);return s.set(n,r||s.get(e)),j(n,i.prototype)}function l(e,a){var o,i=s.get(a);return t(o=r(i)).call(o,(function(t,r){return t[r]=e[i[r]],t}),n(null))}return d(i,RegExp),i.prototype.exec=function(e){var t=o.exec.call(this,e);return t&&(t.groups=l(t,this)),t},i.prototype[a]=function(e,t){if("string"==typeof t){var r=s.get(this);return o[a].call(this,e,t.replace(/\$<([^>]+)>/g,(function(e,t){return"$"+r[t]})))}if("function"==typeof t){var n=this;return o[a].call(this,e,(function(){var e=arguments;return"object"!=h(e[e.length-1])&&(e=V([]).call(e)).push(l(e,n)),t.apply(this,e)}))}return o[a].call(this,e,t)},re.apply(this,arguments)}var ne=q,ae=G,oe=W,se=J,ie=K,le=X,ce={"*":{$types:{Date:function(e){return e.toLocaleString()}},time:function(e){return e.toLocaleTimeString()},shorttime:function(e){return e.toLocaleTimeString()},date:function(e){return e.toLocaleDateString()},dict:function(e){for(var t=arguments.length,r=new Array(t>1?t-1:0),n=1;n<t;n++)r[n-1]=arguments[n];for(var a=0;a<r.length;a+=2)if(r[a]===e)return r[a+1];return r.length>0&&r.length%2!=0?r[r.length-1]:e}},zh:{$types:{Date:function(e){var t,r,n,a,o;return D(t=D(r=D(n=D(a=D(o="".concat(e.getFullYear(),"年")).call(o,e.getMonth()+1,"月")).call(a,e.getDate(),"日 ")).call(n,e.getHours(),"点")).call(r,e.getMinutes(),"分")).call(t,e.getSeconds(),"秒")}},shortime:function(e){return e.toLocaleTimeString()},time:function(e){var t,r;return D(t=D(r="".concat(e.getHours(),"点")).call(r,e.getMinutes(),"分")).call(t,e.getSeconds(),"秒")},date:function(e){var t,r;return D(t=D(r="".concat(e.getFullYear(),"年")).call(r,e.getMonth()+1,"月")).call(t,e.getDate(),"日")},shortdate:function(e){var t,r;return D(t=D(r="".concat(e.getFullYear(),"-")).call(r,e.getMonth()+1,"-")).call(t,e.getDate())},currency:function(e){return"".concat(e,"元")}},en:{currency:function(e){return"$".concat(e)}}},ue=re(/\{\s*(\w+)?((\s*\|\s*\w*(\(.*\))?\s*)*)\s*\}/g,{varname:1,formatters:2});function fe(e){return x(e).call(e,"{")&&x(e).call(e,"}")}_(H||(H=y(["{s*{varname}s*}"],["\\{\\s*{varname}\\s*\\}"])));var me=["String","Number","Boolean","Object","Array","Function","Error","Symbol","RegExp","Date","Null","Undefined","Set","Map","WeakSet","WeakMap"];function ge(e){var t,r;if(!e)return[];var n=w(t=L(r=L(e).call(e).substr(1)).call(r).split("|")).call(t,(function(e){return L(e).call(e)}));return w(n).call(n,(function(e){var t=S(e).call(e,"("),r=$(e).call(e,")");if(-1!==t&&-1!==r){var n,a,o=L(n=e.substr(t+1,r-t-1)).call(n),s=""==o?[]:w(a=o.split(",")).call(a,(function(e){if(e=L(e).call(e),!isNaN(A(e)))return A(e);if(E(e).call(e,'"')&&F(e).call(e,'"')||E(e).call(e,"'")&&F(e).call(e,"'"))return e.substr(1,e.length-2);if("true"===e.toLowerCase()||"false"===e.toLowerCase())return"true"===e.toLowerCase();if(!(E(e).call(e,"{")&&F(e).call(e,"}")||E(e).call(e,"[")&&F(e).call(e,"]")))return String(e);try{return JSON.parse(e)}catch(t){return String(e)}}));return[e.substr(0,t),s]}return[e,[]]}))}function pe(e,t){var r,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},a=e,o=I({replaceAll:!0},n);for(ue.lastIndex=0;null!==(r=ue.exec(a));){var s=r.groups.varname||"",i=ge(r.groups.formatters);if("function"==typeof t)try{a=N(o)?N(a).call(a,r[0],t(s,i,r[0])):a.replace(r[0],t(s,i,r[0]))}catch(e){break}ue.lastIndex=0}return a}function he(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;e.$cache={activeLanguage:t,typedFormatters:{},formatters:{}}}function be(e,t,r){var n,a=[],o=ee(r);try{var s=function(){var r=n.value;if(r[0]){var o=function(e,t,r){if(e.$cache||he(e),e.$cache.activeLanguage===t){if(r in e.$cache.formatters)return e.$cache.formatters[r]}else he(e,t);for(var n=0,a=[e.formatters,e.global.formatters];n<a.length;n++){var o=a[n];if(t in o){var s=o[t]||{};if(r in s&&"function"==typeof s[r])return e.$cache.formatters[r]=s[r]}var i=o["*"]||{};if(r in i&&"function"==typeof i[r])return e.$cache.formatters[r]=i[r]}}(e,t,r[0]);"function"==typeof o?a.push((function(e){var t;return o.apply(void 0,D(t=[e]).call(t,b(r[1])))})):a.push((function(e){var t,n;return"function"==typeof e[r[0]]?(t=e[r[0]]).call.apply(t,D(n=[e]).call(n,b(r[1]))):e}))}};for(o.s();!(n=o.n()).done;)s()}catch(e){o.e(e)}finally{o.f()}return a}function ve(e,t,r,n){var a=be(e,t,r),o=function(e,t,r){if(e.$cache||he(e),e.$cache.activeLanguage===t){if(r in e.$cache.typedFormatters)return e.$cache.typedFormatters[r]}else he(e,t);for(var n=0,a=[e.formatters,e.global.formatters];n<a.length;n++){var o=a[n];if(o){if(t in o&&oe(o[t].$types)){var s=o[t].$types;if(r in s&&"function"==typeof s[r])return e.$cache.typedFormatters[r]=s[r]}if("*"in o&&oe(o["*"].$types)){var i=o["*"].$types;if(r in i&&"function"==typeof i[r])return e.$cache.typedFormatters[r]=i[r]}}}}(e,t,ne(n));return o&&C(a).call(a,0,0,o),n=function(e,t){if(0===t.length)return e;var r=e;try{var n,a=ee(t);try{for(a.s();!(n=a.n()).done;){var o=n.value;if("function"!=typeof o)return r;r=o(r)}}catch(e){a.e(e)}finally{a.f()}}catch(t){var s;console.error(D(s="Error while execute i18n formatter for ".concat(e,": ")).call(s,t.message," "))}return r}(n,a),n}function ye(e){for(var t=this,r=t.global.activeLanguage,n=arguments.length,a=new Array(n>1?n-1:0),o=1;o<n;o++)a[o-1]=arguments[o];if(0===a.length||!fe(e))return e;if(1===a.length&&oe(a[0])){var s=a[0];return pe(e,(function(e,n){var a=e in s?s[e]:"";return ve(t,r,n,a)}))}var i=1===a.length&&T(a[0])?b(a[0]):a;if(0===i.length)return e;var l=0;return pe(e,(function(e,n){if(i.length>l)return ve(t,r,n,i[l++]);throw new Error}),{replaceAll:!1})}var de={defaultLanguage:"zh",activeLanguage:"zh",languages:[{name:"zh",title:"中文",default:!0},{name:"en",title:"英文"}],formatters:ce};function je(e){return A(e)>0}function ke(e,t){try{return T(e)?e.length>t?e[t]:e[e.length-1]:e}catch(t){return T(e)?e[0]:e}}function _e(e){var t,r,n,a,o,s,i,l;return N(t=N(r=N(n=N(a=N(o=N(s=N(i=N(l=N(e).call(e,/\\(?![trnbvf'"]{1})/g,"\\\\")).call(l,"\t","\\t")).call(i,"\n","\\n")).call(s,"\b","\\b")).call(o,"\r","\\r")).call(a,"\f","\\f")).call(n,"'","\\'")).call(r,'"','\\"')).call(t,"\v","\\v")}function xe(e){var t,r,n,a,o,s,i,l;return N(t=N(r=N(n=N(a=N(o=N(s=N(i=N(l=N(e).call(e,"\\t","\t")).call(l,"\\n","\n")).call(i,"\\b","\b")).call(s,"\\r","\r")).call(o,"\\f","\f")).call(a,"\\'","'")).call(n,'\\"','"')).call(r,"\\v","\v")).call(t,/\\\\(?![trnbvf'"]{1})/g,"\\")}var we=function(e){d(o,ie);var t,r,n,a=Z(o);function o(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return u(this,o),e=a.call(this),null!=o.instance||(o.instance=m(e),e._settings=se(de,t),e._scopes=[]),g(e,o.instance)}return f(o,[{key:"settings",get:function(){return this._settings}},{key:"scopes",get:function(){return this._scopes}},{key:"activeLanguage",get:function(){return this._settings.activeLanguage}},{key:"defaultLanguage",get:function(){return this._settings.defaultLanguage}},{key:"languages",get:function(){return this._settings.languages}},{key:"formatters",get:function(){return ce}},{key:"change",value:(n=c(k.mark((function e(t){var r;return k.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=L(t).call(t),-1===M(r=this.languages).call(r,(function(e){return e.name===t}))){e.next=9;break}return e.next=4,this._refreshScopes(t);case 4:return this._settings.activeLanguage=t,e.next=7,this.emit(t);case 7:e.next=10;break;case 9:throw new Error("Not supported language:"+t);case 10:case"end":return e.stop()}}),e,this)}))),function(e){return n.apply(this,arguments)})},{key:"_refreshScopes",value:(r=c(k.mark((function e(t){var r,n;return k.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,n=w(r=this._scopes).call(r,(function(e){return e.refresh(t)})),!z.allSettled){e.next=7;break}return e.next=5,z.allSettled(n);case 5:e.next=9;break;case 7:return e.next=9,z.all(n);case 9:e.next=14;break;case 11:e.prev=11,e.t0=e.catch(0),console.warn("Error while refreshing i18n scopes:",e.t0.message);case 14:case"end":return e.stop()}}),e,this,[[0,11]])}))),function(e){return r.apply(this,arguments)})},{key:"register",value:(t=c(k.mark((function e(t){return k.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t instanceof le){e.next=2;break}throw new TypeError("Scope must be an instance of I18nScope");case 2:return this._scopes.push(t),e.next=5,t.refresh(this.activeLanguage);case 5:case"end":return e.stop()}}),e,this)}))),function(e){return t.apply(this,arguments)})},{key:"registerFormatter",value:function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=r.language,a=void 0===n?"*":n;if("function"===!h(t)||"string"!=typeof e)throw new TypeError("Formatter must be a function");x(me).call(me,e)?this.formatters[a].$types[e]=t:this.formatters[a][e]=t}}]),o}(),Le={getInterpolatedVars:function(e){var t=[];return pe(e,(function(e,r,n){var a={name:e,formatters:w(r).call(r,(function(e){var t=v(e,2);return{name:t[0],args:t[1]}})),match:n};return-1===M(t).call(t,(function(e){return e.name===a.name&&a.formatters.toString()==e.formatters.toString()}))&&t.push(a),""})),t},replaceInterpolatedVars:ye,I18nManager:we,translate:function(e){var t=this,r=t.global.activeLanguage,n=e,a=[],o=[],s=null;if("string"===!h(e))return e;try{var i,l;if(2===arguments.length&&oe(arguments[1]))O(i=R(arguments[1])).call(i,(function(e){var t=v(e,2),r=t[0],n=t[1];if("function"==typeof n)try{a[r]=n()}catch(e){a[r]=n}E(r).call(r,"$")&&"number"==typeof a[r]&&o.push(r)})),a=[arguments[1]];else if(arguments.length>=2){var c,u;a=w(c=C(u=V(Array.prototype).call(arguments)).call(u,1)).call(c,(function(e,t){try{e="function"==typeof e?e():e,ae(e)&&(s=A(e))}catch(e){}return e}))}if(r===t.defaultLanguage)je(n)&&(n=t.default[n]||e);else{var f=je(n)?n:t.idMap[_e(n)];n=t.messages[f]||n,n=T(n)?w(n).call(n,(function(e){return xe(e)})):xe(n)}return T(n)&&n.length>0&&(n=null!==s?ke(n,s):pluralVar.length>0?ke(n,A(a(pluralVar[0]))):n[0]),0==a.length?n:ye.call.apply(ye,D(l=[t,n]).call(l,b(a)))}catch(e){return n}},i18nScope:le,defaultLanguageSettings:de,getDataTypeName:ne,isNumber:ae,isPlainObject:oe};export{Le as default};
//# sourceMappingURL=index.esm.js.map
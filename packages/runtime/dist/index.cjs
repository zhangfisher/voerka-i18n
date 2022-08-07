"use strict";var e=require("@babel/runtime-corejs3/core-js-stable/weak-map"),t=require("@babel/runtime-corejs3/core-js-stable/instance/reduce"),r=require("@babel/runtime-corejs3/core-js-stable/object/keys"),a=require("@babel/runtime-corejs3/core-js-stable/object/create"),n=require("@babel/runtime-corejs3/core-js-stable/symbol/replace"),l=require("@babel/runtime-corejs3/core-js-stable/array/from"),u=require("@babel/runtime-corejs3/core-js-stable/symbol"),s=require("@babel/runtime-corejs3/core-js/get-iterator-method"),i=require("@babel/runtime-corejs3/core-js-stable/reflect/construct");require("core-js/modules/es.regexp.constructor.js"),require("core-js/modules/es.regexp.dot-all.js"),require("core-js/modules/es.regexp.sticky.js"),require("core-js/modules/es.regexp.test.js"),require("core-js/modules/es.reflect.to-string-tag.js");var c=require("@babel/runtime-corejs3/helpers/asyncToGenerator"),o=require("@babel/runtime-corejs3/helpers/classCallCheck"),f=require("@babel/runtime-corejs3/helpers/createClass"),d=require("@babel/runtime-corejs3/helpers/assertThisInitialized"),g=require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"),h=require("@babel/runtime-corejs3/helpers/getPrototypeOf"),b=require("@babel/runtime-corejs3/helpers/typeof"),p=require("@babel/runtime-corejs3/helpers/toConsumableArray"),v=require("@babel/runtime-corejs3/helpers/slicedToArray"),m=require("@babel/runtime-corejs3/helpers/taggedTemplateLiteral"),y=require("@babel/runtime-corejs3/helpers/inherits"),j=require("@babel/runtime-corejs3/helpers/setPrototypeOf"),k=require("@babel/runtime-corejs3/regenerator");require("core-js/modules/es.regexp.exec.js"),require("core-js/modules/es.string.split.js"),require("core-js/modules/es.string.substr.js"),require("core-js/modules/es.function.name.js"),require("core-js/modules/es.error.to-string.js"),require("core-js/modules/es.date.to-string.js"),require("core-js/modules/es.object.to-string.js"),require("core-js/modules/es.regexp.to-string.js"),require("core-js/modules/esnext.array.last-index.js"),require("core-js/modules/es.string.replace.js"),require("core-js/modules/es.error.cause.js"),require("core-js/modules/es.array.iterator.js"),require("core-js/modules/es.promise.js"),require("core-js/modules/es.promise.all-settled.js"),require("core-js/modules/es.string.iterator.js"),require("core-js/modules/web.dom-collections.iterator.js");var _=require("@babel/runtime-corejs3/core-js-stable/string/raw"),x=require("@babel/runtime-corejs3/core-js-stable/instance/includes"),q=require("@babel/runtime-corejs3/core-js-stable/instance/map"),L=require("@babel/runtime-corejs3/core-js-stable/instance/trim"),w=require("@babel/runtime-corejs3/core-js-stable/instance/index-of"),S=require("@babel/runtime-corejs3/core-js-stable/instance/last-index-of"),M=require("@babel/runtime-corejs3/core-js-stable/parse-int"),$=require("@babel/runtime-corejs3/core-js-stable/instance/starts-with"),F=require("@babel/runtime-corejs3/core-js-stable/instance/ends-with"),E=require("@babel/runtime-corejs3/core-js-stable/instance/find-index"),D=require("@babel/runtime-corejs3/core-js-stable/object/assign"),A=require("@babel/runtime-corejs3/core-js/instance/replace-all"),I=require("@babel/runtime-corejs3/core-js-stable/array/is-array"),N=require("@babel/runtime-corejs3/core-js-stable/json/stringify"),T=require("@babel/runtime-corejs3/core-js-stable/instance/concat"),O=require("@babel/runtime-corejs3/core-js-stable/instance/splice"),P=require("@babel/runtime-corejs3/core-js-stable/instance/for-each"),C=require("@babel/runtime-corejs3/core-js-stable/object/entries"),R=require("@babel/runtime-corejs3/core-js-stable/instance/slice"),V=require("@babel/runtime-corejs3/core-js-stable/promise"),z=require("@babel/runtime-corejs3/core-js-stable/object/get-prototype-of"),B=require("@babel/runtime-corejs3/core-js-stable/set"),U=require("@babel/runtime-corejs3/core-js/global-this"),Y=require("@babel/runtime-corejs3/core-js-stable/instance/bind");function H(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var J=H(e),W=H(t),G=H(r),K=H(a),Q=H(n),X=H(l),Z=H(u),ee=H(s),te=H(i),re=H(c),ae=H(o),ne=H(f),le=H(d),ue=H(g),se=H(h),ie=H(b),ce=H(p),oe=H(v),fe=H(m),de=H(y),ge=H(j),he=H(k),be=H(_),pe=H(x),ve=H(q),me=H(L),ye=H(w),je=H(S),ke=H(M),_e=H($),xe=H(F),qe=H(E),Le=H(D),we=H(A),Se=H(I),Me=H(N),$e=H(T),Fe=H(O),Ee=H(P),De=H(C),Ae=H(R),Ie=H(V),Ne=H(z),Te=H(B),Oe=H(U),Pe=H(Y);var Ce,Re=function(e){if("object"!==ie.default(e)||null===e)return!1;var t=Ne.default(e);if(null===t)return!0;for(var r=t;null!==Ne.default(r);)r=Ne.default(r);return t===r},Ve=function(e){return!isNaN(ke.default(e))},ze=function e(t,r){var a,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},l=Le.default({},t);return Ee.default(a=De.default(r)).call(a,(function(t){var r=oe.default(t,2),a=r[0],u=r[1];if(a in l)if("object"===ie.default(u)&&null!==u)if(Se.default(u)){if(0===n.array)l[a]=u;else if(1===n.array){var s;l[a]=$e.default(s=[]).call(s,ce.default(l[a]),ce.default(u))}else if(2===n.array){var i;l[a]=ce.default(new Te.default($e.default(i=[]).call(i,ce.default(l[a]),ce.default(u))))}}else l[a]=e(l[a],u,n);else l[a]=u;else l[a]=u})),l},Be=function(e){return null===e?"Null":void 0===e?"Undefined":"function"==typeof e?"Function":e.constructor&&e.constructor.name},Ue=function(){function e(){ae.default(this,e),this._callbacks=[]}var t;return ne.default(e,[{key:"on",value:function(e){var t;pe.default(t=this._callbacks).call(t,e)||this._callbacks.push(e)}},{key:"off",value:function(e){for(var t=0;t<this._callbacks.length;t++){var r;if(this._callbacks[t]===e)Fe.default(r=this._callbacks).call(r,t,1)}}},{key:"offAll",value:function(){this._callbacks=[]}},{key:"emit",value:(t=re.default(he.default.mark((function e(){var t,r,a,n,l,u=arguments;return he.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:for(t=u.length,r=new Array(t),a=0;a<t;a++)r[a]=u[a];if(!Ie.default.allSettled){e.next=6;break}return e.next=4,Ie.default.allSettled(ve.default(n=this._callbacks).call(n,(function(e){return e.apply(void 0,r)})));case 4:e.next=8;break;case 6:return e.next=8,Ie.default.all(ve.default(l=this._callbacks).call(l,(function(e){return e.apply(void 0,r)})));case 8:case"end":return e.stop()}}),e,this)}))),function(){return t.apply(this,arguments)})}]),e}(),Ye=Re,He=["String","Number","Boolean","Object","Array","Function","Null","Undefined","Symbol","Date","RegExp","Error"],Je=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=arguments.length>1?arguments[1]:void 0;if(ae.default(this,e),this._id=t.id||(new Date).getTime().toString()+ke.default(1e3*Math.random()),this._languages=t.languages,this._defaultLanguage=t.defaultLanguage||"zh",this._activeLanguage=t.activeLanguage,this._default=t.default,this._messages=t.messages,this._idMap=t.idMap,this._formatters=t.formatters,this._loaders=t.loaders,this._global=null,this._patchMessages={},this.$cache={activeLanguage:null,typedFormatters:{},formatters:{}},!Oe.default.VoerkaI18n){var a=jt.I18nManager;Oe.default.VoerkaI18n=new a({defaultLanguage:this.defaultLanguage,activeLanguage:this.activeLanguage,languages:t.languages})}this.global=Oe.default.VoerkaI18n,this._mergePatchedMessages(),this._patch(this._messages,newLanguage),this._loading=!1,this.register(r)}var t,r;return ne.default(e,[{key:"id",get:function(){return this._id}},{key:"defaultLanguage",get:function(){return this._defaultLanguage}},{key:"activeLanguage",get:function(){return this._activeLanguage}},{key:"default",get:function(){return this._default}},{key:"messages",get:function(){return this._messages}},{key:"idMap",get:function(){return this._idMap}},{key:"formatters",get:function(){return this._formatters}},{key:"languages",get:function(){return this._languages}},{key:"loaders",get:function(){return this._loaders}},{key:"global",get:function(){return this._global},set:function(e){this._global=e}},{key:"register",value:function(e){"function"===!ie.default(e)&&(e=function(){}),this.global.register(this).then(e).catch(e)}},{key:"registerFormatter",value:function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},a=r.language,n=void 0===a?"*":a;if("function"===!ie.default(t)||"string"!=typeof e)throw new TypeError("Formatter must be a function");pe.default(He).call(He,e)?this.formatters[n].$types[e]=t:this.formatters[n][e]=t}},{key:"registerDefaultLoader",value:function(e){this.global.registerDefaultLoader(e)}},{key:"_fallback",value:function(){this._messages=this._default,this._activeLanguage=this.defaultLanguage}},{key:"refresh",value:(r=re.default(he.default.mark((function e(t){var r,a,n;return he.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this._loading=Ie.default.resolve(),t||(t=this.activeLanguage),t!==this.defaultLanguage){e.next=7;break}return this._messages=this._default,e.next=6,this._patch(this._messages,t);case 6:return e.abrupt("return");case 7:if(r=this.loaders[t],e.prev=8,"function"!=typeof r){e.next=18;break}return e.next=12,r();case 12:return this._messages=e.sent.default,this._activeLanguage=t,e.next=16,this._patch(this._messages,t);case 16:e.next=26;break;case 18:if("function"!=typeof this.global.defaultMessageLoader){e.next=25;break}return e.next=21,this.global.loadMessagesFromDefaultLoader(t,this);case 21:this._messages=e.sent,this._activeLanguage=t,e.next=26;break;case 25:this._fallback();case 26:e.next=32;break;case 28:e.prev=28,e.t0=e.catch(8),console.warn($e.default(a=$e.default(n="Error while loading language <".concat(t,"> on i18nScope(")).call(n,this.id,"): ")).call(a,e.t0.message)),this._fallback();case 32:case"end":return e.stop()}}),e,this,[[8,28]])}))),function(e){return r.apply(this,arguments)})},{key:"_patch",value:(t=re.default(he.default.mark((function e(t,r){var a;return he.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("function"==typeof this.global.loadMessagesFromDefaultLoader){e.next=2;break}return e.abrupt("return");case 2:return e.prev=2,e.next=5,this.global.loadMessagesFromDefaultLoader(r,this);case 5:a=e.sent,Ye(a)&&(Le.default(t,a),this._savePatchedMessages(a,r)),e.next=11;break;case 9:e.prev=9,e.t0=e.catch(2);case 11:case"end":return e.stop()}}),e,this,[[2,9]])}))),function(e,r){return t.apply(this,arguments)})},{key:"_mergePatchedMessages",value:function(){var e=this._getPatchedMessages(this.activeLanguage);Ye(e)&&Le.default(this._messages,e)}},{key:"_savePatchedMessages",value:function(e,t){try{var r;if(Oe.default.localStorage)Oe.default.localStorage.setItem($e.default(r="voerkai18n_".concat(this.id,"_")).call(r,t,"_patched_messages"),Me.default(e))}catch(e){console.error("Error while save voerkai18n patched messages:",e.message)}}},{key:"_getPatchedMessages",value:function(e){try{var t;return JSON.parse(localStorage.getItem($e.default(t="voerkai18n_".concat(this.id,"_")).call(t,e,"_patched_messages")))}catch(e){return{}}}},{key:"on",get:function(){var e;return Pe.default(e=this.global.on).call(e,this.global)}},{key:"off",get:function(){var e;return Pe.default(e=this.global.off).call(e,this.global)}},{key:"offAll",get:function(){var e;return Pe.default(e=this.global.offAll).call(e,this.global)}},{key:"change",get:function(){var e;return Pe.default(e=this.global.change).call(e,this.global)}}]),e}();function We(e){var t=function(){if("undefined"==typeof Reflect||!te.default)return!1;if(te.default.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(te.default(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,a=se.default(e);if(t){var n=se.default(this).constructor;r=te.default(a,arguments,n)}else r=a.apply(this,arguments);return ue.default(this,r)}}function Ge(e,t){var r=void 0!==Z.default&&ee.default(e)||e["@@iterator"];if(!r){if(Se.default(e)||(r=function(e,t){var r;if(!e)return;if("string"==typeof e)return Ke(e,t);var a=Ae.default(r=Object.prototype.toString.call(e)).call(r,8,-1);"Object"===a&&e.constructor&&(a=e.constructor.name);if("Map"===a||"Set"===a)return X.default(e);if("Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a))return Ke(e,t)}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var a=0,n=function(){};return{s:n,n:function(){return a>=e.length?{done:!0}:{done:!1,value:e[a++]}},e:function(e){throw e},f:n}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var l,u=!0,s=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return u=e.done,e},e:function(e){s=!0,l=e},f:function(){try{u||null==r.return||r.return()}finally{if(s)throw l}}}}function Ke(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,a=new Array(t);r<t;r++)a[r]=e[r];return a}function Qe(){Qe=function(e,t){return new r(e,void 0,t)};var e=RegExp.prototype,t=new J.default;function r(e,a,n){var l=new RegExp(e,a);return t.set(l,n||t.get(e)),ge.default(l,r.prototype)}function a(e,r){var a,n=t.get(r);return W.default(a=G.default(n)).call(a,(function(t,r){return t[r]=e[n[r]],t}),K.default(null))}return de.default(r,RegExp),r.prototype.exec=function(t){var r=e.exec.call(this,t);return r&&(r.groups=a(r,this)),r},r.prototype[Q.default]=function(r,n){if("string"==typeof n){var l=t.get(this);return e[Q.default].call(this,r,n.replace(/\$<([^>]+)>/g,(function(e,t){return"$"+l[t]})))}if("function"==typeof n){var u=this;return e[Q.default].call(this,r,(function(){var e=arguments;return"object"!=ie.default(e[e.length-1])&&(e=Ae.default([]).call(e)).push(a(e,u)),n.apply(this,e)}))}return e[Q.default].call(this,r,n)},Qe.apply(this,arguments)}var Xe=Be,Ze=Ve,et=Re,tt=ze,rt=Ue,at=Je,nt={"*":{$types:{Date:function(e){return e.toLocaleString()}},time:function(e){return e.toLocaleTimeString()},shorttime:function(e){return e.toLocaleTimeString()},date:function(e){return e.toLocaleDateString()},dict:function(e){for(var t=arguments.length,r=new Array(t>1?t-1:0),a=1;a<t;a++)r[a-1]=arguments[a];for(var n=0;n<r.length;n+=2)if(r[n]===e)return r[n+1];return r.length>0&&r.length%2!=0?r[r.length-1]:e}},zh:{$types:{Date:function(e){var t,r,a,n,l;return $e.default(t=$e.default(r=$e.default(a=$e.default(n=$e.default(l="".concat(e.getFullYear(),"年")).call(l,e.getMonth()+1,"月")).call(n,e.getDate(),"日 ")).call(a,e.getHours(),"点")).call(r,e.getMinutes(),"分")).call(t,e.getSeconds(),"秒")}},shortime:function(e){return e.toLocaleTimeString()},time:function(e){var t,r;return $e.default(t=$e.default(r="".concat(e.getHours(),"点")).call(r,e.getMinutes(),"分")).call(t,e.getSeconds(),"秒")},date:function(e){var t,r;return $e.default(t=$e.default(r="".concat(e.getFullYear(),"年")).call(r,e.getMonth()+1,"月")).call(t,e.getDate(),"日")},shortdate:function(e){var t,r;return $e.default(t=$e.default(r="".concat(e.getFullYear(),"-")).call(r,e.getMonth()+1,"-")).call(t,e.getDate())},currency:function(e){return"".concat(e,"元")}},en:{currency:function(e){return"$".concat(e)}}},lt=Qe(/\{\s*(\w+)?((\s*\|\s*\w*(\(.*\))?\s*)*)\s*\}/g,{varname:1,formatters:2});function ut(e){return pe.default(e).call(e,"{")&&pe.default(e).call(e,"}")}be.default(Ce||(Ce=fe.default(["{s*{varname}s*}"],["\\{\\s*{varname}\\s*\\}"])));var st=["String","Number","Boolean","Object","Array","Function","Error","Symbol","RegExp","Date","Null","Undefined","Set","Map","WeakSet","WeakMap"];function it(e){var t,r;if(!e)return[];var a=ve.default(t=me.default(r=me.default(e).call(e).substr(1)).call(r).split("|")).call(t,(function(e){return me.default(e).call(e)}));return ve.default(a).call(a,(function(e){var t=ye.default(e).call(e,"("),r=je.default(e).call(e,")");if(-1!==t&&-1!==r){var a,n,l=me.default(a=e.substr(t+1,r-t-1)).call(a),u=""==l?[]:ve.default(n=l.split(",")).call(n,(function(e){if(e=me.default(e).call(e),!isNaN(ke.default(e)))return ke.default(e);if(_e.default(e).call(e,'"')&&xe.default(e).call(e,'"')||_e.default(e).call(e,"'")&&xe.default(e).call(e,"'"))return e.substr(1,e.length-2);if("true"===e.toLowerCase()||"false"===e.toLowerCase())return"true"===e.toLowerCase();if(!(_e.default(e).call(e,"{")&&xe.default(e).call(e,"}")||_e.default(e).call(e,"[")&&xe.default(e).call(e,"]")))return String(e);try{return JSON.parse(e)}catch(t){return String(e)}}));return[e.substr(0,t),u]}return[e,[]]}))}function ct(e,t){var r,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=e,l=Le.default({replaceAll:!0},a);for(lt.lastIndex=0;null!==(r=lt.exec(n));){var u=r.groups.varname||"",s=it(r.groups.formatters);if("function"==typeof t)try{n=we.default(l)?we.default(n).call(n,r[0],t(u,s,r[0])):n.replace(r[0],t(u,s,r[0]))}catch(e){break}lt.lastIndex=0}return n}function ot(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;e.$cache={activeLanguage:t,typedFormatters:{},formatters:{}}}function ft(e,t,r){var a,n=[],l=Ge(r);try{var u=function(){var r=a.value;if(r[0]){var l=function(e,t,r){if(e.$cache||ot(e),e.$cache.activeLanguage===t){if(r in e.$cache.formatters)return e.$cache.formatters[r]}else ot(e,t);for(var a=0,n=[e.formatters,e.global.formatters];a<n.length;a++){var l=n[a];if(t in l){var u=l[t]||{};if(r in u&&"function"==typeof u[r])return e.$cache.formatters[r]=u[r]}var s=l["*"]||{};if(r in s&&"function"==typeof s[r])return e.$cache.formatters[r]=s[r]}}(e,t,r[0]);"function"==typeof l?n.push((function(e){var t;return l.apply(void 0,$e.default(t=[e]).call(t,ce.default(r[1])))})):n.push((function(e){var t,a;return"function"==typeof e[r[0]]?(t=e[r[0]]).call.apply(t,$e.default(a=[e]).call(a,ce.default(r[1]))):e}))}};for(l.s();!(a=l.n()).done;)u()}catch(e){l.e(e)}finally{l.f()}return n}function dt(e,t,r,a){var n=ft(e,t,r),l=function(e,t,r){if(e.$cache||ot(e),e.$cache.activeLanguage===t){if(r in e.$cache.typedFormatters)return e.$cache.typedFormatters[r]}else ot(e,t);for(var a=0,n=[e.formatters,e.global.formatters];a<n.length;a++){var l=n[a];if(l){if(t in l&&et(l[t].$types)){var u=l[t].$types;if(r in u&&"function"==typeof u[r])return e.$cache.typedFormatters[r]=u[r]}if("*"in l&&et(l["*"].$types)){var s=l["*"].$types;if(r in s&&"function"==typeof s[r])return e.$cache.typedFormatters[r]=s[r]}}}}(e,t,Xe(a));return l&&Fe.default(n).call(n,0,0,l),a=function(e,t){if(0===t.length)return e;var r=e;try{var a,n=Ge(t);try{for(n.s();!(a=n.n()).done;){var l=a.value;if("function"!=typeof l)return r;r=l(r)}}catch(e){n.e(e)}finally{n.f()}}catch(t){var u;console.error($e.default(u="Error while execute i18n formatter for ".concat(e,": ")).call(u,t.message," "))}return r}(a,n),a}function gt(e){for(var t=this,r=t.global.activeLanguage,a=arguments.length,n=new Array(a>1?a-1:0),l=1;l<a;l++)n[l-1]=arguments[l];if(0===n.length||!ut(e))return e;if(1===n.length&&et(n[0])){var u=n[0];return ct(e,(function(e,a){var n=e in u?u[e]:"";return dt(t,r,a,n)}))}var s=1===n.length&&Se.default(n[0])?ce.default(n[0]):n;if(0===s.length)return e;var i=0;return ct(e,(function(e,a){if(s.length>i)return dt(t,r,a,s[i++]);throw new Error}),{replaceAll:!1})}var ht={defaultLanguage:"zh",activeLanguage:"zh",languages:[{name:"zh",title:"中文",default:!0},{name:"en",title:"英文"}],formatters:nt};function bt(e){return ke.default(e)>0}function pt(e,t){try{return Se.default(e)?e.length>t?e[t]:e[e.length-1]:e}catch(t){return Se.default(e)?e[0]:e}}function vt(e){var t,r,a,n,l,u,s,i;return we.default(t=we.default(r=we.default(a=we.default(n=we.default(l=we.default(u=we.default(s=we.default(i=we.default(e).call(e,/\\(?![trnbvf'"]{1})/g,"\\\\")).call(i,"\t","\\t")).call(s,"\n","\\n")).call(u,"\b","\\b")).call(l,"\r","\\r")).call(n,"\f","\\f")).call(a,"'","\\'")).call(r,'"','\\"')).call(t,"\v","\\v")}function mt(e){var t,r,a,n,l,u,s,i;return we.default(t=we.default(r=we.default(a=we.default(n=we.default(l=we.default(u=we.default(s=we.default(i=we.default(e).call(e,"\\t","\t")).call(i,"\\n","\n")).call(s,"\\b","\b")).call(u,"\\r","\r")).call(l,"\\f","\f")).call(n,"\\'","'")).call(a,'\\"','"')).call(r,"\\v","\v")).call(t,/\\\\(?![trnbvf'"]{1})/g,"\\")}var yt=function(e){de.default(s,e);var t,r,a,n,l,u=We(s);function s(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return ae.default(this,s),e=u.call(this),null!=s.instance||(s.instance=le.default(e),e._settings=tt(ht,t),e._scopes=[],e._defaultMessageLoader=null),ue.default(e,s.instance)}return ne.default(s,[{key:"settings",get:function(){return this._settings}},{key:"scopes",get:function(){return this._scopes}},{key:"activeLanguage",get:function(){return this._settings.activeLanguage}},{key:"defaultLanguage",get:function(){return this._settings.defaultLanguage}},{key:"languages",get:function(){return this._settings.languages}},{key:"formatters",get:function(){return nt}},{key:"defaultMessageLoader",get:function(){return this._defaultMessageLoader}},{key:"loadMessagesFromDefaultLoader",value:(l=re.default(he.default.mark((function e(t,r){return he.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("function"==typeof this._defaultMessageLoader){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,this._defaultMessageLoader.call(r,t,r);case 4:return e.abrupt("return",e.sent);case 5:case"end":return e.stop()}}),e,this)}))),function(e,t){return l.apply(this,arguments)})},{key:"change",value:(n=re.default(he.default.mark((function e(t){var r;return he.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=me.default(t).call(t),-1===qe.default(r=this.languages).call(r,(function(e){return e.name===t}))&&"function"!=typeof this._defaultMessageLoader){e.next=9;break}return e.next=4,this._refreshScopes(t);case 4:return this._settings.activeLanguage=t,e.next=7,this.emit(t);case 7:e.next=10;break;case 9:throw new Error("Not supported language:"+t);case 10:case"end":return e.stop()}}),e,this)}))),function(e){return n.apply(this,arguments)})},{key:"_refreshScopes",value:(a=re.default(he.default.mark((function e(t){var r,a;return he.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,a=ve.default(r=this._scopes).call(r,(function(e){return e.refresh(t)})),!Ie.default.allSettled){e.next=7;break}return e.next=5,Ie.default.allSettled(a);case 5:e.next=9;break;case 7:return e.next=9,Ie.default.all(a);case 9:e.next=14;break;case 11:e.prev=11,e.t0=e.catch(0),console.warn("Error while refreshing i18n scopes:",e.t0.message);case 14:case"end":return e.stop()}}),e,this,[[0,11]])}))),function(e){return a.apply(this,arguments)})},{key:"register",value:(r=re.default(he.default.mark((function e(t){return he.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t instanceof at){e.next=2;break}throw new TypeError("Scope must be an instance of I18nScope");case 2:return this._scopes.push(t),e.next=5,t.refresh(this.activeLanguage);case 5:case"end":return e.stop()}}),e,this)}))),function(e){return r.apply(this,arguments)})},{key:"registerFormatter",value:function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},a=r.language,n=void 0===a?"*":a;if("function"===!ie.default(t)||"string"!=typeof e)throw new TypeError("Formatter must be a function");pe.default(st).call(st,e)?this.formatters[n].$types[e]=t:this.formatters[n][e]=t}},{key:"registerDefaultLoader",value:function(e){if("function"!=typeof e)throw new Error("The default loader must be a async function or promise returned");this._defaultMessageLoader=e,this.refresh()}},{key:"refresh",value:(t=re.default(he.default.mark((function e(){var t,r;return he.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,r=ve.default(t=this._scopes).call(t,(function(e){return e.refresh()})),!Ie.default.allSettled){e.next=7;break}return e.next=5,Ie.default.allSettled(r);case 5:e.next=9;break;case 7:return e.next=9,Ie.default.all(r);case 9:e.next=13;break;case 11:e.prev=11,e.t0=e.catch(0);case 13:case"end":return e.stop()}}),e,this,[[0,11]])}))),function(){return t.apply(this,arguments)})}]),s}(rt),jt={getInterpolatedVars:function(e){var t=[];return ct(e,(function(e,r,a){var n={name:e,formatters:ve.default(r).call(r,(function(e){var t=oe.default(e,2);return{name:t[0],args:t[1]}})),match:a};return-1===qe.default(t).call(t,(function(e){return e.name===n.name&&n.formatters.toString()==e.formatters.toString()}))&&t.push(n),""})),t},replaceInterpolatedVars:gt,I18nManager:yt,translate:function(e){var t=this,r=t.global.activeLanguage,a=e,n=[],l=[],u=null;if("string"===!ie.default(e))return e;try{var s,i;if(2===arguments.length&&et(arguments[1]))Ee.default(s=De.default(arguments[1])).call(s,(function(e){var t=oe.default(e,2),r=t[0],a=t[1];if("function"==typeof a)try{n[r]=a()}catch(e){n[r]=a}_e.default(r).call(r,"$")&&"number"==typeof n[r]&&l.push(r)})),n=[arguments[1]];else if(arguments.length>=2){var c,o;n=ve.default(c=Fe.default(o=Ae.default(Array.prototype).call(arguments)).call(o,1)).call(c,(function(e,t){try{e="function"==typeof e?e():e,Ze(e)&&(u=ke.default(e))}catch(e){}return e}))}if(r===t.defaultLanguage)bt(a)&&(a=t.default[a]||e);else{var f=bt(a)?a:t.idMap[vt(a)];a=t.messages[f]||a,a=Se.default(a)?ve.default(a).call(a,(function(e){return mt(e)})):mt(a)}return Se.default(a)&&a.length>0&&(a=null!==u?pt(a,u):pluralVar.length>0?pt(a,ke.default(n(pluralVar[0]))):a[0]),0==n.length?a:gt.call.apply(gt,$e.default(i=[t,a]).call(i,ce.default(n)))}catch(e){return a}},i18nScope:at,defaultLanguageSettings:ht,getDataTypeName:Xe,isNumber:Ze,isPlainObject:et};module.exports=jt;
//# sourceMappingURL=index.cjs.map
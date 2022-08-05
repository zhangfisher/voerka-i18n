import{_ as n}from"./plugin-vue_export-helper.21dcd24c.js";import{o as s,c as a,a as e}from"./app.b89ccf08.js";const t={},o=e(`<h1 id="i18nscope" tabindex="-1"><a class="header-anchor" href="#i18nscope" aria-hidden="true">#</a> i18nScope</h1><p>\u6BCF\u4E2A\u5DE5\u7A0B\u4F1A\u521B\u5EFA\u4E00\u4E2A<code>i18nScope</code>\u5B9E\u4F8B\u3002</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> i18nScope <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./languages&quot;</span>

<span class="token comment">// \u8BA2\u9605\u8BED\u8A00\u5207\u6362\u4E8B\u4EF6</span>
i18nScope<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">newLanguage</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token punctuation">{</span><span class="token operator">...</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token comment">// \u53D6\u6D88\u8BED\u8A00\u5207\u6362\u4E8B\u4EF6\u8BA2\u9605</span>
i18nScope<span class="token punctuation">.</span><span class="token function">off</span><span class="token punctuation">(</span>callback<span class="token punctuation">)</span>
<span class="token comment">// \u5F53\u524D\u4F5C\u7528\u57DF\u914D\u7F6E</span>
i18nScope<span class="token punctuation">.</span>settings
<span class="token comment">// \u5F53\u524D\u8BED\u8A00</span>
i18nScope<span class="token punctuation">.</span>activeLanguage         <span class="token comment">// \u5982zh</span>

<span class="token comment">// \u9ED8\u8BA4\u8BED\u8A00</span>
i18nScope<span class="token punctuation">.</span>defaultLanguage         
<span class="token comment">// \u8FD4\u56DE\u5F53\u524D\u652F\u6301\u7684\u8BED\u8A00\u5217\u8868\uFF0C\u53EF\u4EE5\u7528\u6765\u663E\u793A</span>
i18nScope<span class="token punctuation">.</span>languages    <span class="token comment">// [{name:&quot;zh&quot;,title:&quot;\u4E2D\u6587&quot;},{name:&quot;en&quot;,title:&quot;\u82F1\u6587&quot;},...]</span>
<span class="token comment">// \u8FD4\u56DE\u5F53\u524D\u4F5C\u7528\u57DF\u7684\u683C\u5F0F\u5316\u5668                         </span>
i18nScope<span class="token punctuation">.</span>formatters   
<span class="token comment">// \u5F53\u524D\u4F5C\u7528id</span>
i18nScope<span class="token punctuation">.</span>id
<span class="token comment">// \u5207\u6362\u8BED\u8A00\uFF0C\u5F02\u6B65\u51FD\u6570</span>
<span class="token keyword">await</span> i18nScope<span class="token punctuation">.</span><span class="token function">change</span><span class="token punctuation">(</span>newLanguage<span class="token punctuation">)</span>
<span class="token comment">// \u5F53\u524D\u8BED\u8A00\u5305                         </span>
i18nScope<span class="token punctuation">.</span>messages        <span class="token comment">// {1:&quot;...&quot;,2:&quot;...&quot;,&quot;3&quot;:&quot;...&quot;}</span>
<span class="token comment">// \u5F15\u7528\u5168\u5C40VoerkaI18n\u5B9E\u4F8B                         </span>
i18nScope<span class="token punctuation">.</span>global
<span class="token comment">// \u6CE8\u518C\u5F53\u524D\u4F5C\u7528\u57DF\u683C\u5F0F\u5316\u5668</span>
i18nScope<span class="token punctuation">.</span><span class="token function">registerFormatter</span><span class="token punctuation">(</span>name<span class="token punctuation">,</span>formatter<span class="token punctuation">,</span><span class="token punctuation">{</span><span class="token literal-property property">language</span><span class="token operator">:</span><span class="token string">&quot;*&quot;</span><span class="token punctuation">}</span><span class="token punctuation">)</span>      
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3),p=[o];function c(i,l){return s(),a("div",null,p)}var d=n(t,[["render",c],["__file","i18nscope.html.vue"]]);export{d as default};
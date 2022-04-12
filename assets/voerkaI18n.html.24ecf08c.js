import{_ as n,c as a}from"./app.7363afea.js";const s={},p=a(`<h1 id="voerkai18n" tabindex="-1"><a class="header-anchor" href="#voerkai18n" aria-hidden="true">#</a> VoerkaI18n</h1><p>\u5F53<code>import {} form &quot;./languages&quot;</code>\u65F6\u4F1A\u81EA\u52A8\u521B\u5EFA\u5168\u5C40\u5355<code>VoerkaI18n</code></p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token comment">// \u8BA2\u9605\u8BED\u8A00\u5207\u6362\u4E8B\u4EF6</span>
VoerkaI18n<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">newLanguage</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token punctuation">{</span><span class="token operator">...</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token comment">// \u53D6\u6D88\u8BED\u8A00\u5207\u6362\u4E8B\u4EF6\u8BA2\u9605</span>
VoerkaI18n<span class="token punctuation">.</span><span class="token function">off</span><span class="token punctuation">(</span>callback<span class="token punctuation">)</span>
<span class="token comment">// \u53D6\u6D88\u6240\u6709\u8BED\u8A00\u5207\u6362\u4E8B\u4EF6\u8BA2\u9605</span>
VoerkaI18n<span class="token punctuation">.</span><span class="token function">offAll</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                              
<span class="token comment">// \u8FD4\u56DE\u5F53\u524D\u9ED8\u8BA4\u8BED\u8A00</span>
VoerkaI18n<span class="token punctuation">.</span>defaultLanguage
<span class="token comment">// \u8FD4\u56DE\u5F53\u524D\u6FC0\u6D3B\u8BED\u8A00</span>
VoerkaI18n<span class="token punctuation">.</span>activeLanguage
<span class="token comment">// \u8FD4\u56DE\u5F53\u524D\u652F\u6301\u7684\u8BED\u8A00</span>
VoerkaI18n<span class="token punctuation">.</span>languages                              
<span class="token comment">// \u5207\u6362\u8BED\u8A00</span>
<span class="token keyword">await</span> VoerkaI18n<span class="token punctuation">.</span><span class="token function">change</span><span class="token punctuation">(</span>newLanguage<span class="token punctuation">)</span>
<span class="token comment">// \u8FD4\u56DE\u5168\u5C40\u683C\u5F0F\u5316\u5668</span>
VoerkaI18n<span class="token punctuation">.</span>formatters                              
<span class="token comment">// \u6CE8\u518C\u5168\u5C40\u683C\u5F0F\u5316\u5668</span>
VoerkaI18n<span class="token punctuation">.</span><span class="token function">registerFormatter</span><span class="token punctuation">(</span>name<span class="token punctuation">,</span>formatter<span class="token punctuation">,</span><span class="token punctuation">{</span><span class="token literal-property property">language</span><span class="token operator">:</span><span class="token string">&quot;*&quot;</span><span class="token punctuation">}</span><span class="token punctuation">)</span>                              
                              
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div>`,3);function e(t,o){return p}var l=n(s,[["render",e],["__file","voerkaI18n.html.vue"]]);export{l as default};

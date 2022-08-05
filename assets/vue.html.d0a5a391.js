import{_ as n}from"./plugin-vue_export-helper.21dcd24c.js";import{o as s,c as a,a as t}from"./app.b89ccf08.js";const p={},e=t(`<h1 id="vue\u5E94\u7528" tabindex="-1"><a class="header-anchor" href="#vue\u5E94\u7528" aria-hidden="true">#</a> Vue\u5E94\u7528</h1><p>\u521B\u5EFA<code>Vue</code>\u5E94\u7528\u53EF\u4EE5\u91C7\u7528<code>Vite</code>\u6216<code>Vue Cli</code>\u6765\u521B\u5EFA\u5DE5\u7A0B\u3002</p><p>\u5728<code>Vue3</code>\u5E94\u7528\u4E2D\u5F15\u5165<code>voerkai18n</code>\u6765\u6DFB\u52A0\u56FD\u9645\u5316\u5E94\u7528\u9700\u8981\u7531\u4E24\u4E2A\u63D2\u4EF6\u6765\u7B80\u5316\u5E94\u7528\u3002</p><ul><li><p><strong>@voerkai18n/vue</strong></p><p><strong>Vue\u63D2\u4EF6</strong>\uFF0C\u5728\u521D\u59CB\u5316<code>Vue</code>\u5E94\u7528\u65F6\u5F15\u5165\uFF0C\u63D0\u4F9B\u8BBF\u95EE<code>\u5F53\u524D\u8BED\u8A00</code>\u3001<code>\u5207\u6362\u8BED\u8A00</code>\u3001<code>\u81EA\u52A8\u66F4\u65B0</code>\u7B49\u529F\u80FD\u3002</p></li><li><p><strong>@voerkai18n/vite</strong></p><p><strong>Vite\u63D2\u4EF6</strong>\uFF0C\u5728<code>vite.config.js</code>\u4E2D\u914D\u7F6E\uFF0C\u7528\u6765\u5B9E\u73B0<code>\u81EA\u52A8\u6587\u672C\u6620\u5C04</code>\u3001<code>\u81EA\u52A8\u5BFC\u5165t\u51FD\u6570</code>\u7B49\u529F\u80FD\u3002</p></li></ul><p><code>@voerkai18n/vue</code>\u548C<code>@voerkai18n/vite</code>\u4E24\u4EF6\u63D2\u4EF6\u76F8\u4E92\u914D\u5408\uFF0C\u5B89\u88C5\u914D\u7F6E\u597D\u8FD9\u4E24\u4E2A\u63D2\u4EF6\u540E\uFF0C\u5C31\u53EF\u4EE5\u5728<code>Vue</code>\u6587\u4EF6\u4F7F\u7528\u591A\u8BED\u8A00<code>t</code>\u51FD\u6570\u3002</p><p>\u4EE5\u4E0B\u4ECB\u7ECD\u5F53\u91C7\u7528<code>Vite</code>\u521B\u5EFA\u5E94\u7528\u65F6\uFF0C\u5982\u4F55\u5F15\u5165<code>Voerkai18n</code>\u3002</p><h2 id="\u7B2C\u4E00\u6B65-\u5F15\u5165" tabindex="-1"><a class="header-anchor" href="#\u7B2C\u4E00\u6B65-\u5F15\u5165" aria-hidden="true">#</a> \u7B2C\u4E00\u6B65\uFF1A\u5F15\u5165</h2><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token comment">// \u521D\u59CB\u5316\u5DE5\u7A0B</span>
<span class="token operator">&gt;</span> voerka18n init
<span class="token comment">// \u63D0\u53D6\u8981\u7FFB\u8BD1\u7684\u6587\u672C\u5230src/languages/translates/*.json</span>
<span class="token operator">&gt;</span> voerkai18n extract
<span class="token comment">// \u8FDB\u884C\u4EBA\u5DE5\u7FFB\u8BD1\u6216\u81EA\u52A8\u7FFB\u8BD1(\u767E\u5EA6)</span>
<span class="token operator">&gt;</span> voerkai18n translate <span class="token operator">--</span>apikey xxxx <span class="token operator">--</span>apiid xxxxx
<span class="token comment">// \u7F16\u8BD1\u8BED\u8A00\u5305</span>
<span class="token operator">&gt;</span> voerkai18n compile 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="\u7B2C\u4E8C\u6B65-\u5BFC\u5165t\u7FFB\u8BD1\u51FD\u6570" tabindex="-1"><a class="header-anchor" href="#\u7B2C\u4E8C\u6B65-\u5BFC\u5165t\u7FFB\u8BD1\u51FD\u6570" aria-hidden="true">#</a> \u7B2C\u4E8C\u6B65\uFF1A\u5BFC\u5165<code>t</code>\u7FFB\u8BD1\u51FD\u6570</h2><p>\u65E0\u8BBA\u91C7\u7528\u4F55\u79CD\u5DE5\u5177\u521B\u5EFA<code>Vite</code>\u5E94\u7528\uFF0C\u5747\u53EF\u4EE5\u76F4\u63A5\u4ECE<code>languages</code>\u76F4\u63A5\u5BFC\u5165<code>t</code>\u51FD\u6570\u3002</p><div class="language-vue ext-vue line-numbers-mode"><pre class="language-vue"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">setup</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">  
<span class="token keyword">import</span> <span class="token punctuation">{</span> t <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./languages&quot;</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u53D6\u51B3\u4E8E\u60A8\u662F\u4ECE\u54EA\u4E00\u4E2A\u6587\u4EF6\u4E2D\u5BFC\u5165\uFF0C\u9700\u8981\u4FEE\u6539\u5BFC\u5165\u4F4D\u7F6E\uFF0C\u53EF\u80FD\u7C7B\u4F3C\u8FD9\u6837\uFF1A</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> t <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./languages&quot;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> t <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;../languages&quot;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> t <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;../../languages&quot;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> t <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;../../../languages&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u5BFC\u5165<code>t</code>\u51FD\u6570\u540E\u5C31\u53EF\u4EE5\u76F4\u63A5\u4F7F\u7528\u4E86\u3002</p><div class="language-vue ext-vue line-numbers-mode"><pre class="language-vue"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Script</span> <span class="token attr-name">setup</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token comment">// \u5982\u679C\u6CA1\u6709\u5728vite.config.js\u4E2D\u914D\u7F6E\`@voerkai18n/vite\`\u63D2\u4EF6\uFF0C\u5219\u9700\u8981\u624B\u5DE5\u5BFC\u5165t\u51FD\u6570</span>
<span class="token comment">// import { t } from &quot;./languages&quot;</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Script</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
    <span class="token function">data</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token punctuation">{</span>
            <span class="token literal-property property">username</span><span class="token operator">:</span><span class="token string">&quot;&quot;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">password</span><span class="token operator">:</span><span class="token string">&quot;&quot;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">title</span><span class="token operator">:</span><span class="token function">t</span><span class="token punctuation">(</span><span class="token string">&quot;\u8BA4\u8BC1&quot;</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token literal-property property">methods</span><span class="token operator">:</span><span class="token punctuation">{</span>
        <span class="token function">login</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            <span class="token function">alert</span><span class="token punctuation">(</span><span class="token function">t</span><span class="token punctuation">(</span><span class="token string">&quot;\u767B\u5F55&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
	<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">&gt;</span></span>{{ t(&quot;\u8BF7\u8F93\u5165\u7528\u6237\u540D\u79F0&quot;) }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span><span class="token punctuation">&gt;</span></span>{{t(&quot;\u7528\u6237\u540D:&quot;)}}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>text<span class="token punctuation">&quot;</span></span> <span class="token attr-name">:placeholder</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>t(<span class="token punctuation">&#39;</span>\u90AE\u4EF6/\u624B\u673A\u53F7\u7801/\u5E10\u53F7<span class="token punctuation">&#39;</span>)<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span><span class="token punctuation">&gt;</span></span>{{t(&quot;\u5BC6\u7801:&quot;)}}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>password<span class="token punctuation">&quot;</span></span> <span class="token attr-name">:placeholder</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>t(<span class="token punctuation">&#39;</span>\u81F3\u5C116\u4F4D\u7684\u5BC6\u7801<span class="token punctuation">&#39;</span>)<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>            
    	<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>            
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>login<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>{{t(&quot;\u767B\u5F55&quot;)}}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="\u7B2C\u4E09\u6B65-\u81EA\u52A8\u5BFC\u5165t\u7FFB\u8BD1\u51FD\u6570" tabindex="-1"><a class="header-anchor" href="#\u7B2C\u4E09\u6B65-\u81EA\u52A8\u5BFC\u5165t\u7FFB\u8BD1\u51FD\u6570" aria-hidden="true">#</a> \u7B2C\u4E09\u6B65\uFF1A\u81EA\u52A8\u5BFC\u5165<code>t</code>\u7FFB\u8BD1\u51FD\u6570</h2><p>\u5F53\u6E90\u7801\u6587\u4EF6\u975E\u5E38\u591A\u65F6\uFF0C\u624B\u52A8\u5BFC\u5165<code>t</code>\u51FD\u6570\u6BD4\u8F83\u9EBB\u70E6\uFF0C\u6211\u4EEC\u63D0\u4F9B\u4E86<code>vite</code>\u548C<code>babel</code>\u4E24\u4E2A\u63D2\u4EF6\u53EF\u4EE5\u5B9E\u73B0\u81EA\u52A8\u5BFC\u5165<code>t</code>\u51FD\u6570\u3002 \u5982\u679C\u5E94\u7528\u662F\u91C7\u7528<code>Vite</code>+<code>@vitejs/plugin-vite</code>\u521B\u5EFA\u7684\u5DE5\u7A0B\uFF0C\u5219\u53EF\u4EE5\u901A\u8FC7\u914D\u7F6E<code>@voerkai18n/vite</code>\u63D2\u4EF6\u5B9E\u73B0\u81EA\u52A8\u5BFC\u5165<code>t</code>\u51FD\u6570\u3002</p><p>\u8BE6\u89C1<code>@voerkai18n/vite</code>\u63D2\u4EF6\u4ECB\u7ECD\u3002</p><p><strong>\u91CD\u70B9\uFF1A<code>t</code>\u51FD\u6570\u4F1A\u5728\u4F7F\u7528<code>@voerkai18n/vite</code>\u63D2\u4EF6\u540E\u81EA\u52A8\u6CE8\u5165\uFF0C\u56E0\u6B64\u5728<code>Vue</code>\u6587\u4EF6\u4E2D\u53EF\u4EE5\u76F4\u63A5\u4F7F\u7528\u3002</strong></p><h2 id="\u7B2C\u56DB\u6B65-\u5207\u6362\u8BED\u8A00" tabindex="-1"><a class="header-anchor" href="#\u7B2C\u56DB\u6B65-\u5207\u6362\u8BED\u8A00" aria-hidden="true">#</a> \u7B2C\u56DB\u6B65\uFF1A\u5207\u6362\u8BED\u8A00</h2><p>\u5F15\u5165<code>@voerkai18n/vue</code>\u63D2\u4EF6\u6765\u5B9E\u73B0\u5207\u6362\u8BED\u8A00\u548C\u81EA\u52A8\u91CD\u65B0\u6E32\u67D3\u7684\u529F\u80FD\u3002</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code>    <span class="token keyword">import</span> <span class="token punctuation">{</span> createApp <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue&#39;</span>
    <span class="token keyword">import</span> Root <span class="token keyword">from</span> <span class="token string">&#39;./App.vue&#39;</span>
    <span class="token keyword">import</span> i18nPlugin <span class="token keyword">from</span> <span class="token string">&#39;@voerkai18n/vue&#39;</span>
    <span class="token keyword">import</span> <span class="token punctuation">{</span> i18nScope <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./languages&#39;</span>
    <span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token function">createApp</span><span class="token punctuation">(</span>Root<span class="token punctuation">)</span>
    app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>i18nPlugin<span class="token punctuation">,</span><span class="token punctuation">{</span> i18nScope <span class="token punctuation">}</span><span class="token punctuation">)</span>   <span class="token comment">// \u91CD\u70B9\uFF0C\u9700\u8981\u5F15\u5165i18nScope</span>
    app<span class="token punctuation">.</span><span class="token function">mount</span><span class="token punctuation">(</span><span class="token string">&#39;#app&#39;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>@voerkai18n/vue</code>\u63D2\u4EF6\u5B89\u88C5\u540E,\u63D0\u4F9B\u4E86\u4E00\u4E2A<code>i18n</code>\u5B9E\u4F8B\uFF0C\u53EF\u4EE5\u5728\u7EC4\u4EF6\u4E2D\u8FDB\u884C<code>inject</code>\u3002\u5C31\u53EF\u4EE5\u6309\u5982\u4E0B\u65B9\u5F0F\u4F7F\u7528\uFF1A</p><div class="language-vue ext-vue line-numbers-mode"><pre class="language-vue"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">inject</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;i18n&#39;</span><span class="token punctuation">]</span>          <span class="token comment">// \u6B64\u503C\u7531\`@voerkai18n/vue\`\u63D2\u4EF6\u63D0\u4F9B</span>
<span class="token punctuation">}</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>  
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>img</span> <span class="token attr-name">alt</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>Vue logo<span class="token punctuation">&quot;</span></span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>./assets/logo.png<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">&gt;</span></span>{{ t(&quot;\u4E2D\u534E\u4EBA\u6C11\u5171\u548C\u56FD&quot;)}} <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h2</span><span class="token punctuation">&gt;</span></span>{{ t(&quot;\u8FCE\u63A5\u4E2D\u534E\u6C11\u65CF\u7684\u4F1F\u5927\u590D\u5174&quot;)}} <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h2</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h5</span><span class="token punctuation">&gt;</span></span>\u9ED8\u8BA4\u8BED\u8A00\uFF1A{{ i18n.defaultLanguage }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h5</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h5</span><span class="token punctuation">&gt;</span></span>\u5F53\u524D\u8BED\u8A00\uFF1A{{ i18n.activeLanguage.value }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h5</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">v-for</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>lng of i18n.languages<span class="token punctuation">&quot;</span></span> <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>i18n.activeLanguage = lng.name<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>{{ lng.title }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>\u8BF4\u660E\uFF1A</strong></p><ul><li>\u4E8B\u5B9E\u4E0A\uFF0C\u5C31\u7B97\u6CA1\u6709<code>@voerkai18n/vue</code>\u548C<code>@voerkai18n/vite</code>\u4E24\u4EF6\u63D2\u4EF6\u76F8\u4E92\u914D\u5408\uFF0C\u53EA\u9700\u8981\u5BFC\u5165<code>t</code>\u51FD\u6570\u4E5F\u5C31\u53EF\u4EE5\u76F4\u63A5\u4F7F\u7528\u3002\u8FD9\u4E24\u4E2A\u63D2\u4EF6\u53EA\u662F\u5F88\u7B80\u5355\u7684\u5C01\u88C5\u800C\u5DF2\u3002</li><li>\u5982\u679C\u8981\u5728\u5E94\u7528\u4E2D\u8FDB\u884C<code>\u8BED\u8A00\u52A8\u6001\u5207\u6362</code>\uFF0C\u5219\u9700\u8981\u5728\u5E94\u7528\u4E2D\u5F15\u5165<code>@voerkai18n/vue</code>\uFF0C\u8BF7\u53C2\u9605<code>@voerkai18n/vue</code>\u63D2\u4EF6\u4F7F\u7528\u8BF4\u660E\u3002</li><li><code>@voerkai18n/vite</code>\u7684\u4F7F\u7528\u8BF7\u53C2\u9605\u540E\u7EED\u8BF4\u660E\u3002</li></ul>`,26),o=[e];function c(l,i){return s(),a("div",null,o)}var r=n(p,[["render",c],["__file","vue.html.vue"]]);export{r as default};
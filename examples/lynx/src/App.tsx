import './App.css' 
import reactLynxLogo from './assets/react-logo.png'
import { Translate } from './languages'
import { LanguageBar } from './components/LanguageBar'

export function App() {


  return (
    <view>
      <view className='Background' />
      <view className='App'>
        <view className='Banner'>
          <view className='Logo'>            
            <image src={reactLynxLogo} className='Logo--react' />
          </view>
          <LanguageBar />
          <text className='Title'>
              <Translate message="欢迎使用" />
          </text>
          <text className='Subtitle'>
            <Translate message="一站式全流程解决方案" />
          </text>
        </view>
        <view className='Content'> 
          <text className='Hint'> 
            <Translate id="about">
           VoerkaI18n是一款功能强大的现代化前端多语言框架，致力于为开发者提供灵活、高效且全链路的国际化支持。其核心优势在于深度适配主流技术生态，无缝支持Vue、React、SolidJS、Svelte等前端框架，并兼容Node.js服务端及原生JavaScript项目，真正实现跨平台多场景覆盖。
该方案创新性地提出了“全自动化翻译工作流”，通过智能CLI工具自动扫描源码提取待翻译文本，结合可视化编辑器实现翻译协作，大幅降低人工维护成本。其运行时动态加载能力支持语言包按需加载，显著优化性能。功能上，除基础的变量插值、复数规则、日期货币格式化外，还提供强大的上下文敏感翻译、微翻译模式（精准更新局部内容）及智能诊断工具，可自动检测翻译覆盖率与语法错误。
VoerkaI18n的突破性设计体现在“去中心化”管理架构，开发者可将翻译文件与代码库解耦，通过轻量级API实现云端协同。其类型安全的TypeScript支持和响应式语言切换机制，进一步提升了开发体验。无论是轻量应用还是大型工程，VoerkaI18n均以高扩展性和极简API重新定义了国际化开发范式，成为全球化项目的理想之选。
            </Translate>
          </text>
        </view>
        <view style={{ flex: 1 }}></view>
      </view>
    </view>
  )
}

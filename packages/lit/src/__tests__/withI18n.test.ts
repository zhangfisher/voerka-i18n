import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { LitElement, html } from 'lit'
import { withI18n } from '../withI18n'
import { VoerkaI18nScope } from '@voerkai18n/runtime'

// 模拟 VoerkaI18nScope
const mockScope = {
  on: vi.fn(() => ({ off: vi.fn() })),
  t: vi.fn((text) => `translated: ${text}`),
  $t: vi.fn((text) => `translated: ${text}`),
  activeLanguage: 'en-US',
  defaultLanguage: 'zh-CN',
  languages: [{ name: 'en-US' }, { name: 'zh-CN' }],
  activeParagraphs: { test: 'test paragraph' },
  change: vi.fn(),
} as unknown as VoerkaI18nScope

describe('withI18n', () => {
  class TestElement extends LitElement {
    render() {
      return html`<div>Test</div>`
    }
  }

  const I18nElement = withI18n(TestElement, mockScope)
  let element: InstanceType<typeof I18nElement>

  beforeEach(() => {
    element = new I18nElement()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should subscribe to language changes', () => {
    expect(mockScope.on).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('should provide t method', () => {
    expect(element.t).toBe(mockScope.t)
    element.t('test')
    expect(mockScope.t).toHaveBeenCalledWith('test')
  })

  it('should provide $t method', () => {
    expect(element.$t).toBe(mockScope.$t)
  })

  it('should provide language properties', () => {
    expect(element.lang).toBe('en-US')
    expect(element.defaultLanguage).toBe('zh-CN')
    expect(element.languages).toEqual([{ name: 'en-US' }, { name: 'zh-CN' }])
  })

  it('should provide paragraphs', () => {
    expect(element.paragraphs).toEqual({ test: 'test paragraph' })
  })

  it('should provide setLanguage method', () => {
    element.setLanguage('zh-CN')
    expect(mockScope.change).toHaveBeenCalledWith('zh-CN')
  })
})
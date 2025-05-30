import { ExtractSections } from '../types'

const litSchema: ExtractSections = [
  {
    name: ['script'],
    type: 'ast',
    extract: /class\s+[\w\d_$]+\s+extends\s+LitElement[\s\S]*?\{[\s\S]*?\}/g,
    tFuncNames: ['t', '$t'],
    tComponentNames: ['lit-translate']
  },
  {
    name: ['render'],
    type: 'ast',
    extract: {
      include: [/render\s*\(\)\s*\{[\s\S]*?\}/g],
      exclude: [/\/\/.*$/gm, /\/\*[\s\S]*?\*\//g]
    },
    tFuncNames: ['t', '$t', 'this.t', 'this.$t'],
    tComponentNames: ['lit-translate']
  },
  {
    name: ['decorator'],
    type: 'ast',
    extract: /@customElement\(['"]([^'"]+)['"]\)/g,
    tFuncNames: [],
    tComponentNames: []
  }
]

export default litSchema
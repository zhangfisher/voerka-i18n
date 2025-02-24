import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
  rules:{
    "no-console": "off",
    "jsonc/sort-keys": "off",
    "no-multiple-empty-lines": "off",
    
  }
})

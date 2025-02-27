import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
  rules:{
    "no-console": "off",
    "jsonc/sort-keys": "off",
    "no-multiple-empty-lines": "off",
    "style/comma-dangle": "off",
    "antfu/if-newline": "off",
    "style/indent": "off",
  }
})

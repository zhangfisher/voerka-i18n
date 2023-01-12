module.exports = {
    "presets": [
      [
        "@babel/preset-env",
        {
          "useBuiltIns": "usage",
          "debug": false,
          "modules": false,
          "corejs":{
            "version":"3.27.1",
            "proposals": true 
          } 
        }   
      ]
    ],
    "plugins": [
      [
        "@babel/plugin-transform-runtime",
        {
          "corejs":3,
          "proposals": true 
        }
      ]
    ]
  }
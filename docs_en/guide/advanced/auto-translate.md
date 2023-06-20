# Automatic translation <!-- {docsify-ignore-all} -->

Traditional internationalization solutions require manual translation, and `voerkai18n` the solution supports calling online translation services for automatic translation.

- Built-in `voerkai18n translate` commands can call online translation services to complete the automatic translation of the extracted text.

- Access `百度在线API` is currently supported for automatic translation. Baidu provides a free online API, although it is only supported `QPS=1`, that is, called once per second. However, `voerkai18n translate` the command merges the text to be translated before calling it, so in most cases, it is sufficient.

 
For `voerkai18n translate` command usage, see [命令行工具](../tools/cli)

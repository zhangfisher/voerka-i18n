const { getProjectContext } = require('../../../packages/utils/dist/index')


getProjectContext().then(ctx=>{
    console.log("cwd=",process.cwd())
  console.log("VoerkaI18nContext=",JSON.stringify(ctx))
})

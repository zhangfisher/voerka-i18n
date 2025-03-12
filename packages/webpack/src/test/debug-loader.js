const { runLoaders } = require("loader-runner")
const path = require("path")
const fs = require("fs")

runLoaders({
	resource: path.join(__dirname, "testapp.js"), 
    loaders:[
        {
            loader:path.join(__dirname, "../index.js"), 
			options: {
				idMap: {
					aaa:"1",
					bbb:"2",
					ccc:"3",
					ddd:"4",
					eee:"5",
					fff:"6",
					ggg:"7",
					hhh:"8"
				}
			}
        }
    ], 
	context: { minimize: true }, 
	readResource: fs.readFile.bind(fs) 
}, function(err, result) {
    if(err){
        console.error("替换失败!!!")
        console.error(err.stack)
    }else{
        console.log("********** 成功 **********")
        console.log(result.result)
    }
 
})
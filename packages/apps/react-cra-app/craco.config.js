const path = require("path");

module.exports = {
	webpack: {
		configure:(config, { env, paths })=>{
		   // console.log(JSON.stringify(config.module.rules,null,4))
		    config.module.rules.push(
		                {
		                    test: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/],
                            use:[
                                {
                                    loader:"voerkai18n-loader",
                                    options: {
                                        autoImport:true,
                                        debug:true
                                    }
                                }
                            ],		                    
                            include: paths.appSrc,
		                    enforce:'pre',
		            }
		    )
		    return config
		} 
		// configure: {
		// 	module: {
		// 		rules: [
		// 			{
		// 				//test: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/],
		// 				loader: "voerkai18n-loader",
		// 				enforce: "pre",
		// 				options: {
		// 					a: 1,
		// 				},
		// 			},
		// 		],
		// 	},
		// },
	},
};


import clear from 'rollup-plugin-clear'
import commonjs from '@rollup/plugin-commonjs';
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import { babel } from '@rollup/plugin-babel'; 

export default  [
    {
        input:  './index.js', 
        output: [
            {
                file: 'dist/index.esm.js', 
                format:"esm",
                sourcemap:true
            },
            {
                file: 'dist/index.cjs', 
                exports:"default",        
                format:"cjs",
                sourcemap:true
            }
        ],
        plugins: [
            resolve(),
            commonjs(), 
            babel({
                babelHelpers:"runtime", 
                exclude: 'node_modules/**'
            }),
            clear({targets:["dist"]}),
            terser()
        ],
        external:["@babel/runtime"]
    },
    {
        input:  './index.js', 
        output: [
            {
                file: 'dist/runtime.cjs', 
                exports:"auto", 
                format:"cjs"
            },
            {
                file: 'dist/runtime.mjs', 
                exports:"default", 
                format:"esm"
            }
        ],
        plugins:[
            commonjs(), 
        ],
    }
]
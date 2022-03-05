
import clear from 'rollup-plugin-clear'
import commonjs from '@rollup/plugin-commonjs';
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
// import { babel } from '@rollup/plugin-babel'; 

export default  [
    {
        input:  './index.js', 
        output: [
            {
                file: 'index.esm.js', 
                format:"esm" 
            },
            {
                file: 'index.cjs', 
                exports:"default",        
                format:"cjs" 
            }
        ],
        plugins: [
            resolve(),
            commonjs(), 
            clear({targets:["dist"]}),
            //terser()
        ],
        //external:["@babel/runtime"]
    }
]
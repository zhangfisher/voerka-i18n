
import clear from 'rollup-plugin-clear'
import { uglify } from "rollup-plugin-uglify";
import { babel } from '@rollup/plugin-babel'; 
import commonjs from '@rollup/plugin-commonjs';

export default  [
    {
        input:  './index.js', 
        output: [
            {
                file: 'dist/index.mjs', 
                format:"es" 
            },
            {
                file: 'dist/index.cjs', 
                exports:"default",        
                format:"cjs" 
            }
        ],
        plugins: [
            //resolve(),
            commonjs(),
            babel({
                babelHelpers:"runtime", 
                exclude: 'node_modules/**'
            }),
            clear({targets:["dist"]}),
            uglify()
        ],
        external:["@babel/runtime"]
    }
]
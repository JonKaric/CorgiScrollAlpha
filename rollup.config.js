
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import progress from 'rollup-plugin-progress';
import typescript from '@rollup/plugin-typescript';
import { terser } from "rollup-plugin-terser";

export default {
    input: './src/js/index.ts',
    output: {
        file: './dist/corgiscroll.min.js',
        format: 'umd',
        name: 'CorgiScroll',
    },
    plugins: [
        nodeResolve(),
        commonjs(),
        typescript(),
        progress({
            clearLine: false
        }),
        terser()
    ],
}


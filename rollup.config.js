
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import progress from 'rollup-plugin-progress';
import typescript from '@rollup/plugin-typescript';
import sourcemaps from 'rollup-plugin-sourcemaps';
import { terser } from "rollup-plugin-terser";

export default {
    sourcemap: true,
    input: './src/js/index.ts',
    output: {
        file: './dist/corgiscroll.min.js',
        format: 'umd',
        name: 'CorgiScroll',
    },
    plugins: [
        nodeResolve(),
        commonjs(),
        typescript({
            sourceMap: false,
            inlineSources: false
        }),
        sourcemaps(),
        progress({
            clearLine: false
        }),
        terser()
    ],
}


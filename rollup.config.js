import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.cjs', // CommonJS output
            format: 'cjs',
        },
        {
            file: 'dist/index.mjs', // ES module output
            format: 'es',
        },
    ],
    plugins: [
        terser(), // minify output
        nodeResolve(), // resolve node_modules
        commonjs(), // convert CommonJS modules to ES
        typescript(), // handle TypeScript files
    ],
    external: ['fs', 'path', 'vite'], // specify external dependencies
};

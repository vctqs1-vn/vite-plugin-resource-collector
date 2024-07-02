import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

export default {
    input: 'src/index.ts', // Adjust path as per your project structure
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
        nodeResolve(), // resolve node_modules
        commonjs(), // convert CommonJS modules to ES
        typescript(), // handle TypeScript files
    ],
    external: ['fs', 'path', 'vite'], // specify external dependencies
};

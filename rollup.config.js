import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import bundleSize from 'rollup-plugin-bundle-size';
import visualizer from 'rollup-plugin-visualizer';
import replace from 'rollup-plugin-replace';
import svgr from '@svgr/rollup';

import pkg from './package.json';

const isProd = process.env.NODE_ENV === 'production';
const processEnv = isProd ? 'production' : 'development';

export default [{
	input: 'src/index.js',
	onwarn(warning, rollupWarn) {
		if (warning.code !== 'CIRCULAR_DEPENDENCY') {
			rollupWarn(warning);
		}
	},
	output: [{
		file: pkg.main,
		format: 'cjs',
		sourcemap: true,
		exports: 'named'
	}, {
		file: pkg.module,
		format: 'esm',
		sourcemap: true,
		exports: 'named'
	}],
	external: ['react'],
	plugins: [
		bundleSize(),
		postcss(),
		babel({
			exclude: 'node_modules/**'
		}),
		visualizer(),
		replace({
			'process.env.NODE_ENV': JSON.stringify(processEnv)
		}),
		svgr(),
		resolve(),
		commonjs({
			include: 'node_modules/**'
		}),
	]
}];

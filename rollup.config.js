import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import bundleSize from 'rollup-plugin-bundle-size';
import visualizer from 'rollup-plugin-visualizer';
import svg from 'rollup-plugin-svg';
import replace from 'rollup-plugin-replace';

import pkg from './package.json';

const isProd = process.env.NODE_ENV === 'production';
const input = 'src/index.js';
const processEnv = isProd ? 'production' : 'development';
const external = ['react'];
const onwarn = (warning, rollupWarn) => {
	if (warning.code !== 'CIRCULAR_DEPENDENCY') {
		rollupWarn(warning);
	}
};
const plugins = [
	bundleSize(),
	postcss(),
	resolve(),
	babel({
		exclude: 'node_modules/**'
	}),
	commonjs({
		include: 'node_modules/**'
	}),
	svg(),
	visualizer(),
	replace({
		'process.env.NODE_ENV': JSON.stringify(processEnv)
	})
];

export default [{
	input,
	external,
	onwarn,
	output: {
		name: 'ReactFlow',
		file: pkg.browser,
		format: 'umd',
		sourcemap: isProd,
		exports: 'named',
		globals: {
			react: 'React'
		}
	},
	plugins
}, {
	input,
	external,
	onwarn,
	output: {
		file: pkg.module,
		format: 'esm'
	},
	plugins: [
		bundleSize(),
		postcss(),
		resolve(),
		babel({
			exclude: 'node_modules/**'
		}),
		commonjs({
			include: 'node_modules/**'
		}),
		svg()
	]
}];

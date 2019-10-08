import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import bundleSize from 'rollup-plugin-bundle-size';
import visualizer from 'rollup-plugin-visualizer';
import { uglify } from 'rollup-plugin-uglify';
import svg from 'rollup-plugin-svg'


import pkg from './package.json';

const isProd = process.env.NODE_ENV === 'production';

export default [{
	input: 'src/index.js',
	external: ['react', 'react-dom', 'prop-types'],
	onwarn(warning, rollupWarn) {
		if (warning.code !== 'CIRCULAR_DEPENDENCY') {
			rollupWarn(warning);
		}
	},
	output: {
		name: 'ReactFlow',
		file: pkg.browser,
		format: 'umd',
		sourcemap: isProd,
		globals: {
			react: 'React',
			'react-dom': 'ReactDOM',
			'prop-types': 'PropTypes'
		}
	},
	plugins: [
		bundleSize(),
		postcss({
			extract: isProd
		}),
		resolve(),
		babel({
			exclude: 'node_modules/**'
		}),
		commonjs({
			include: /node_modules/
		}),
		svg(),
		visualizer(),
		isProd && uglify()
	]}
];

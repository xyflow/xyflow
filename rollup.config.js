import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import postCssNested from 'postcss-nested';
import autoprefixer from 'autoprefixer';
import bundleSize from 'rollup-plugin-bundle-size';

import pkg from './package.json';

export default [{
		input: 'src/index.js',
		external: ['react', 'prop-types'],
		onwarn(warning, rollupWarn) {
			if (warning.code !== 'CIRCULAR_DEPENDENCY') {
				rollupWarn(warning);
			}
		},
		output: {
			name: 'ReactGraph',
			file: pkg.browser,
			format: 'umd',
			sourcemaps: true,
			globals: {
				react: 'React',
				'prop-types': 'PropTypes'
			}
		},
		plugins: [
			bundleSize(),
			postcss({
				plugins: [
					postCssNested(),
					autoprefixer()
				]
			}),
			resolve(),
			babel({
				exclude: 'node_modules/**'
			}),
			commonjs({
				include: /node_modules/
			})
		]
	}
];



// 	{
// 		input: 'src/index.js',
// 		external: ['react', 'prop-types', 'react-draggable', 'react-sizeme'],
// 		output: [{
// 				file: pkg.module,
// 				format: 'es',
// 				globals: {
// 					react: 'React',
// 					'react-draggable': 'ReactDraggable',
// 					'react-sizeme': 'ReactSizeme'
// 				}
// 		}],
// 		plugins: [
// 			babel({
// 				exclude: 'node_modules/**'
// 			})
// 		]
// }

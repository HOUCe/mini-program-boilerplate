import { resolve } from 'path'
import {
	DefinePlugin,
	EnvironmentPlugin,
	IgnorePlugin,
	optimize,
} from 'webpack'
import MiniProgramWebpackPlugin, { Targets } from '@lucashc/mini-program-webpack-plugin'
import StylelintPlugin from 'stylelint-webpack-plugin'
import MinifyPlugin from 'babel-minify-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import pkg from './package.json'

const { NODE_ENV, LINT } = process.env
const isDev = NODE_ENV !== 'production'
const shouldLint = !!LINT && LINT !== 'false'
const srcDir = resolve('src')

const copyPatterns = []
	.concat(pkg.copyWebpack || [])
	.map(
		(pattern) =>
			typeof pattern === 'string' ? { from: pattern, to: pattern } : pattern,
	)

export default (env = {}) => {
	const min = env.min
	const target = env.target || 'Wechat'
	const isWechat = env.target === 'Wechat'
	const isAlipay = env.target === 'Alipay'
	const isBaidu = env.target === 'Baidu'

	const relativeFileLoader = (ext = '[ext]') => {
		const namePrefix = isWechat ? '' : '[path]'
		return {
			// file-loader https://www.npmjs.com/package/file-loader
			loader: 'file-loader',
			options: {
				useRelativePath: isWechat,
				// 依赖 file-loader 对文件名后缀进行转换
				name: `${namePrefix}[name].${ext}`,
				context: srcDir,
			},
		}
	}

	return {
		entry: {
			app: './src/app.js',
		},
		output: {
			filename: '[name].js',
			publicPath: '/',
			path: resolve('dist', isWechat ? 'wechat' : (isAlipay ? 'alipay' : 'baidu')),
		},
		target: Targets[target],
		module: {
			rules: [
				{
					test: /\.js$/,
					include: /src/,
					exclude: /node_modules/,
					use: ['babel-loader', shouldLint && 'eslint-loader'].filter(Boolean),
				},
				{
					test: /\.wxs$/,
					include: /src/,
					exclude: /node_modules/,
					use: [
						relativeFileLoader(),
						'babel-loader',
						shouldLint && 'eslint-loader',
					].filter(Boolean),
				},
				{
					test: /\.(scss|wxss|acss)$/,
					include: /src/,
					use: [
						relativeFileLoader(isWechat ? 'wxss' : (isAlipay ? 'acss' : 'css')),
						{
							loader: 'sass-loader',
							options: {
								includePaths: [resolve('src', 'styles'), srcDir],
							},
						},
					],
				},
				{
					test: /\.(json|png|jpg|gif)$/,
					type: 'javascript/auto',
					include: /src/,
					use: relativeFileLoader(),
				},
				{
					test: /\.(wxml|axml|swan|xml)$/,
					include: /src/,
					use: [
						relativeFileLoader(isWechat ? 'wxml' : (isAlipay ? 'axml' : 'swan')),
						{
							// 对目标文件内部诸如 wx:if 等进行转换（为 swan: 或 a: 等）
							loader: '@lucashc/mini-program-loader',
							options: {
								// root path for requiring sources
								root: srcDir,
								// should be true if you wish to generate a root relative URL for each file
								enforceRelativePath: true,
							},
						},
					],
				},
			],
		},
		plugins: [
			new EnvironmentPlugin({
				NODE_ENV: 'development',
			}),
			new DefinePlugin({
				__DEV__: isDev,
				__WECHAT__: isWechat,
				__ALIPAY__: isAlipay,
				__Baidu__: isBaidu,
				wx: isWechat ? 'wx' : (isAlipay ? 'my' : 'swan'),
				my: isWechat ? 'wx' : (isAlipay ? 'my' : 'swan'),
				swan: isWechat ? 'wx' : (isAlipay ? 'my' : 'swan'),
			}),
			new MiniProgramWebpackPlugin({
				clear: !isDev,
			}),
			new optimize.ModuleConcatenationPlugin(),
			new IgnorePlugin(/vertx/),
			shouldLint && new StylelintPlugin(),
			min && new MinifyPlugin(),
			new CopyPlugin(copyPatterns, { context: srcDir }),
		].filter(Boolean),
		devtool: isDev ? 'source-map' : false,
		resolve: {
			modules: [resolve(__dirname, 'src'), 'node_modules'],
		},
		watchOptions: {
			ignored: /dist|manifest/,
			aggregateTimeout: 300,
		},
	};
};

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');

module.exports = (env, argv) => {
	const devMode = argv.mode !== 'production';

	return {
		entry: './src/index.js',
		output: {
			filename: 'bundle.js',
			path: path.resolve(__dirname, 'dist')
		},
		devtool: devMode ? 'eval-sourcemap' : false,
		module: {
			rules: [{
					test: /\.js$/,
					use: ['babel-loader'],
					exclude: '/node_modules/'
				},
				{
					test: /\.(sc|sa)ss$/,
					use: [
						devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
						'css-loader',
						{
							loader: 'postcss-loader',
							options: {
								ident: 'postcss',
								plugins: [
									require('autoprefixer')(),
									require('css-mqpacker')(),
									require('cssnano')()
								]
							}
						},
						'sass-loader'
					]
				},
				{
					test: /\.(gif|png|jpe?g|svg)$/i,
					use: [{
							loader: 'file-loader',
							options: {
								name: '[name].[ext]',
							}
						},
						{
							loader: 'image-webpack-loader',
							options: {
								mozjpeg: {
									progressive: true,
									quality: 65
								},
								// optipng.enabled: false will disable optipng
								optipng: {
									enabled: false,
								},
								pngquant: {
									quality: '65-90',
									speed: 4
								},
								gifsicle: {
									interlaced: false,
								},
								// the webp option will enable WEBP
								webp: {
									quality: 75
								}
							}
						},
					],
				}
			]
		},
		plugins: [
			new CleanWebpackPlugin(['dist/*']),
			new MiniCssExtractPlugin({
				filename: 'styles.css'
			}),
			new HtmlWebpackPlugin({
				template: "./src/index.html"
			}),
			new webpack.HotModuleReplacementPlugin()
		],
		devServer: {
			contentBase: './dist',
			hot: true,
			overlay: true
		}
	}
}
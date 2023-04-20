const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const path = require('path');
module.exports = {
	mode: 'development',
	experiments: {
		topLevelAwait: true,
	},
	module : {
		
		rules : [
			{
				test : /\.html$/,
				use : [
					{
						loader : "html-loader",
						options : {
							minimize : true
						}
					}
				]
			},
			{
				test: /\.css$/i,
        		use: ["style-loader", "css-loader"]
			},
			{
				
				test: /\.json/,
				type: 'javascript/auto',
				loader : 'json-loader'
			},
			{
				test: /\.png$/,
        		type: 'asset/inline',
				
				
			},
			{
				test : /\.js$/,
				exclude:/node-modules/,
				use : [
					{
						loader : "babel-loader",
						
					}
				]
			}
		]
	},
	devServer: {
		static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
		
	},
	plugins : [
		new HtmlWebPackPlugin({
			template : "./src/index.html",
			filename : "./index.html"
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css',
		
		})
	]
}
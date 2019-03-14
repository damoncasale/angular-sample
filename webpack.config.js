const webpack = require('webpack');
const path = require('path');

module.exports = env => {

    console.log('ENVIRONMENT: ', env);

    return {
        entry: {
            index: path.join(__dirname, '/src/client/app.js')
        },
        output: {
            path: path.join(__dirname, '/public/'),
            filename: 'bundle.js',
            devtoolLineToLine: true,
            sourceMapFilename: '[name].js.map',
            publicPath: path.join(__dirname, '/src/client/')
        },
        plugins: [
            new webpack.DefinePlugin({'process.env.API_URL': JSON.stringify(env.API_URL) })
        ],
        devServer: {
            publicPath: '/',
            contentBase: path.join(__dirname, '/public'),
            compress: true
        },
        devtool: 'eval',
        module: {
            rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: 'style-loader!css-loader'
            },
            {
                test: /\.(sass|scss)$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: 'raw-loader'
            },
            // inline base64 URLs for <=8k images, direct URLs for the rest
            {
                test: /\.(png|jpg)$/,
                use: 'url-loader?limit=8192'
            },
            // helps to load bootstrap's css.
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                use: 'url?limit=10000&minetype=application/font-woff'
            },
            {
                test: /\.woff2$/,
                use: 'url?limit=10000&minetype=application/font-woff'
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: 'url?limit=10000&minetype=application/octet-stream'
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                use: 'file'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: 'url?limit=10000&minetype=image/svg+xml'
            }
            ]
        }
    };
};

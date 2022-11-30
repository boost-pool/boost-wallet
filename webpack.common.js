const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

const config = {
   entry:{
      main: path.join(__dirname, "src", "index.jsx"),
      popup: path.join(__dirname, "src", "popup", "index.jsx"),
      background: path.join(__dirname, 'src', 'api', 'background', 'index.ts'),
      contentScript: path.join(__dirname, 'src', 'api', 'background', 'inject', 'index.js'),
      injected: path.join(__dirname, 'src', 'api', 'background',  'inject', 'injected.js')
   },
   experiments: {
      asyncWebAssembly: true,
      syncWebAssembly: true
   },
   module: {
      rules: [
         {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            exclude: /node_modules/,
            use: {
               loader: "babel-loader",
               options: {
                  presets: ["@babel/preset-env", "@babel/preset-react", ['@babel/preset-typescript', { allowNamespaces: true }]],
               },
            },
         },
         {
            test: /\.(png|jpe?g|gif|svg|webp)$/i,
            use: [
               {
                  loader: "optimized-images-loader",
                  options: {
                     includeStrategy: 'react',
                     // see below for available options in > https://github.com/cyrilwanner/optimized-images-loader
                  },
               },
            ],
         },
         {
            test: /\.css$/i,
            include: path.resolve(__dirname, 'src'),
            use: ['style-loader', 'css-loader', 'postcss-loader'],
         },
      ],
   },
   resolve: {
      extensions: ['*', '.js', '.jsx', '.ts', '.tsx', '.scss'],
      fallback: {
         crypto: require.resolve('crypto-browserify'),
         stream: require.resolve('stream-browserify'),
         buffer: require.resolve('buffer/'),
      }
   },
   plugins: [
      new HtmlWebpackPlugin({
         template: path.join(__dirname, "src", "index.html"),
      }),
      new HtmlWebpackPlugin({
         template: path.join(__dirname, "src", "popup", "index.html"),
         filename: 'popup.html',
         chunks: ['popup'],
         cache: false,
      }),
      new CopyPlugin({
         patterns: [
            { from: "public" }
         ],
      }),
      new webpack.ProvidePlugin({
         Buffer: ['buffer', 'Buffer'],
      }),
   ],
};

module.exports = config;

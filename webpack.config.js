const path = require('path');
const HtmlWebpackPlugin = require('Html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
// 此插件可依据用户指定的语言和功能自动引入相应的依赖文件。此外还需要添加处理 .ttf 后缀字体文件的 loader 配置。
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WebpackBar = require('webpackbar');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// const isDev = process.env.NODE_ENV !== 'production';
// Host
const host = process.env.HOST || '0.0.0.0';
const outputPath = path.join(__dirname, 'dist');

module.exports = (_, argv) => {
  console.log(_, argv)
  const mode = argv.mode;
  const isDev = mode === 'development';

  return {
    target: 'web',
    entry: {
      index: './src/index.js',
    },
    output: {
      globalObject: 'self',
      path: outputPath,
      filename: '[name].bundle.js',
    },
    resolve: {
      extensions: ['.js', '.ts', '.jsx', '.tsx']
    },
    devServer: {
      // Enable compression
      hot: true,
      compress: true,
      host,
      port: 3000,
      devMiddleware: {
        publicPath: '/'
      },
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      static: {
        publicPath: '/'
      }
    },
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['javascript', 'typescript'],
        features: ['!contextmenu', '!linkedEditing', '!quickHelp', '!suggest']
      }),
      new HtmlWebpackPlugin({
        template: './index.html'
      }),
      !isDev && new CopyWebpackPlugin({
        patterns: [{
          from: path.resolve(__dirname, 'public'),
          to: path.resolve(__dirname, outputPath)
        }]
      }),
      isDev && new ReactRefreshWebpackPlugin(),
      new TerserPlugin({
        extractComments: false
      }),
      new BundleAnalyzerPlugin(),
      new WebpackBar()
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.ttf$/,
          type: 'asset/resource',
          generator: {
            filename: '[name][ext]'
          }
        },
        {
          test: /utools\.d\.ts$/,
          type: 'asset/source',
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: { chrome: 91 } }],
                '@babel/preset-react'],
              plugins: [
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                '@babel/plugin-proposal-class-properties',
                [
                  'import',
                  {
                    libraryName: '@mui/material',
                    libraryDirectory: '',
                    camel2DashComponentName: false
                  },
                  'material'
                ],
                [
                  'import',
                  {
                    libraryName: '@mui/icons-material',
                    libraryDirectory: 'esm',
                    camel2DashComponentName: false
                  },
                  'icons'
                ],
                // this code will evaluate to "false" when
                // "isDevelopment" is "false"
                // otherwise it will return the plugin
                isDev && require.resolve('react-refresh/babel')
                // this line removes falsy values from the array
              ].filter(Boolean)
            }
          }
        },
        {
          test: /\.(s[a|c]ss|css)$/,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader',
              options: { url: false }
            },
            {
              loader: 'sass-loader'
            }
          ]
        }
      ]
    },
    performance: {
      hints: false,
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          monacoEditor: {
            chunks: 'async',
            name: 'chunk-monaco-editor',
            priority: 22,
            test: /[\/]node_modules[\/]monaco-editor[\/]/,
            reuseExistingChunk: true,
          },
        }
      }
    }
  }
}

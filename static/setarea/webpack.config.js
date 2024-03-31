const path = require('path');

module.exports = {
  entry: {
    app: './src/setarea.js',
    resizeArea: './src/resizeArea.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/, // Apply loaders only to CSS files
        use: [
          'style-loader', // Inject CSS into the DOM
          'css-loader', // Translate CSS into CommonJS
          'postcss-loader', // Process CSS with PostCSS
        ],
      },
    ],
  },
};


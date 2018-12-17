const path = require('path');

module.exports = {
  entry: './build/client/js/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build/client/js')
  }
};
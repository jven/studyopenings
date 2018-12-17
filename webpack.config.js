const path = require('path');

module.exports = {
  entry: [
    // './build/client/js/common/chessboardwrapper.js',
    
    // './build/client/js/build/buildmode.js',
    // './build/client/js/build/chessboardbuildhandler.js',
    // './build/client/js/build/colorchooserhandler.js',
    // './build/client/js/build/examplerepertoirehandler.js',
    // './build/client/js/build/keyhandler.js',
    // './build/client/js/build/treebuttonhandler.js',
    // './build/client/js/build/treenodehandler.js',
    // './build/client/js/build/treeview.js',
    
    // './build/client/js/study/chessboardstudyhandler.js',
    // './build/client/js/study/line.js',
    // './build/client/js/study/linestudier.js',
    // './build/client/js/study/repertoire.js',
    // './build/client/js/study/repertoires.js',
    // './build/client/js/study/repertoirestudier.js',
    // './build/client/js/study/studymode.js',

    './build/client/js/main.js'
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build/client/js')
  }
};
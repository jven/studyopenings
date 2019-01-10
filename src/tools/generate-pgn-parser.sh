DIR="$( cd "$( dirname "$0" )" && pwd )"

if [[ ! -f $DIR/grammar.peg ]] ; then
  echo '"grammar.peg" not found.'
  exit
fi

pegjs -o $DIR/../client/js/lib/pgnparser.js $DIR/grammar.peg
echo "Generated '$DIR/client/js/lib/pgnparser.js'."

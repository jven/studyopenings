# studyopenings
_An opening a day takes the blunders away!_

## What is this?
A tool to help people memorize openings.

Users can build trees of opening lines (_repertoires_) and then study them by forcing the user to recall either the White or Black side of the repertoire. The tool will play the other side of the repertoire. When you get a move wrong, the tool will give you feedback and allow you to try again. When you finish a line, the tool will choose a random line from the repertoire and start again.

## Credits
- Chessboard UI uses lichess' [Chessground](https://github.com/ornicar/chessground).
- Chess game logic uses [chess.js](https://github.com/jhlywa/chess.js/).
- Authentication uses [Auth0](https://auth0.com/).
- Tooltips use [tippy.js](https://atomiks.github.io/tippyjs/).
- Toasts use [toastr](https://github.com/CodeSeven/toastr).
- Feedback mechanism uses [Doorbell.io](https://doorbell.io).
- Database uses [MongoDB](https://www.mongodb.com) and is hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Server written in [Node.js](http://nodejs.org).
- Client bundling uses [Webpack](https://webpack.js.org).
- Unit tests use [Jest](https://jestjs.io) and [ts-jest](https://github.com/kulshekhar/ts-jest).

## Running locally
1. Clone the repository.
2. [Install MongoDB](https://docs.mongodb.com) if necessary. Then start a local MongoDB database instance:
```shell
$ mongod --dbpath ~/data/db --port 27017
[...]
waiting for connections on port 27017
```
3. Copy the example `.env` file which points the application to your local database:
```shell
studyopenings/ $ cp .env.example .env
```
4. Run the server:
```shell
studyopenings/ $ npm install
studyopenings/ $ npm run start-dev
[...]
studyopenings is running!
Listening on 5000.
Using database path: mongodb://127.0.0.1:27017
```

5. Go to http://localhost:5000.

## Author
Justin Venezuela
jven@jvenezue.la
http://www.jvenezue.la
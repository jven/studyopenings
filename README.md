# studyopenings
_An opening a day takes the blunders away!_

## What is this?
A tool to help chess players memorize opening repertoires.

Here's a video demo showing how it works: https://www.youtube.com/watch?v=p65d9YA3Mxw.

The tool lets you:

- _build_ repertoires by playing opening moves on a board and

- _study_ repertoires by repeatedly and correctly recalling one side of the opening lines.

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

## Running tests

To run all the tests once:
```shell
studyopenings/ $ npm install
studyopenings/ $ jest
[...]
Ran all test suites.
```

To run the tests continuously as changes are made:

```shell
studyopenings/ $ npm install
studyopenings/ $ jest --watch
```

## Author
Justin Venezuela

jven@jvenezue.la

http://jvenezue.la
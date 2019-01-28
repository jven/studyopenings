# mongoscripts

## Running scripts

For example, to run the `largestrepertoire.js` script locally:

```shell
$ mongo mongoscripts/largestrepertoire.js
[...]
ObjectId("largestRepertoireId")
```

To run in production:

```shell
$ mongo "mongodb+srv://path-to-database.mongodb.net/test" --username db-user mongoscripts/largestrepertoire.js
[...]
ObjectId("largestRepertoireId")
```

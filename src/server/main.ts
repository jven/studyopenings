const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

import * as createApplication from 'express';
import { Request, Response } from 'express';
import { CreateRepertoireAction } from './actions/createrepertoireaction';
import { DeleteRepertoireAction } from './actions/deleterepertoireaction';
import { LoadRepertoireAction } from './actions/loadrepertoireaction';
import { LogImpressionsAction } from './actions/logimpressionsaction';
import { RepertoireMetadataAction } from './actions/repertoiremetadataaction';
import { UpdateRepertoireAction } from './actions/updaterepertoireaction';
import { DatabaseWrapper } from './databasewrapper';
import { EndpointRegistry } from './endpointregistry';
import { FlagEvaluator } from './flagevaluator';

const app = createApplication();
const server = require('http').createServer(app);
const databaseWrapper = new DatabaseWrapper();
const endpointRegistry = new EndpointRegistry(app);


app
    .use(bodyParser.json({limit: '1mb'}))
    .use(cors())
    .get(
        '/flags',
        (req: Request, res: Response) => {
          res.send(FlagEvaluator.evaluateAllFlags());
        });


endpointRegistry
    .registerStaticFolder('../client')
    .registerStaticFile('/', '../client/main.html')
    .registerStaticFile('/about', '../client/about.html')
    .registerLoggedInAction(
        '/metadata',
        new RepertoireMetadataAction(databaseWrapper),
        ['read:repertoires'])
    .registerLoggedInAction(
        '/loadrepertoire',
        new LoadRepertoireAction(databaseWrapper),
        ['read:repertoires'])
    .registerLoggedInAction(
        '/updaterepertoire',
        new UpdateRepertoireAction(databaseWrapper),
        ['write:repertoires'])
    .registerLoggedInAction(
        '/createrepertoire',
        new CreateRepertoireAction(databaseWrapper),
        ['write:repertoires'])
    .registerLoggedInAction(
        '/deleterepertoire',
        new DeleteRepertoireAction(databaseWrapper),
        ['write:repertoires'])
    .registerAnonymousAction(
        '/impressions',
        new LogImpressionsAction(databaseWrapper));


function main() {
  const port = process.env.PORT || 5000;
  const databasePath = process.env.DATABASE_PATH;
  if (!databasePath) {
    throw new Error('Database path not provided!');
  }
  server.listen(port, () => {
    console.log('studyopenings is running!');

    console.log('Listening on ' + port + '.');
    databaseWrapper.connect(databasePath);
  });
}


main();

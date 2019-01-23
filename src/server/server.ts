import * as createApplication from 'express';
import { createServer, Server as HttpServer } from 'http';
import { CreateRepertoireAction } from './actions/createrepertoireaction';
import { DeleteRepertoireAction } from './actions/deleterepertoireaction';
import { EvaluateFlagsAction } from './actions/evaluateflagsaction';
import { GetPreferenceAction } from './actions/getpreferenceaction';
import { LoadRepertoireAction } from './actions/loadrepertoireaction';
import { LogImpressionsAction } from './actions/logimpressionsaction';
import { RecordStatisticsAction } from './actions/recordstatisticsaction';
import { RepertoireMetadataAction } from './actions/repertoiremetadataaction';
import { SetPreferenceAction } from './actions/setpreferenceaction';
import { UpdateRepertoireAction } from './actions/updaterepertoireaction';
import { DatabaseWrapper } from './databasewrapper';
import { EndpointRegistry } from './endpointregistry';

export class Server {
  private httpServer_: HttpServer;
  private databaseWrapper_: DatabaseWrapper;

  constructor() {
    const app = createApplication();
    this.httpServer_ = createServer(app);
    this.databaseWrapper_ = new DatabaseWrapper();

    new EndpointRegistry(app, '1mb')
        .registerStaticFolder('../client')
        .registerStaticFile('/', '../client/main.html')
        .registerStaticFile('/about', '../client/about.html')
        .registerLoggedInAction(
            '/metadata',
            new RepertoireMetadataAction(this.databaseWrapper_),
            ['read:repertoires'])
        .registerLoggedInAction(
            '/loadrepertoire',
            new LoadRepertoireAction(this.databaseWrapper_),
            ['read:repertoires'])
        .registerLoggedInAction(
            '/updaterepertoire',
            new UpdateRepertoireAction(this.databaseWrapper_),
            ['write:repertoires'])
        .registerLoggedInAction(
            '/createrepertoire',
            new CreateRepertoireAction(this.databaseWrapper_),
            ['write:repertoires'])
        .registerLoggedInAction(
            '/deleterepertoire',
            new DeleteRepertoireAction(this.databaseWrapper_),
            ['write:repertoires'])
        .registerLoggedInAction(
            '/setpreference',
            new SetPreferenceAction(this.databaseWrapper_),
            ['write:repertoires'])
        .registerLoggedInAction(
            '/getpreference',
            new GetPreferenceAction(this.databaseWrapper_),
            ['read:repertoires'])
        .registerLoggedInAction(
            '/recordstatistics',
            new RecordStatisticsAction(this.databaseWrapper_),
            ['write:repertoires'])
        .registerAnonymousAction(
            '/flags',
            new EvaluateFlagsAction())
        .registerAnonymousAction(
            '/impressions',
            new LogImpressionsAction(this.databaseWrapper_));
  }

  run(port: string, databasePath: string): void {
    this.httpServer_.listen(port, () => {
      console.log(`StudyOpenings is running!\nListening on port ${port}...`);
      this.databaseWrapper_.connect(databasePath);
    });
  }
}

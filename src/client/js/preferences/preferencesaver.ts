import { Preference } from '../../../protocol/preference';
import { ServerWrapper } from '../server/serverwrapper';

export class PreferenceSaver {
  private server_: ServerWrapper;

  constructor(server: ServerWrapper) {
    this.server_ = server;
  }

  save(preference: Preference): void {
    this.server_.setPreference(preference);
  }
}

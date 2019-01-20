import { ServerWrapper } from '../server/serverwrapper';
import { BoardThemeSetter } from '../theme/boardthemesetter';

export class PreferenceLoader {
  private server_: ServerWrapper;
  private boardThemeSetter_: BoardThemeSetter;

  constructor(server: ServerWrapper, boardThemeSetter: BoardThemeSetter) {
    this.server_ = server;
    this.boardThemeSetter_ = boardThemeSetter;
  }

  load(): void {
    this.server_.getPreference()
        .then(preference => {
          if (preference.boardTheme) {
            this.boardThemeSetter_.set(preference.boardTheme);
          }
        });
  }
}

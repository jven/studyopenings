import { ServerWrapper } from '../server/serverwrapper';
import { BoardThemeSetter } from '../theme/boardthemesetter';

export class PreferenceLoader {
  static load(
      server: ServerWrapper,
      boardThemeSetter: BoardThemeSetter): void {
    server.getPreference()
        .then(preference => {
          if (preference.boardTheme) {
            boardThemeSetter.set(preference.boardTheme);
          }
        });
  }
}

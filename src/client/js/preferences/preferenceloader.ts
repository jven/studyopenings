import { BoardTheme } from '../../../protocol/boardtheme';
import { Preference } from '../../../protocol/preference/preference';
import { SoundValue } from '../../../protocol/soundvalue';
import { ServerWrapper } from '../server/serverwrapper';
import { SoundToggler } from '../sound/soundtoggler';
import { BoardThemeSetter } from '../theme/boardthemesetter';

export class PreferenceLoader {
  private server_: ServerWrapper;
  private boardThemeSetter_: BoardThemeSetter;
  private soundToggler_: SoundToggler;

  constructor(
      server: ServerWrapper,
      boardThemeSetter: BoardThemeSetter,
      soundToggler: SoundToggler) {
    this.server_ = server;
    this.boardThemeSetter_ = boardThemeSetter;
    this.soundToggler_ = soundToggler;
  }

  load(): void {
    this.server_.getPreference()
        .then(preference => {
          this.setBoardTheme_(preference);
          this.setSoundValue_(preference);
        });
  }

  private setBoardTheme_(preference: Preference) {
    this.boardThemeSetter_.set(preference.boardTheme || BoardTheme.BLUE);
  }

  private setSoundValue_(preference: Preference) {
    const enabled = preference.soundValue
        ? preference.soundValue == SoundValue.ON
        : true;
    this.soundToggler_.setSoundsEnabled(enabled);
  }
}

import { Preference } from '../../../protocol/preference';
import { Metadata, Repertoire } from '../../../protocol/storage';

/**
 * An interface for classes that send requests to the server and receive
 * responses on behalf of the rest of the application.
 *
 * Implementations may not actually communicate with the server (e.g. in the
 * case of users that are not logged in).
 */
export interface ServerWrapper {
  /**
   * Returns a promise of the list of the metadata for all repertoires owned by
   * the current user.
   */
  getAllRepertoireMetadata(): Promise<Metadata[]>;

  /**
   * Loads the repertoire with the given ID, returning a promise of the loaded
   * repertoire.
   */
  loadRepertoire(repertoireId: string): Promise<Repertoire>;

  /** Updates the existing repertoire with the given ID. */
  updateRepertoire(
      repertoireId: string,
      repertoire: Repertoire): Promise<void>;

  /**
   * Creates a new repertoire and returns a promise of the ID of the newly
   * created repertoire.
   */
  createRepertoire(): Promise<string>;

  /** Deletes the repertoire with the given ID. */
  deleteRepertoire(repertoireId: string): Promise<void>;

  /** Sets the given preference. */
  setPreference(preference: Preference): Promise<void>;

  /** Gets the preference. */
  getPreference(): Promise<Preference>;
}

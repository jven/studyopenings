import { BoardTheme } from '../../../protocol/boardtheme';
import { Color } from '../../../protocol/color';
import { LocalStorageServerWrapper } from './localstorageserverwrapper';

let storage: MapStorage;
let wrapper: LocalStorageServerWrapper;

describe('empty storage', () => {
  beforeEach(() => {
    storage = new MapStorage();
    wrapper = new LocalStorageServerWrapper(storage);
  });

  test('metadata', () => {
    expect(wrapper.getAllRepertoireMetadata()).resolves.toEqual([]);
  });

  test('load throws', () => {
    expect(() => wrapper.loadRepertoire('id')).toThrow();
  });

  test('update throws', () => {
    expect(() => wrapper.updateRepertoire(
        'id', {name: 'name', color: Color.WHITE, root: null})).toThrow();
  });

  test('delete throws', () => {
    expect(() => wrapper.deleteRepertoire('id')).toThrow();
  });

  test('create', () => {
    return wrapper.createRepertoire().then(newRepertoireId => {
      const ids = Object.keys(
          JSON.parse(storage.getItem('anonymous_repertoire')));
      expect(ids).toHaveLength(1);
      expect(ids[0]).toEqual(newRepertoireId);
    });
  });
});

describe('with one repertoire', () => {
  beforeEach(() => {
    storage = new MapStorage();
    wrapper = new LocalStorageServerWrapper(storage);
    return wrapper.createRepertoire();
  });

  test('metadata', () => {
    return wrapper.getAllRepertoireMetadata().then(metadataList => {
      expect(metadataList).toHaveLength(1);
      expect(metadataList[0]).toEqual({
        id: metadataList[0].id,
        name: 'Untitled repertoire'
      });
    });
  });

  test('load existing', () => {
    return wrapper.getAllRepertoireMetadata()
        .then(metadataList => wrapper.loadRepertoire(metadataList[0].id))
        .then(repertoire => {
          expect(repertoire).toEqual({
            name: 'Untitled repertoire',
            color: Color.WHITE,
            root: null
          });
        });
  });

  test('update existing', () => {
    return wrapper.getAllRepertoireMetadata()
        .then(metadataList =>
            wrapper.updateRepertoire(metadataList[0].id, {
              name: 'New name',
              color: Color.BLACK,
              root: null
            }))
        .then(() => wrapper.getAllRepertoireMetadata())
        .then(metadataList => wrapper.loadRepertoire(metadataList[0].id))
        .then((repertoire) => {
          expect(repertoire).toEqual({
            name: 'New name',
            color: Color.BLACK,
            root: null
          });
        });
  });

  test('delete existing', () => {
    return wrapper.getAllRepertoireMetadata()
        .then(metadataList => wrapper.deleteRepertoire(metadataList[0].id))
        .then(() => wrapper.getAllRepertoireMetadata())
        .then(metadataList => {
          expect(metadataList).toHaveLength(0);
        });
  });

  test('create another', () => {
    return wrapper.createRepertoire()
        .then(newRepertoireId => wrapper.getAllRepertoireMetadata()
            .then(metadataList => {
              expect(metadataList).toHaveLength(2);
              expect(metadataList[1].id).toEqual(newRepertoireId);
            }));
  });
});

describe('preferences', () => {
  beforeEach(() => {
    storage = new MapStorage();
    wrapper = new LocalStorageServerWrapper(storage);
  });

  test('get returns empty', () => {
    return wrapper.getPreference()
        .then(preference => {
          expect(preference).toEqual({});
        });
  });

  test('set and get returns it', () => {
    return wrapper.setPreference({ boardTheme: BoardTheme.PURPLE})
        .then(() => wrapper.getPreference())
        .then(preference => {
          expect(preference).toEqual({boardTheme: BoardTheme.PURPLE});
        });
  });
});

class MapStorage implements Storage {
  private map_: Map<string, string>;
  public length: number;
  [name: string]: any;

  constructor() {
    this.map_ = new Map<string, string>();
    this.length = 0;
  }

  clear(): void {
    this.map_.clear();
  }

  getItem(key: string): string {
    return this.map_.get(key) || '';
  }

  key(index: number): string {
    throw new Error('Unimplemented.');
  }

  removeItem(key: string): void {
    this.map_.delete(key);
  }

  setItem(key: string, value: string): void {
    this.map_.set(key, value);
  }
}

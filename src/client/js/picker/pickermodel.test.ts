import { PickerModel } from './pickermodel';

describe('errors', () => {
  test('getSelected without set', () => {
    const model = new PickerModel();
    expect(() => model.getSelectedMetadata()).toThrow();
    expect(() => model.getSelectedIndex()).toThrow();
  });
});

describe('set', () => {
  test('set without id', () => {
    const model = new PickerModel();
    const metadata = [
      {id: 'id1', name: 'name1'},
      {id: 'id2', name: 'name2'},
      {id: 'id3', name: 'name3'}
    ];
    model.setMetadataList(metadata, null /* selectMetadataId */);

    expect(model.getSelectedIndex()).toBe(0);
    expect(model.getSelectedMetadata()).toBe(metadata[0]);
  });

  test('set with id', () => {
    const model = new PickerModel();
    const metadata = [
      {id: 'id1', name: 'name1'},
      {id: 'id2', name: 'name2'},
      {id: 'id3', name: 'name3'}
    ];
    model.setMetadataList(metadata, 'id2');

    expect(model.getSelectedIndex()).toBe(1);
    expect(model.getSelectedMetadata()).toBe(metadata[1]);
  });

  test('set with unknown id', () => {
    const model = new PickerModel();
    const metadata = [
      {id: 'id1', name: 'name1'},
      {id: 'id2', name: 'name2'},
      {id: 'id3', name: 'name3'}
    ];
    model.setMetadataList(metadata, 'id4');

    expect(model.getSelectedIndex()).toBe(0);
    expect(model.getSelectedMetadata()).toBe(metadata[0]);
  });

  test('set twice with id', () => {
    const model = new PickerModel();
    const metadata1 = [
      {id: 'id1', name: 'name1'},
      {id: 'id2', name: 'name2'},
      {id: 'id3', name: 'name3'}
    ];
    model.setMetadataList(metadata1, null);
    const metadata2 = [
      {id: 'id4', name: 'name4'},
      {id: 'id5', name: 'name5'},
      {id: 'id6', name: 'name6'}
    ];
    model.setMetadataList(metadata2, 'id6');

    expect(model.getSelectedIndex()).toBe(2);
    expect(model.getSelectedMetadata()).toBe(metadata2[2]);
  });
});

describe('isEmpty', () => {
  test('empty', () => {
    const model = new PickerModel();
    model.setMetadataList([], null);
    expect(model.isEmpty()).toBe(true);
  });

  test('not empty', () => {
    const model = new PickerModel();
    model.setMetadataList([{id: 'id1', name: 'name1'}], null);
    expect(model.isEmpty()).toBe(false);
  });
});

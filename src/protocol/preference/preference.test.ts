import { Preference } from './preference';

it('all fields in preference must be optional', () => {
  assertIsExtraData({});
});

function assertIsExtraData(preference: Preference) {
  return true;
}

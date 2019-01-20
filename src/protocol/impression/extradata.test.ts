import { ExtraData } from './extradata';

it('all fields in extra data must be optional', () => {
  assertIsExtraData({});
});

function assertIsExtraData(extraData: ExtraData) {
  return true;
}

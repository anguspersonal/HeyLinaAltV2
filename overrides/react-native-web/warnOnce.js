import { warnOnce as baseWarnOnce } from 'react-native-web/dist/modules/warnOnce/index.js';

export function warnOnce(key, message) {
  if (key === 'pointerEvents') {
    return;
  }

  return baseWarnOnce(key, message);
}

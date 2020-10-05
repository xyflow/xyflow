export function isOldIE() {
  if (typeof navigator === 'undefined') {
    return false;
  }

  // https://stackoverflow.com/a/22242528
  return (
    navigator.userAgent.indexOf('MSIE') !== -1 ||
    navigator.appVersion.indexOf('Trident/') > -1
  );
}

export default {
  isOldIE,
};

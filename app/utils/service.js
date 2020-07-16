export const isActive = (to, pathname) => {
  const hasSubDir = to.lastIndexOf('/') > 0 && pathname.lastIndexOf('/') > 0;
  if (hasSubDir) {
    const toSubDirName = to.substr(1, to.lastIndexOf('/') - 1);
    const pathnameSubDirName = pathname.substr(
      1,
      pathname.lastIndexOf('/') - 1
    );
    return toSubDirName === pathnameSubDirName;
  }
  const isExact = to === pathname;
  return isExact;
};

export const isEmptyObject = (obj) =>
  Object.entries(obj).length === 0 && obj.constructor === Object;

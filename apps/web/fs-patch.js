const fs = require('fs');

// Monkey patch fs.readlinkSync
const originalReadlinkSync = fs.readlinkSync;
fs.readlinkSync = function (path, options) {
  try {
    return originalReadlinkSync(path, options);
  } catch (err) {
    if (err && err.code === 'EISDIR') {
      const newErr = new Error(`EINVAL: invalid argument, readlink '${path}'`);
      newErr.code = 'EINVAL';
      newErr.errno = -4071;
      newErr.syscall = 'readlink';
      newErr.path = path;
      throw newErr;
    }
    throw err;
  }
};

// Monkey patch fs.readlink
const originalReadlink = fs.readlink;
fs.readlink = function (path, options, callback) {
  let cb = callback;
  let opts = options;
  if (typeof options === 'function') {
    cb = options;
    opts = undefined;
  }
  
  originalReadlink(path, opts, (err, linkString) => {
    if (err && err.code === 'EISDIR') {
      const newErr = new Error(`EINVAL: invalid argument, readlink '${path}'`);
      newErr.code = 'EINVAL';
      newErr.errno = -4071;
      newErr.syscall = 'readlink';
      newErr.path = path;
      return cb(newErr);
    }
    cb(err, linkString);
  });
};

// Monkey patch fs.promises.readlink
if (fs.promises && fs.promises.readlink) {
  const originalPromisesReadlink = fs.promises.readlink;
  fs.promises.readlink = async function (path, options) {
    try {
      return await originalPromisesReadlink(path, options);
    } catch (err) {
      if (err && err.code === 'EISDIR') {
        const newErr = new Error(`EINVAL: invalid argument, readlink '${path}'`);
        newErr.code = 'EINVAL';
        newErr.errno = -4071;
        newErr.syscall = 'readlink';
        newErr.path = path;
        throw newErr;
      }
      throw err;
    }
  };
}

console.log('Successfully applied Windows fs.readlink patches.');

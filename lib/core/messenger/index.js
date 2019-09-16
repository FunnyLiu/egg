'use strict';

const LocalMessenger = require('./local');
const IPCMessenger = require('./ipc');

/**
 * @class Messenger
 */
// 单进程使用local，多进程模型使用ipc
exports.create = egg => {
  return egg.options.mode === 'single'
    ? new LocalMessenger(egg)
    : new IPCMessenger(egg);
};

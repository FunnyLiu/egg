'use strict';

const path = require('path');
const ms = require('ms');
const EggApplication = require('./egg');
const AgentWorkerLoader = require('./loader').AgentWorkerLoader;

const EGG_LOADER = Symbol.for('egg#loader');
const EGG_PATH = Symbol.for('egg#eggPath');

/**
 * Singleton instance in Agent Worker, extend {@link EggApplication}
 * @extends EggApplication
 */
// 继承自egg.js
class Agent extends EggApplication {
  /**
   * @class
   * @param {Object} options - see {@link EggApplication}
   */
  constructor(options = {}) {
    // 增加agent标识
    options.type = 'agent';
    super(options);

    this.loader.load();

    // dump config after loaded, ensure all the dynamic modifications will be recorded
    const dumpStartTime = Date.now();
    this.dumpConfig();
    this.coreLogger.info('[egg:core] dump config after load, %s', ms(Date.now() - dumpStartTime));

    // keep agent alive even it doesn't have any io tasks
    // 保证进程存活
    setInterval(() => {}, 24 * 60 * 60 * 1000);

    this._uncaughtExceptionHandler = this._uncaughtExceptionHandler.bind(this);
    process.on('uncaughtException', this._uncaughtExceptionHandler);
  }
  // 监听为捕获异常
  _uncaughtExceptionHandler(err) {
    if (!(err instanceof Error)) {
      err = new Error(String(err));
    }
    /* istanbul ignore else */
    if (err.name === 'Error') {
      err.name = 'unhandledExceptionError';
    }
    this.coreLogger.error(err);
  }
  // 返回agent_worker_loader.js
  get [EGG_LOADER]() {
    return AgentWorkerLoader;
  }

  get [EGG_PATH]() {
    return path.join(__dirname, '..');
  }

  _wrapMessenger() {
    for (const methodName of [ 'broadcast', 'sendTo', 'sendToApp', 'sendToAgent', 'sendRandom' ]) {
      wrapMethod(methodName, this.messenger, this.coreLogger);
    }

    function wrapMethod(methodName, messenger, logger) {
      const originMethod = messenger[methodName];
      messenger[methodName] = function() {
        const stack = new Error().stack.split('\n').slice(1).join('\n');
        logger.warn('agent can\'t call %s before server started\n%s',
          methodName, stack);
        originMethod.apply(this, arguments);
      };
      messenger.prependOnceListener('egg-ready', () => {
        messenger[methodName] = originMethod;
      });
    }
  }

  close() {
    process.removeListener('uncaughtException', this._uncaughtExceptionHandler);
    return super.close();
  }

}

module.exports = Agent;

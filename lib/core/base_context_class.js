'use strict';

const EggCoreBaseContextClass = require('egg-core').BaseContextClass;
const BaseContextLogger = require('./base_context_logger');

const LOGGER = Symbol('BaseContextClass#logger');

/**
 * BaseContextClass is a base class that can be extended,
 * it's instantiated in context level,
 * {@link Helper}, {@link Service} is extending it.
 */
// 继承自egg-core的BaseContextClass，并加上base_context_logger的实例用作logger对象的get
class BaseContextClass extends EggCoreBaseContextClass {
  get logger() {
    if (!this[LOGGER]) this[LOGGER] = new BaseContextLogger(this.ctx, this.pathName);
    return this[LOGGER];
  }
}

module.exports = BaseContextClass;

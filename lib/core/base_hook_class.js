'use strict';

const assert = require('assert');
const INSTANCE = Symbol('BaseHookClass#instance');

class BaseHookClass {

  constructor(instance) {
    // 初始化实例并挂载在私有变量
    this[INSTANCE] = instance;
  }
  // 对外暴露私有变量的属性
  get logger() {
    return this[INSTANCE].logger;
  }

  get config() {
    return this[INSTANCE].config;
  }

  get app() {
    assert(this[INSTANCE].type === 'application', 'agent boot should not use app instance');
    return this[INSTANCE];
  }

  get agent() {
    assert(this[INSTANCE].type === 'agent', 'app boot should not use agent instance');
    return this[INSTANCE];
  }
}

module.exports = BaseHookClass;

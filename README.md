# 源码分析

## 文件结构

``` bash
├── agent.js
├── app
|  ├── extend
|  |  ├── context.js
|  |  ├── helper.js
|  |  ├── request.js
|  |  └── response.js
|  └── middleware
|     ├── body_parser.js
|     ├── meta.js
|     ├── notfound.js
|     ├── override_method.js
|     └── site_file.js
├── appveyor.yml - 持续集成CI文件
├── config
|  ├── config.default.js
|  ├── config.local.js
|  ├── config.unittest.js
|  ├── favicon.png
|  └── plugin.js
├── index.d.ts - 声明文件
├── index.js - 入口文件
├── lib
|  ├── agent.js
|  ├── application.js
|  ├── core
|  |  ├── base_context_class.js
|  |  ├── base_context_logger.js
|  |  ├── base_hook_class.js
|  |  ├── context_httpclient.js
|  |  ├── dnscache_httpclient.js
|  |  ├── httpclient.js
|  |  ├── logger.js
|  |  ├── messenger
|  |  |  ├── index.js - 单进程模型使用local.js，多进程模型使用pid。
|  |  |  ├── ipc.js - 用于给子进程进行通信，底层基于sendmessage模块，基于subprocess.send来进行通信。
|  |  |  └── local.js - 用于当前进程内部通信，基于EventEmitter封装了一个通信管理messennger
|  |  ├── singleton.js
|  |  └── utils.js
|  ├── egg.js
|  ├── jsdoc
|  |  ├── context.jsdoc
|  |  ├── request.jsdoc
|  |  └── response.jsdoc
|  ├── loader
|  |  ├── agent_worker_loader.js
|  |  ├── app_worker_loader.js
|  |  └── index.js
|  └── start.js - 启动文件，初始化Agent和Application，建立关系
├── scripts
|  ├── commits.sh
|  ├── deploy_key.enc
|  └── doc_travis.sh
```

## 模块依赖关系

egg.js
对外模块依赖

![](./graphviz/egg.svg)

对内模块依赖

![](./graphviz/egg-inline.gv.svg)


## 各文件解析

### index.js

入口文件，用于将内部各模块对外暴露

![](./graphviz/index.js.svg)


### lib/start.js

启动文件，初始化Agent和Application，建立关系，最后返回application。

![](./graphviz/lib_start.js.svg)


### lib/core/messenger/local.js

用于当前进程内部通信，基于EventEmitter封装了一个通信管理messennger

![](./graphviz/lib_core_messenger_local.svg)

### lib/core/messenger/pid.js

用于给子进程进行通信，底层基于sendmessage模块，基于[subprocess.send](https://nodejs.org/dist/latest-v10.x/docs/api/child_process.html#child_process_subprocess_send_message_sendhandle_options_callback)来进行通信。

![](./graphviz/lib_core_messenger_pid.svg)

### lib/core/messenger/index.js

单进程模型使用local.js，多进程模型使用pid。

![](./graphviz/lib_core_messenger_index.svg)


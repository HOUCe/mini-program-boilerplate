# wxapp-boilerplate

使用 `webpack`, `babel`, `scss` 开发的微信/支付宝/百度小程序项目多合一脚手架

## 功能

* 支持引用 `node_modules` 模块
* 支持通过配置 `alias` 来避免 `../../../` 之类的模块引用
* 通过 `babel` 支持更丰富的 `ES6` 兼容，包括 `async/await`
* 内置 `promise` 和 `lodash`（`lodash` 按需引入相应模块，不会全部引入）
* 使用 `scss` 编写 `.wxss` 文件，内置了一些有用的 `mixins` 和 `extends`
* 提供 `__DEV__` 和 `process.env.NODE_ENV` 全局常量辅助开发
* 支持自动编译为微信、支付宝、百度小程序
* 提供 `__WECHAT__`、`__ALIPAY__`、`__BAIDU__` 全局常量来判断是微信小程序或支付宝小程序或百度小程序
* 通过命令行快速创建微信小程序页面
* 支持在 `production` 环境下压缩代码

## 开始使用

确保安装了 [Node.js](https://nodejs.org/) (>= `v4.2`) 和 [yarn](https://yarnpkg.com) 或 [npm](https://www.npmjs.com/package/npm)

1.  `git clone` 此项目
2.  通过命令行工具 `cd` 到这个目录，执行 `yarn` 安装依赖模块
3.  执行 `yarn start` 开始开发
4.  通过微信开发者工具，添加 `dist/wechat` 目录到项目上

## 内置命令

* `yarn start` 启动 `webpack` 开发微信小程序项目，能监听文件变化自动重新编译
* `yarn start:alipay` 启动 `webpack` 开发支付宝小程序项目，能监听文件变化自动重新编译
* `yarn start:baidu` 启动 `webpack` 开发百度小程序项目，能监听文件变化自动重新编译
* `yarn build` 编译生成 `production` 环境的代码到 `dist/wechat`、`dist/alipay`、`dist/baidu`
* `yarn lint:build` 执行 `yarn build` 命令，并使用 eslint 和 stylelint 来校验代码规范
* `yarn prettier` 执行 `prettier` 来格式化 src 目录下的代码
* `yarn create-page` 快速创建微信小程序页面（更多 `create-page` 的用法，请查看 [create-wxapp-page](https://github.com/cantonjs/create-wxapp-page)）

## 兼容微信、支付宝、百度小程序

开发者可以选择一套源代码来开发微信和支付宝小程序，这脚手架支持自动编译 `wxml` 为 `axml`或`swan`，转换 API `wx` 为 `my` 或 `swan`，反之亦然。但个别接口在平台上也略有差异，开发者可以通过 `__WECHAT__` 或 `__ALIPAY__` 或 `__BAIDU__`来动态处理。

## 文件复制

如果 `wxml` 或 `axml` 或 `swan` 有动态引入文件（如 `src="{{'images/' + type + '.png'}}"`），webpack 将不能动态引入，因此会导致打包后可能会存在缺失文件问题。

遇到这种情况，可以通过 [copy-webpack-plugin](https://github.com/webpack-contrib/copy-webpack-plugin) 解决，把整个 `images` 目录复制到 `dist` 下即可。

本脚手架已经内置这个插件。为了方便使用，还可以通过在 `package.json` 里增加一个 `copyWebpack` 的字符串数组，来实现目录或文件自动复制。例如：

**package.json**

```json5
{
  // ...
  "copyWebpack": ["images", "icons"]
}
```

通过执行 `yarn start` 或 `yarn build`，`src/images` 和 `src/icons` 目录会自动复制到 `dist/wechat/images` 和 `dist/wechat/icons` 目录（支付宝、百度小程序同理）。

## 实现原理

对于不同平台的差异化编译，主要依靠实现 webpack 的自定义 loader 和 plugin。loader 是文件加载器，能够加载资源文件，并对这些文件进行一些处理，诸如编译、压缩等，最终一起打包到指定的文件中。第一个执行的 loader 接收源文件内容作为参数，其他 loader 接收前一个执行的 loader 的返回值作为参数。最后执行的 loader 会返回此模块的 JavaScript 源码。详细信息可以参见官网。同时，在 Webpack 运行的生命周期中会广播出许多事件，plugin 可以监听这些事件，在合适的时机通过 webpack 提供的 API 改变输出结果。

**plugin和loader的区别是什么？**

对于 loader，它就是一个转换器，将 A 文件进行编译形成 B 文件，这里操作的是文件，比如将 A.scss 或 A.less 转变为 B.css，单纯的文件转换过程。

plugin 是一个扩展器，它丰富了 wepack 本身，针对是 loader 结束后，webpack 打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听 webpack 打包过程中的某些节点，执行广泛的任务。、

该项目使用 wxml-loader 和 wxapp-webpack-plugin 来实现自定制的编译。

- file-loader: 用于输出 .json，.wxss，.jpg 之类的文件
- css-loader: 使 webpack 能编译或处理 .wxss 上引用的文件
- wxml-loader: 使 webpack 能编译或处理 .wxml 上引用的文件



## 相关项目

* [create-wxapp-page](https://github.com/cantonjs/create-wxapp-page)
* [react-lib-boilerplate](https://github.com/cantonjs/react-lib-boilerplate)
* [front-end-lib-boilerplate](https://github.com/cantonjs/front-end-lib-boilerplate)
* [node-cli-boilerplate](https://github.com/cantonjs/node-cli-boilerplate)

## License

MIT

# 项目说明

## 包管理

* ~~当前包管理工具为 `pnpm`(https://pnpm.io), 请使用 `pnpm` 相关指令管理包依赖， 并及时同步 `pnpm-lock.yaml` 文件~~
* 目前项目的 pnpm 包管理在使用过程中有部分问题没有修复，暂时恢复 yarn 包管理

## 当前项目 dev 端口号为： `8002`

## COOKIE 代理

1. 请在 `.env` 中替换 PROXY_TARGET
2. 请在 `COOKIE` 文件 中填充需要代理网站的 Cookie 值

## 当前项目已添加流水线：

[流水线地址](http://osc.gitee.work/xly-poc/WebIde/ipipe/pipelines/13821/builds/list)

## Formik相关：

* 当前项目表单使用 [Antd Form](https://ant-design.gitee.io/components/form-cn/)
  和 [Antd ProForm](https://procomponents.ant.design/components/form) 实现,除部分老需求外，不再新需求中使用 formik, 后期将统一移除formik 模块

## 关于 Antd ProForm:

* 坑点1： ProFormText、 ProFormTextArea 等组件依赖 Antd 中的 Input Area 等组件，如果需要对当前Input Area 组件添加属性，需要在当前 ProFormText、
  ProFormTextArea ...中的 `fieldProps` 属性传递

## 关于样式：

~~* 当前项目使用 vite 打包项目，内置 css modules， 请创建文件时使用 `xxx.module.less` 作为文件名~~

* 由于 one 目前不支持vite打包，所以目前项目暂时放弃 vite打包，依旧使用 webpack 打包
* 当前 项目使用antd 作为样式框架，已内置部分 resetcss, 请勿重复添加：
    * box-sizing: border-box;

## Typescript 相关

* 获取某个函数的参数类型列表：

 ```ts
    typeparamsArr = typeof Parameters<fn> // fn 为目标函数
```

## 接口文档地址：

* [Noah 相关接口](http://192.168.80.50:24005/doc.html#/home)
* [资源管理相关接口1](http://192.168.80.50:24006/doc.html#/home)
* [资源管理相关接口2](http://192.168.80.50:24008/doc.html)

* 注意： 接口文档在使用时，需要在 文档管理-> 全局参数设置里配置对应的参数（group-name、group-type、HEADER-USERINFO、Company-Uuid）

## 注意事项：

* 使用 Select 时 需要用当前项目中的 [AntdSelect](src/components/AntdSelect) 组件，它对antd的Select 做了封装
* 在使用 svg 图标的时候 可以直接把 svg 路径当做 ReactComponent 使用, webpack 中已配置svg加载规则

```tsx
import Icon from 'xx/xx/xx.svg'
```

* 由于当前项目中有一些从 Noah 中拿来的复用代码，Noah 项目的 ts改造不完善，所以项目中涉及Noah的项目（文件分发、脚本执行等）会有 `// @ts-nocheck` 的标识，但在新写的项目中，非必要请不要添加此标识

## 未完成任务

* web-terminal 对接 确定方案： https://xtermjs.org/
* 国际化 推荐方案： https://github.com/alibaba/kiwi
* UI 一致性改造
* bug修复



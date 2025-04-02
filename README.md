# 开发者客栈——前端（node）

- **全局配置**
    - 接口域名配置请查看 ./global.js
- **部署环境**
    - node: 14.15.0
    - os: centos 7
    - pm2: 5.1.0

## 开始

```bash
# 安装依赖
$ yarn install

# 启动 【export PORT=xxxx】
$ npm run dev

# 生产
$ npm run build
$ npm run start

# 生成静态
$ yarn generate
```

## 目录

> .nuxt 勿动！

1. `assets/style/css`: 存放全局样式 需在 `nuxt.config.js` [css] 中配置， 参考 `global.css`
2. `assets/style/less`: 通用样式，需在 nuxt.config.js 中配置，参考 base.less
3. `assets/images`: 其它图片资源
4. `api`: 定义接口，按模块
5. `components`: 全局组件，自动注册
6. `layout`: 布局组件，一般情况下别动
7. `lib`: 存放一些公用函数
8. `middleware`: 中间件 登录和公用信息处理
9. `page`: 视图页面，自动生成路由，详情查看 `.nuxt/router.js`
10. `plugin`: 插件，自行查询官网或查看现有插件定义，需在 `nuxt.config.js` 中配置
11. `store`
12. `static`

## 登录控制

- 统一全局组件 `g-wx-oauth` 和全局自定义指令 `v-auth` 控制，简单方便。
- g-register 可自行改造注册逻辑
- 微信扫码登录逻辑请看 `./pages/index.vue` 中的 `asyncData`
  - 要实现和开发者客栈一样的登录需
    - 申请小程序（见习微信小程序开发者工具等等）
    - 公众号服务号
    - 替换java代码中的 appid appsecret 等等。。。
  - 邮箱登录：供验收使用，后续可自行改造
  

## 本地环境代理配置

详细见 nuxt.config.js 中的proxy

```
  proxy: {
    '/developers-server': globalConfig.developerServer
  }
```

若java本地启动

方案一：修改java代码中的 `REST_API_PREFIX_PATH=/developers-server/rest/`
方案二：修改上述配置如下
```
  proxy: {
    '/developers-server': `${globalConfig.developerServer}/developers-server`
  }
```


## 本地环境代理配置

详细见 nuxt.config.js 中的proxy

```
  proxy: {
    '/developers-server': globalConfig.developerServer
  }
```

若java本地启动

方案一：修改java代码中的 `REST_API_PREFIX_PATH=/developers-server/rest/`
方案二：修改上述配置如下
```
  proxy: {
    '/developers-server': `${globalConfig.developerServer}/developers-server`
  }
```


## 本地环境代理配置

详细见 nuxt.config.js 中的proxy

```
  proxy: {
    '/developers-server': globalConfig.developerServer
  }
```

若java本地启动

方案一：修改java代码中的 `REST_API_PREFIX_PATH=/developers-server/rest/`
方案二：修改上述配置如下
```
  proxy: {
    '/developers-server': `${globalConfig.developerServer}/developers-server`
  }
```


## 部署

根据自身情况部署

1. 可手动进去服务器拉去代码

- git clone xxx
- yarn
- yarn build
- pm2 start npm --name 你的项目名称 -- run start 【开启守护进程,其它参数可看pm2文档】

2. pm2 ecosystem
- 可自行根据自己环境配置远程pm2自动发布配合其它ci即可

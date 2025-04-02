import information from './seo-info'
import globalConfig from './global'

const isProd = process.env.NODE_ENV == 'production'

console.log('NODE_ENV: ', process.env.NODE_ENV)

const axiosConfig = {
  prefix: globalConfig.basePath,
  proxy: !isProd
}
if (isProd) {
  axiosConfig.baseURL = `${globalConfig.developerServer}${globalConfig.basePath}`
  delete axiosConfig.prefix
  delete axiosConfig.proxy
}

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: information.title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0' },
      { hid: 'keywords', name: 'keywords', content: information.keywords },
      { hid: 'description', name: 'description', content: information.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'https://static.developers.pub/baacbb720fd04e3d8c59312a45298ec9' }
    ],
    script: [
      {
        src: 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js'
      }
    ]
  },

  loading: {
    color: '#004fc4',
    height: '1px'
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    // 'ant-design-vue/dist/antd.css',
    'bytemd/dist/index.css',
    'bytemd/dist/index.min.css',
    'highlight.js/styles/github.css',
    'ant-design-vue/dist/antd.less',
    '@/assets/style/css/global.css',
    '@/assets/style/less/base.less'
  ],

  vue: {
    config: {
      ignoredElements: ['wx-open-launch-weapp']
    }
  },

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    // { src: '~/plugins/highlight', ssr: false },
    { src: '~/plugins/g-auth', ssr: false },
    { src: '~/plugins/vue-infinite-scroll', ssr: false },
    { src: '~/plugins/global-utils', ssr: false },
    { src: '~/plugins/vue-cropper', ssr: false },
    { src: '~/plugins/exposure-directive', ssr: false },
    '~/plugins/filters.js',
    '~/plugins/antd-ui.js',
    '~/plugins/dompurify-html.js',
    '~/plugins/global-config',
    '~/plugins/api.js'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    '@nuxtjs/style-resources',
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    'cookie-universal-nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/router'
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: axiosConfig,

  proxy: {
    [globalConfig.basePath]: globalConfig.developerServer
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    loaders: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
          modifyVars: {
            'primary-color': '#004fc4',
            'border-radius-base': '3px'
          }
        }
      }
    },
    styleResources: {
      less: './assets/**/*.less'
    },
    transpile: ['ant-design-vue'],
    // analyze: true,
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 50000,
        maxSize: 200000,
        minChunks: 2,
        automaticNameDelimiter: '.',
        maxAsyncRequests: 10,
        cacheGroups: {
          wangeditor: {
            test: /node_modules[\\/]wangeditor/,
            chunks: 'all',
            priority: 20,
            name: true
          },
          antdesignvue: {
            test: /node_modules[\\/]ant-design-vue/,
            chunks: 'all',
            priority: 20,
            name: true
          }
        }
      }
    }
  },

  eslint: {
    fix: true
  },
  publicRuntimeConfig: {
    baseURL: '/'
  },
  router: {
    middleware: ['user-info', 'tag-info'],
    extendRoutes (routes) {
      const delComponents = (routeList) => {
        for (let i = 0, len = routeList.length; i < len; i++) {
          const route = routeList[i]
          if (route) {
            if (route.path.includes('components')) {
              routeList.splice(i, 1)
              delComponents(routeList)
              break
            }
            if (route.children && route.children.length) {
              delComponents(route.children)
            }
          }
        }
      }
      delComponents(routes)
    }
  },
  server: {
    host: '0.0.0.0', // 关键修改！允许外部访问
    port: 4000
  }
}

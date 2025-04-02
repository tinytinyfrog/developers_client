import cookieUtils from '@/lib/cookie-utils'

export default async function (ctx) {
  const { store, $api, route, $cookies } = ctx
  const { _tk } = route.query
  const day = 10
  if (!process.client) {
    const userAgent = ctx.req.headers['user-agent']
    store.commit('globalData/updateEnv', userAgent)
    if (_tk) {
      $cookies.set(cookieUtils.TOKENKEY, _tk, { maxAge: 60 * 60 * 24 * day })
    }
  } else {
    const userAgent = navigator.userAgent
    store.commit('globalData/updateEnv', userAgent)
    if (_tk) {
      cookieUtils.setToken(_tk, {
        expires: day,
        sameSite: 'None',
        secure: true
      })
    }
  }
  await store.dispatch('user/getUserInfo', { $api, ctx })
}

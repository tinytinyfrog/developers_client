/**
 * 用户相关
 * */
import CryptoJS from 'crypto-js'
import _get from 'lodash/get'
const userApi = ($axios) => {
  return {
    /**
     * 登录
     * @param {*} params
     * @returns
     */
    async login (params) {
      params.password = CryptoJS.MD5(params.password).toString()
      return await $axios.post('/rest/user/email-login', params).then((res) => {
        return _get(res, 'data', {})
      })
    },
    /**
     * 微信小程序生成二维码
     * @param {*} params
     * @returns
     */
    async getWxLogoQrcode () {
      return await $axios.post('/rest/user/wx-mini/web-login-qr-code', {}).then((res) => {
        return _get(res, 'data.data', '')
      })
    },
    /**
     * 微信小程序登录Token
     * @param {*} params
     * @returns
     */
    async getWxQrcodeToken (scene) {
      return await $axios.post(`/rest/user/wx-mini/web-login-query-token/${scene}`, {}).then((res) => {
        return _get(res, 'data.data', '')
      })
    },
    /**
     * 注册
     * @param {*} params
     * @returns
     */
    async register (params) {
      params.password = CryptoJS.MD5(params.password).toString()
      return await $axios.post('/rest/user/register', params).then((res) => {
        return _get(res, 'data', {})
      })
    },
    /**
     * 退出
     * @param {*} params
     * @returns
     */
    async logout (params) {
      return await $axios.post('/rest/user/logout', params)
    },
    /**
     * 获取自己信息
     * @param {*} params
     * @returns
     */
    async getUserInfo () {
      return await $axios.post('/rest/user/info', {}, {}).then((res) => {
        console.log(res.data, '-->res')
        return _get(res, 'data.data', null)
      })
    },
    /**
     * 获取用户信息
     * @param {*} params
     * @returns
     */
    async getUserInfoById (id) {
      return await $axios.post(`/rest/user/info/${id}`).then((res) => {
        return _get(res, 'data.data', null)
      })
    },
    /**
     * 更新用户信息
     * @param {*} params
     * @returns
     */
    async updateUserInfo (params) {
      return await $axios.post('/rest/user/update-info', params).then((res) => {
        return _get(res, 'data', null)
      })
    },
    /**
     * 更新用户其他信息
     * @param {*} params
     * @returns
     */
    async updateUserOtherInfo (params) {
      return await $axios.post('/rest/user/update-other', params).then((res) => {
        return _get(res, 'data', null)
      })
    },
    /**
     * 单独更新用户头像
     * @param {*} params
     * @returns
     */
    async updateUserAvatar (params) {
      return await $axios.post('/rest/user/update-avatar', params).then((res) => {
        return _get(res, 'data', null)
      })
    },
    /**
     * 获取关注用户
     * @param {*} params
     * @returns
     */
    async getFollowUsers (userId) {
      return await $axios.post('/rest/user/page-follower', {
        filter: userId,
        pageNo: 1,
        pageSize: 12
      }).then((res) => {
        return _get(res, 'data.data', null)
      })
    },
    /**
     * 关注
     * @param {*} params
     * @returns
     */
    async followUserById (userId) {
      return await $axios.post(`/rest/user/follow/${userId}`).then((res) => {
        return _get(res, 'data', null)
      })
    },
    /**
     * 取消关注
     * @param {*} params
     * @returns
     */
    async unFollowUserById (userId) {
      return await $axios.post(`/rest/user/cancel-follow/${userId}`).then((res) => {
        return _get(res, 'data', null)
      })
    },
    /**
     * 查询关注状态
     * @param {*} params
     * @returns
     */
    async checkFollowUserById (userId) {
      return await $axios.post(`/rest/user/has-follow/${userId}`).then((res) => {
        return _get(res, 'data', null)
      })
    },
    /**
     * 获取粉丝
     * @param {*} params
     * @returns
     */
    async getUserFans (userId = 0) {
      return await $axios.post('/rest/user/page-fans', {
        filter: userId,
        pageNo: 1,
        pageSize: 12
      }).then((res) => {
        return _get(res, 'data.data', null)
      })
    },
    /**
     * 查询用户操作记录统计信息
     * @param {*} params
     * @returns
     */
    async getUserActionRecord (messageId) {
      return await $axios.post('/rest/user/record-count').then((res) => {
        return _get(res, 'data', {})
      })
    },
    /**
     * 登录
     * @param {*} params
     * @returns
     */
    async userSignIn () {
      return await $axios.post('/rest/user/sign-in').then((res) => {
        return _get(res, 'data.code', 1)
      })
    },
    /**
     * 作者榜
     * @param {*} params
     * @returns
     */
    async getUserHonorList () {
      return await $axios.post('/rest/user/honor-list').then((res) => {
        return _get(res, 'data.data', [])
      })
    },
    /**
     * 获取评论动态
     * @param {*} params
     * @returns
     */
    async getCommentList (params) {
      return await $axios.post('/rest/comment/publish', params).then((res) => {
        return _get(res, 'data.data', null)
      })
    },
    /**
     * 我的点赞列表 - 文章
     * @param {*} params
     * @returns
     */
    async getLikeList (params) {
      return await $axios.post('/rest/approval/list/article', params).then((res) => {
        return _get(res, 'data.data', null)
      })
    },
    /**
     * 我的关注 - 用户
     * @param {*} params
     * @returns
     */
    async getFocusList (params) {
      return await $axios.post('/rest/user/page-follower', params).then((res) => {
        return _get(res, 'data.data', null)
      })
    },
    /**
     * 我的关注 - 用户
     * @param {*} params
     * @returns
     */
    async getUserByName (name) {
      return await $axios.post('/rest/user/page-search', {
        filter: name,
        pageNo: 1,
        pageSize: 15
      }).then((res) => {
        return _get(res, 'data.data.list', [])
      })
    }
  }
}

export default userApi

/**
 * 消息
 * */
import _get from 'lodash/get'
const messageApi = ($axios) => {
  return {
    /**
     * 获取未读消息数
     * @param {*} params
     * @returns
     */
    async getMessageCount () {
      return await $axios.post('/rest/message/count-un-read').then((res) => {
        return _get(res, 'data.data', 0)
      })
    },
    /**
     * 获取未读消息数
     * @param {*} params
     * @returns
     */
    async getMessageList ({ userId = '', pageNo = 1, pageSize = 20 }) {
      return await $axios.post('/rest/message/list', {
        filter: {
          userId,
          types: [
            'APPROVAL_ARTICLE',
            'COMMENT_ARTICLE',
            'APPROVAL_FAQ',
            'COMMENT_FAQ',
            'FOLLOW_USER'
          ]
        },
        pageNo,
        pageSize
      }).then((res) => {
        return _get(res, 'data.data.list', [])
      })
    },
    /**
     * 单条标记为已读
     * @param {*} params
     * @returns
     */
    async markMessageState (messageId) {
      return await $axios.post(`/rest/message/mark-is-read/${messageId}`).then((res) => {
        return _get(res, 'data', {})
      })
    },
    /**
     * 全部标记为已读
     * @param {*} params
     * @returns
     */
    async markMessageStateAll () {
      return await $axios.post('/rest/message/mark-all-read').then((res) => {
        return _get(res, 'data', {})
      })
    }
  }
}

export default messageApi

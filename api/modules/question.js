/**
 * QA
 * */
import _get from 'lodash/get'
const questionApi = ($axios) => {
  return {
    getUserQuestionList ({ userId = '', pageSize, pageNo }) {
      return $axios.post('/rest/faq/user-page', {
        pageSize,
        pageNo,
        filter: {
          userId,
          solution: 0
        }
      }).then((res) => {
        return _get(res, 'data.data', [])
      })
    },
    /**
     * 获取问题详情
    */
    async getQuestionDetail (id) {
      return await $axios.post(`/rest/faq/info/${id}`).then((res) => {
        return _get(res, 'data.data', null)
      })
    },
    /**
     * 添加问题
     */
    saveNewQuestion (question) {
      return $axios.post('/rest/faq/save', question).then((res) => {
        return _get(res, 'data', null)
      })
    },
    /**
     * 设置为最佳答案
     */
    setBestSolution (params) {
      return $axios.post('/rest/faq/solution', params).then((res) => {
        return _get(res, 'data', null)
      })
    }
  }
}

export default questionApi

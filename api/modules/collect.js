/**
 * 收藏
 * */
import _get from 'lodash/get'
const collectApi = ($axios) => {
  return {
    addCollect (name) {
      return $axios.post('/rest/collect/create', { name }).then((res) => {
        return _get(res, 'data')
      })
    },
    delCollect (collectId) {
      return $axios.post(`/rest/collect/delete/${collectId}`, {}).then((res) => {
        return _get(res, 'data')
      })
    },
    editCollect (params) {
      return $axios.post('/rest/collect/update/', params).then((res) => {
        return _get(res, 'data')
      })
    },
    getCollects () {
      return $axios.post('/rest/collect/page', {
        pageNo: 1,
        pageSize: 100
      }).then((res) => {
        return _get(res, 'data.data.list', [])
      })
    },
    addArticleForCollect (params) {
      return $axios.post('/rest/collect/add-posts', params).then((res) => {
        return _get(res, 'data.success', false)
      })
    },
    delArticleForCollect (params) {
      return $axios.post('/rest/collect/del-posts', params).then((res) => {
        return _get(res, 'data.success', false)
      })
    },
    getCollectStatus (articleId) {
      return $axios.post(`/rest/collect/is-collect/${articleId}`, {}).then((res) => {
        return _get(res, 'data.data', false)
      })
    },
    getCollectArticles (params) {
      return $axios.post('/rest/collect/page-posts', params).then((res) => {
        return _get(res, 'data.data.list', [])
      })
    }
  }
}

export default collectApi

import _get from 'lodash/get'
const articleApi = ($axios) => {
  return {
    getUserArticleList ({ userId = '', typeId = '', pageSize = 20, pageNo = 1 }) {
      return $axios.post('/rest/article/user-page', {
        pageSize,
        pageNo,
        filter: {
          typeId,
          userId
        }
      }).then((res) => {
        return _get(res, 'data.data', [])
      })
    },
    getActivityList (pageSize = 5, pageNo = 1) {
      return $axios.post('/rest/posts/activity/list', {
        pageSize,
        pageNo
      }).then((res) => {
        return _get(res, 'data.data', [])
      })
    },
    // getNoticeList (pageSize = 8, pageNo = 1) {
    //   return $axios.post('/rest/posts/notice/list', {
    //     pageSize,
    //     pageNo
    //   }).then((res) => {
    //     return _get(res, 'data.data', [])
    //   })
    // },
    getPostList (params) {
      return $axios.post('/rest/posts/list', {
        ...params
      }).then((res) => {
        return _get(res, params.data ? 'data.data' : 'data.data.list', [])
      })
    },
    getNoticeList (pageSize = 5, pageNo = 1) {
      return $axios.post('/rest/posts/list', {
        filter: {
          category: 'ARTICLE',
          tagIds: [376]
        },
        pageSize,
        pageNo
      }).then((res) => {
        return _get(res, 'data.data.list', [])
      })
    },
    getTopicList ({ filter, pageSize = 20, pageNo = 1 }) {
      return $axios.post('/rest/posts/list', {
        pageSize,
        pageNo,
        filter: {
          ...filter
        }
      }).then((res) => {
        return _get(res, 'data.data.list', [])
      })
    },
    getSearchList ({ filter, pageSize = 20, pageNo = 1 }) {
      return $axios.post('/rest/search/page-posts-search', {
        pageSize,
        pageNo,
        filter
      }).then((res) => {
        return _get(res, 'data.data.list', [])
      })
    },
    getFollowArticleList (pageSize = 20, pageNo = 1) {
      return $axios.post('/rest/posts/page-posts-food', {
        pageSize,
        pageNo,
        filter: {}
      }).then((res) => {
        return _get(res, 'data.data.list', [])
      })
    },
    /**
     * 获取文章详情
    */
    async getArticleDetail (id) {
      return await $axios.post(`/rest/article/info/${id}`).then((res) => {
        return _get(res, 'data.data', null)
      })
    },
    /**
     * 添加文章
    */
    saveNewArticle (article) {
      return $axios.post('/rest/article/save', article).then((res) => {
        return _get(res, 'data', null)
      })
    },
    /**
     * 删除文章
     */
    delArticleBy (articleId) {
      return $axios.post(`/rest/posts/delete/${articleId}`).then((res) => {
        return _get(res, 'data', null)
      })
    },
    /**
     * 获取文章的所有类别
    */
    getArticleTypes () {
      return $axios.post('/rest/article/type/all').then((res) => {
        return _get(res, 'data.data', [])
      })
    },
    /**
     * 获取文章的所有类别
    */
    getArticleTags () {
      return $axios.post('/rest/tag/query-all').then((res) => {
        return _get(res, 'data.data', [])
      })
    },
    /**
     * 获取评价列表
    */
    getCommentListByArticleId ({ id = '', pageSize = 20, pageNo = 1 }) {
      return $axios.post('/rest/comment/page', {
        filter: id,
        pageNo,
        pageSize
      }).then((res) => {
        return _get(res, 'data.data', [])
      })
    },
    /**
     * 评价
     */
    createCommentByArticle ({ postsId = '', content = '', replyId }) {
      return $axios.post('/rest/comment/create', {
        postsId,
        content,
        replyId
      }).then((res) => {
        return _get(res, 'data', null)
      })
    },
    /**
     * 删除评论
     */
    delCommentByCommentId (commentId) {
      return $axios.post(`/rest/comment/delete/${commentId}`, {}).then((res) => {
        return _get(res, 'data', null)
      })
    },
    /**
     * 获取点赞收藏状态
     */
    checkApprovalByArticle (postsId) {
      return $axios.post(`/rest/approval/has-approval/${postsId}`).then((res) => {
        return _get(res, 'data.data', false)
      })
    },
    /**
     * 点赞收藏
     */
    createApprovalByArticle (postsId) {
      return $axios.post(`/rest/approval/create/${postsId}`).then((res) => {
        return _get(res, 'data.code', -1)
      })
    },
    /**
     * 取消点赞收藏
     */
    cancelApprovalByArticle (postsId) {
      return $axios.post(`/rest/approval/delete/${postsId}`).then((res) => {
        return _get(res, 'data.code', -1)
      })
    },
    /**
     * 获取点赞列表
     */
    getApprovalListByArticle ({ pageSize = 8, pageNo = 1, filter = '' }) {
      return $axios.post('/rest/approval/list/user', {
        pageSize,
        pageNo,
        filter
      }).then((res) => {
        return _get(res, 'data.data', [])
      })
    },
    /**
     * ��nrd�片上传
     */
    uploadImageByArticle (data) {
      return $axios.post('/rest/file/image/upload-wang-editor', data, {
        header: 'multipart/form-data'
      }).then((res) => {
        return _get(res, 'data.data', [])
      })
    },
    /**
     * 获取随机推荐 - 随便看看
     */
    getRandomArticle () {
      return $axios.post('/rest/posts/random', {}).then((res) => {
        return _get(res, 'data.data', [])
      })
    },
    /**
     * 设置问题难度
     */
    setArticleScore (params) {
      return $axios.post('/rest/posts/difficulty-score', params).then((res) => {
        return _get(res, 'data')
      })
    }
  }
}

export default articleApi
